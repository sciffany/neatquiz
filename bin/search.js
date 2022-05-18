"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchQuiz = void 0;
require("dotenv").config();
const algoliasearch = require("algoliasearch");
const client = algoliasearch("SWVXM265XB", process.env.ALGOLIA_API_KEY);
const index = client.initIndex("quizzes");
async function searchQuiz(ctx) {
    const searchString = ctx.match[1];
    const searchResult = index.search(searchString);
    ctx.reply(searchResult);
    console.log(searchResult);
    console.log(searchResult.hits);
    //   const q = query(collection(db, "quizzes"), orderBy("created", "desc"));
    //   const querySnapshot = await getDocs(q);
    //   querySnapshot.forEach((doc) => {
    //     ctx.reply(JSON.stringify(doc.data()));
    //   });
}
exports.searchQuiz = searchQuiz;
