require("dotenv").config();

const TeleBot = require("telebot");
const bot = new TeleBot(process.env.TELEGRAM_BOT_TOKEN);

bot.start();

function startGame(msg) {
  msg.reply.text("Welcome to NeatQuiz, Natasha!" + msg.from.id);
}

bot.on(["/hello"], (msg) => msg.reply.text("Welcome to NeatQuiz!"));
bot.on(["/game"], startGame);
