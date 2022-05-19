import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { botState, Mode } from "./index";
import { askQuestion } from "./play";

require("dotenv").config();
const algoliasearch = require("algoliasearch");
const client = algoliasearch("SWVXM265XB", process.env.ALGOLIA_API_KEY);
const index = client.initIndex("quizzes");

export async function searchQuiz(ctx: any) {
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
    ctx.reply("Which quiz would you like to take?\n\n" + quizMenu);
  } catch (err) {
    console.log(err);
  }
}

export async function chooseQuiz(ctx: any) {
  try {
    if (!botState.quizChoices.length) return;
    if (botState.mode !== Mode.ChooseQuestion) return;

    const searchString = ctx.match[0].slice(6);
    const docRef = doc(
      db,
      "quizzes",
      botState.quizChoices[parseInt(searchString) - 1]
    );
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
