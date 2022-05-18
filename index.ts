require("dotenv").config();

const Telebot = require("telebot");
const bot = new Telebot(process.env.TELEGRAM_BOT_TOKEN);
// const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// bot.start((ctx) => ctx.reply("Welcome"));

// bot.on("text", (ctx) => {
//   // Explicit usage
//   ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

//   // Using context shortcut
//   ctx.reply(`Hello ${ctx.state.role}`);
// });

// enum Mode {
//   Active,
//   Searching,
//   Playing,
//   Polling,
//   Inactive,
// }

// type BotState = {
//   mode: Mode;
// };
// const state: BotState = { mode: Mode.Active };

// function searchQuiz(text: string) {
//   state.mode = Mode.Searching;
// }

bot.start();
// bot.command("/hello", Telegraf.reply("Welcome to NeatQuiz!"));
bot.on(["/hello"], (msg) => msg.reply.text("Welcome to NeatQuiz!"));
// bot.on(/^\/search (.+)$/, (msg, props) => {
//   const text = props.match[1];
//   searchQuiz(text);
//   msg.reply(text);
// });

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
