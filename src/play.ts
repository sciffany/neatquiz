import { Constants } from "./constants";
import { Mode } from "./types";
import { getBotState, resetToChoosingQuestion } from "./utils";

export function showInstructions(ctx: any, description: string) {
  const botState = getBotState(ctx);
  ctx.reply("Instructions: " + description);
  setTimeout(() => askQuestion(ctx), Constants.questionInterval);
}

export function askQuestion(ctx: any) {
  const botState = getBotState(ctx);
  ctx.reply(
    `Question ${botState.qNumber + 1} of ${
      botState.qna.length
    }\n--------------------------------\n` +
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
    if (botState.qNumber !== botState.qna.length) {
      setTimeout(() => askQuestion(ctx), Constants.questionInterval);
    } else {
      resetToChoosingQuestion(ctx);
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

type ScoreBoardParams = {
  gameEndedPrematurely?: boolean;
};

function generateScoreBoard(ctx, opts?: ScoreBoardParams) {
  const botState = getBotState(ctx);
  return (
    Object.keys(botState.scoreBoard)
      .map(
        (id) =>
          "💎 " + botState.playerNames[id] + " - " + botState.scoreBoard[id]
      )
      .join("\n") +
    (botState.qNumber === botState.qna.length - 1 || opts?.gameEndedPrematurely
      ? Constants.endGameMessage
      : "")
  );
}

export function endGamePrematurely(ctx: any) {
  const botState = getBotState(ctx);
  if (botState.mode !== Mode.Answering && botState.mode !== Mode.Asking) return;
  ctx.reply(
    "Game stopped." + generateScoreBoard(ctx, { gameEndedPrematurely: true })
  );
  resetToChoosingQuestion(ctx);
}

export async function skipQuestion(ctx: any) {
  const botState = getBotState(ctx);
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
  if (botState.qNumber !== botState.qna.length) {
    setTimeout(() => askQuestion(ctx), Constants.questionInterval);
  } else {
    resetToChoosingQuestion(ctx);
  }
}
