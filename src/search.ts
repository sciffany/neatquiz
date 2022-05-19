import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Mode } from "./types";
import { askQuestion } from "./play";
import { getBotState } from "./utils";

require("dotenv").config();
const algoliasearch = require("algoliasearch");
const client = algoliasearch("SWVXM265XB", process.env.ALGOLIA_API_KEY);
const index = client.initIndex("quizzes");

export async function searchQuiz(ctx: any) {
  const botState = getBotState(ctx);
  try {
    if (botState.mode !== Mode.Active && botState.mode !== Mode.ChooseQuestion)
      return;
    const searchString = ctx.match[1];
    const searchResults = await index.search(searchString);

    botState.mode = Mode.ChooseQuestion;
    botState.quizChoices = searchResults.hits.map(
      (searchResults) => searchResults.objectID
    );
    const quizMenu = searchResults.hits
      .map(
        (searchResult, index) =>
          `/quiz_${index + 1}\n${searchResult.title}\n${
            searchResult.description
          }`
      )
      .join("\n\n");

    if (quizMenu.length > 0) {
      ctx.reply("Which quiz would you like to take?\n\n" + quizMenu);
    } else {
      ctx.reply(`Sorry, no results were found for '${searchString}'.`);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function chooseQuiz(ctx: any) {
  const botState = getBotState(ctx);
  try {
    if (!botState.quizChoices.length) return;
    if (botState.mode !== Mode.ChooseQuestion) return;

    const questionNumber = parseInt(ctx.match[0].slice(6)) - 1;
    if (questionNumber < 0 || questionNumber >= botState.quizChoices.length)
      return;

    const docRef = doc(db, "quizzes", botState.quizChoices[questionNumber]);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const quizData = docSnap.data();
      botState.qna = quizData.questions;
      botState.mode = Mode.Asking;
      askQuestion(ctx);
    }
  } catch (err) {
    console.log(err);
  }
}
