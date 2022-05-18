import { botState, Mode } from "./index";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function askQuestion(ctx: any) {
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

export async function handleAnswer(ctx: any) {
  if (botState.mode !== Mode.Answering) return;
  const answer = ctx.match.input;
  if (
    botState.expectedAnswers.some((expectedAnswer: string) =>
      answer.toLowerCase().startsWith(expectedAnswer)
    )
  ) {
    updateScore(ctx.from.id, ctx.from.first_name);
    broadcastScore(ctx, ctx.from.first_name);
    botState.qNumber++;
    botState.mode = Mode.Asking;
    if (botState.qNumber == botState.qna.length) {
      endGame(ctx);
    } else {
      await sleep(5000);
      askQuestion(ctx);
    }
  }
}

function updateScore(id, first_name) {
  if (!botState.scoreBoard.hasOwnProperty(id)) {
    botState.scoreBoard[id] = 0;
  }
  botState.scoreBoard[id] += 5;
  botState.playerNames[id] = first_name;
}

function broadcastScore(ctx: any, winner: string) {
  ctx.reply(
    `Yes, it's ${
      botState.qna[botState.qNumber].answer.split(",")[0]
    }!\n${winner} got it right. 5 marks!` +
      "\n\n" +
      "Scores:\n" +
      generateBoard()
  );
}

function generateBoard() {
  return Object.keys(botState.scoreBoard)
    .map(
      (id) => "💎 " + botState.playerNames[id] + " - " + botState.scoreBoard[id]
    )
    .join("\n");
}

function endGame(ctx: any) {
  ctx.reply("Congrats to all the winners!");
  botState.mode = Mode.Active;
  botState.quizChoices = [];
  botState.qna = [];
  botState.qNumber = 0;
  botState.expectedAnswers = [];
}

export async function skipQuestion(ctx: any) {
  ctx.reply(`${botState.mode}`);
  if (botState.mode !== Mode.Answering) return;
  ctx.reply(
    `The answer was ${
      botState.qna[botState.qNumber].answer.split(",")[0]
    }!\nNobody got it right` +
      "\n\n" +
      "Scores:\n" +
      generateBoard()
  );
  botState.qNumber++;
  if (botState.qNumber == botState.qna.length) {
    endGame(ctx);
  } else {
    await sleep(5000);
    askQuestion(ctx);
  }
}
