"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("./search");
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
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.hears("/start", (ctx) => ctx.reply("Hi, welcome to NeatQuiz!"));
bot.hears(/^\/search (.+)$/, search_1.searchQuiz);
bot.startPolling();
var Mode;
(function (Mode) {
    Mode[Mode["Active"] = 0] = "Active";
    Mode[Mode["Searching"] = 1] = "Searching";
    Mode[Mode["Playing"] = 2] = "Playing";
    Mode[Mode["Polling"] = 3] = "Polling";
    Mode[Mode["Inactive"] = 4] = "Inactive";
})(Mode || (Mode = {}));
const state = { mode: Mode.Active };
