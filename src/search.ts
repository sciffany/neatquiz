import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Mode } from "./types";
import { askQuestion, showInstructions } from "./play";
import { getBotState } from "./utils";
import { Constants } from "./constants";

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
    if (searchString !== "" && searchString[0] !== " ") {
      return;
    }
    const searchResults =
      searchString === ""
        ? await retrieveAll()
        : (
            await index.search(searchString, {
              filters: "published:true",
            })
          ).hits;
    const docIdIdentifier = searchString === "" ? "id" : "objectID";

    botState.mode = Mode.ChooseQuestion;
    botState.quizChoices = searchResults.map(
      (searchResults) => searchResults[docIdIdentifier]
    );

    const quizMenu = searchResults
      .map(
        (searchResult, index) =>
          `/quiz_${index + 1}\n${searchResult.title}\n${
            searchResult.description
          }\nQuestions: ${searchResult.quizLength}`
      )
      .join("\n\n");

    if (quizMenu.length > 0) {
      botState.menuId = (
        await ctx.reply("Which quiz would you like to take?\n\n" + quizMenu)
      ).message_id;
    } else {
      ctx.reply(
        `Sorry, no results were found for '${searchString}'${Constants.invite}`
      );
    }
  } catch (err) {
    console.log(err);
  }
}

export async function retrieveAll() {
  const q = query(
    collection(db, "quizzes"),
    orderBy("created", "desc"),
    where("published", "==", true)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export async function chooseQuiz(ctx: any) {
  const botState = getBotState(ctx);
  try {
    if (!botState.quizChoices.length) return;
    if (botState.mode !== Mode.ChooseQuestion) return;

    const chosenQuiz = ctx.match[0];
    const questionNumber = parseInt(chosenQuiz.slice(6, chosenQuiz.length)) - 1;
    if (questionNumber < 0 || questionNumber >= botState.quizChoices.length)
      return;

    const docRef = doc(db, "quizzes", botState.quizChoices[questionNumber]);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const quizData = docSnap.data();
      botState.qna = quizData.questions;
      botState.mode = Mode.Asking;
      showInstructions(ctx, quizData.description);
    }
  } catch (err) {
    console.log(err);
  }
}

export function showMenuAgain(ctx: any) {
  const botState = getBotState(ctx);
  if (botState.mode !== Mode.ChooseQuestion) return;
  ctx.reply("Your quiz menu once again", {
    reply_to_message_id: botState.menuId,
  });
}
