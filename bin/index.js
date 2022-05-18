"use strict";
// import { db } from "./firebase";
// import {
//   query,
//   collection,
//   getDocs,
//   where,
//   addDoc,
//   orderBy,
// } from "firebase/firestore";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
// const Telebot = require("telebot");
// const bot = new Telebot(process.env.TELEGRAM_BOT_TOKEN);
// async function main(msg) {
//   const q = query(collection(db, "quizzes"), orderBy("created", "desc"));
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((doc) => {
//     msg.reply.text(JSON.stringify(doc.data()));
//   });
// }
// // bot.start((ctx) => ctx.reply("Welcome"));
// // bot.on("text", (ctx) => {
// //   // Explicit usage
// //   ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
// //   // Using context shortcut
// //   ctx.reply(`Hello ${ctx.state.role}`);
// // });
// // enum Mode {
// //   Active,
// //   Searching,
// //   Playing,
// //   Polling,
// //   Inactive,
// // }
// // type BotState = {
// //   mode: Mode;
// // };
// // const state: BotState = { mode: Mode.Active };
// // function searchQuiz(text: string) {
// //   state.mode = Mode.Searching;
// // }
// bot.start();
// // bot.command("/hello", Telegraf.reply("Welcome to NeatQuiz!"));
// bot.on(["/hello"], (msg) => msg.reply.text("Welcome to NeatQuiz!"));
// bot.on(["/test"], (msg) => main(msg));
// // bot.on(/^\/search (.+)$/, (msg, props) => {
// //   const text = props.match[1];
// //   searchQuiz(text);
// //   msg.reply(text);
// // });
// // process.once("SIGINT", () => bot.stop("SIGINT"));
// // process.once("SIGTERM", () => bot.stop("SIGTERM"));
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply("Hello " + ctx.from.first_name + "!");
});
bot.help((ctx) => {
    ctx.reply("Send /start to receive a greeting");
    ctx.reply("Send /keyboard to receive a message with a keyboard");
    ctx.reply("Send /quit to stop the bot");
});
bot.command("quit", (ctx) => {
    // Explicit usage
    ctx.telegram.leaveChat(ctx.message.chat.id);
    // Context shortcut
    ctx.leaveChat();
});
// bot.on("text", (ctx) => {
//   ctx.reply("simple");
// });
bot.command("oldschool", (ctx) => ctx.reply("Hello"));
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
