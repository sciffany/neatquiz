import { Constants } from "./constants";
import {
  endGamePrematurely,
  giveHint,
  handleAnswer,
  skipQuestion,
} from "./play";
import { chooseQuiz, searchQuiz, showMenuAgain } from "./search";
import { BotState, Mode } from "./types";
import { getBotState } from "./utils";

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
export const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  username: "NeatQuiz" + process.env.TELEGRAM_BOT_TOKEN?.slice(0, 2),
});

bot.hears(/\/hello(@neatquizbot)*/, (ctx) =>
  ctx.reply("Hi, welcome to NeatQuiz!")
);
bot.hears(/^\/search$/, searchQuiz);
bot.hears(/^\/quiz_[1-9]+/, async (ctx) => await chooseQuiz(ctx));
bot.hears("/natasha", (ctx) => ctx.reply("🐰🥚"));
bot.hears(/\/next(@neatquizbot)*/, async (ctx) => await skipQuestion(ctx));
bot.hears(/\/hint(@neatquizbot)*/, async (ctx) => await giveHint(ctx));
bot.hears(/\/end(@neatquizbot)*/, async (ctx) => await endGamePrematurely(ctx));
bot.hears(/\/about(@neatquizbot)*/, (ctx) => ctx.reply(Constants.about));
bot.hears(/\/menu(@neatquizbot)*/, (ctx) => showMenuAgain(ctx));
bot.hears(/./, (ctx) => handleGenericResponse(ctx));

bot.startPolling();

export const botStates: { [id: string]: BotState } = {};

async function handleGenericResponse(ctx: any) {
  const botState = getBotState(ctx);
  if (botState.mode == Mode.Answering) {
    handleAnswer(ctx);
  }
}
