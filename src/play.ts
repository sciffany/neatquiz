import { botState, Mode } from "./index";

export function askQuestion(ctx: any) {
  if (botState.qNumber == botState.qna.length) {
    endGame(ctx);
  }

  ctx.reply("Question 1:\n" + botState.qna[botState.qNumber].question);
  botState.mode = Mode.Answering;
  botState.expectedAnswers = botState.qna[botState.qNumber].answer
    .toLowerCase()
    .split(",")
    .map((expectedAnswer) => expectedAnswer.trim());
}
export function handleAnswer(ctx: any) {
  const answer = ctx.match.input;
  if (
    botState.expectedAnswers.some((expectedAnswer: string) =>
      answer.toLowerCase().startsWith(expectedAnswer)
    )
  ) {
    updateScore(ctx.from.id, ctx.from.first_name);
    broadcastScore(ctx, ctx.from.first_name);
    botState.qNumber++;
    askQuestion(ctx);
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
      Object.keys(botState.scoreBoard)
        .map(
          (id) =>
            "💎 " + botState.playerNames[id] + " - " + botState.scoreBoard[id]
        )
        .join("\n")
  );
}

function endGame(ctx: any) {
  ctx.reply("Congrats!");
}
