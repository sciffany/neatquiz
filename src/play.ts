import { Constants } from "./constants";
import { Mode } from "./types";
import { getBotState, resetToChoosingQuestion } from "./utils";

export function askQuestion(ctx: any) {
  const botState = getBotState(ctx);
  ctx.reply(
    `Question ${botState.qNumber + 1}:\n` +
      botState.qna[botState.qNumber].question
  );
  botState.mode = Mode.Answering;
  botState.expectedAnswers = botState.qna[botState.qNumber].answer
    .toLowerCase()
    .split(",")
    .map((expectedAnswer) => expectedAnswer.trim());
}

export function handleAnswer(ctx: any) {
  const botState = getBotState(ctx);
  if (botState.mode !== Mode.Answering) return;
  const answer = ctx.match.input;
  if (
    botState.expectedAnswers.some((expectedAnswer: string) =>
      answer.toLowerCase().startsWith(expectedAnswer)
    )
  ) {
    updateScore(ctx);
    broadcastScore(ctx, ctx.from.first_name);
    botState.qNumber++;
    botState.mode = Mode.Asking;
    if (botState.qNumber == botState.qna.length) {
      endGame(ctx);
    } else {
      setTimeout(() => askQuestion(ctx), Constants.questionInterval);
    }
  }
}

function updateScore(ctx: any) {
  const botState = getBotState(ctx);
  const id = ctx.from.id;
  const first_name = ctx.from.first_name;
  if (!botState.scoreBoard.hasOwnProperty(id)) {
    botState.scoreBoard[id] = 0;
  }
  botState.scoreBoard[id] += 5;
  botState.playerNames[id] = first_name;
}

function broadcastScore(ctx: any, winner: string) {
  const botState = getBotState(ctx);
  ctx.reply(
    `Yes, it's ${
      botState.qna[botState.qNumber].answer.split(",")[0]
    }!\n${winner} got it right. 5 marks!` +
      "\n\n" +
      "Scores:\n" +
      generateScoreBoard(ctx)
  );
}

function generateScoreBoard(ctx) {
  const botState = getBotState(ctx);
  return Object.keys(botState.scoreBoard)
    .map(
      (id) => "💎 " + botState.playerNames[id] + " - " + botState.scoreBoard[id]
    )
    .join("\n");
}

function endGame(ctx: any) {
  resetToChoosingQuestion(ctx);
  ctx.reply("Congrats to all the winners!");
}

export function endGamePrematurely(ctx: any) {
  ctx.reply(
    "Game ended. Congrats to all the winners!\n" + generateScoreBoard(ctx)
  );
  resetToChoosingQuestion(ctx);
}

export async function skipQuestion(ctx: any) {
  const botState = getBotState(ctx);
  ctx.reply(`${botState.mode}`);
  if (botState.mode !== Mode.Answering) return;
  ctx.reply(
    `The answer was ${
      botState.qna[botState.qNumber].answer.split(",")[0]
    }!\nNobody got it right` +
      "\n\n" +
      "Scores:\n" +
      generateScoreBoard(ctx)
  );
  botState.qNumber++;
  if (botState.qNumber == botState.qna.length) {
    endGame(ctx);
  } else {
    setTimeout(() => askQuestion(ctx), Constants.questionInterval);
  }
}
