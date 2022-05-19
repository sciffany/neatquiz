import { Set } from "typescript";
import { handleAnswer, skipQuestion } from "./play";
import { chooseQuiz, searchQuiz } from "./search";

require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");
const expressApp = express();

////////////////////////
//    Start server    //
////////////////////////
const port = process.env.PORT || 3000;
expressApp.get("/", (_, res) => {
  res.send("Hello World!");
});
expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

////////////////////////
//     Bot setup      //
////////////////////////
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  username: "NeatQuiz" + process.env.TELEGRAM_BOT_TOKEN?.slice(0, 2),
});
bot.hears("/start", (ctx) => ctx.reply("Hi, welcome to NeatQuiz!"));
bot.hears(/^\/search (.+)$/, searchQuiz);
bot.hears(/^\/quiz_[1-9]/, async (ctx) => await chooseQuiz(ctx));
bot.hears("/natasha", (ctx) => ctx.reply("🐰🥚"));
bot.hears("/next", async (ctx) => await skipQuestion(ctx));
bot.hears(/./, async (ctx) => await handleGenericResponse(ctx));

bot.startPolling();

////////////////////////
//     Bot state      //
////////////////////////
export enum Mode {
  Active,
  ChooseQuestion,
  Asking,
  Answering,
  Inactive,
}

type Qna = {
  question: string;
  answer: string;
};

type BotState = {
  mode: Mode;
  quizChoices: string[];
  qna: Qna[];
  qNumber: number;
  expectedAnswers: string[];
  scoreBoard: { [id: string]: number };
  playerNames: { [id: string]: string };
};

export const botState: BotState = {
  mode: Mode.Active,
  quizChoices: [],
  qna: [],
  qNumber: 0,
  expectedAnswers: [],
  scoreBoard: {},
  playerNames: {},
};

async function handleGenericResponse(ctx: any) {
  if (botState.mode == Mode.Answering) {
    await handleAnswer(ctx);
  }
}
