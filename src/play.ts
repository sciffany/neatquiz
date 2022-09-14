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
    const addedMarks = 5 - (botState.hintNumber >= 4 ? 4 : botState.hintNumber);
    updateScore(ctx, addedMarks);
    broadcastScore(ctx, ctx.from.first_name, addedMarks);
    botState.qNumber++;
    botState.mode = Mode.Asking;
    botState.hintMask = [];
    botState.hintNumber = 0;
    if (botState.qNumber !== botState.qna.length) {
      setTimeout(() => askQuestion(ctx), Constants.questionInterval);
    } else {
      resetToChoosingQuestion(ctx);
    }
  }
}

export function giveHint(ctx: any) {
  const botState = getBotState(ctx);
  if (botState.mode !== Mode.Answering) return;

  const ans = botState.qna[botState.qNumber].answer.split(",")[0];
  if (botState.hintNumber == 0) {
    botState.hintMask = new Array(ans.length).fill(0);
  }
  let hint = "";

  for (var i = 0; i < ans.length; i++) {
    if (ans[i] === " " || ans[i] === "'") {
      botState.hintMask[i] = 1;
    }
  }

  if (botState.hintNumber > 0) {
    var lettersToReveal = ans.length * 0.2;
    for (var i = 0; i < lettersToReveal; i++) {
      while (true) {
        const indexToReveal = Math.floor(Math.random() * ans.length);
        if (botState.hintMask[indexToReveal] !== 1) {
          botState.hintMask[indexToReveal] = 1;
          break;
        }
      }
    }
  }

  for (var i = 0; i < ans.length; i++) {
    if (botState.hintMask[i] === 1) {
      hint += ans[i] + " ";
    } else {
      hint += "_ ";
    }
  }
  botState.hintNumber += 1;

  ctx.reply(hint);
}

function updateScore(ctx: any, addedMarks: number) {
  const botState = getBotState(ctx);
  const id = ctx.from.id;
  const first_name = ctx.from.first_name;
  if (!botState.scoreBoard.hasOwnProperty(id)) {
    botState.scoreBoard[id] = 0;
  }
  botState.scoreBoard[id] += addedMarks;

  botState.playerNames[id] = first_name;
}

function broadcastScore(ctx: any, winner: string, addedMarks: number) {
  const botState = getBotState(ctx);
  ctx.reply(
    `Yes, it's ${
      botState.qna[botState.qNumber].answer.split(",")[0]
    }!\n${winner} got it right. ${addedMarks} marks!` +
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
