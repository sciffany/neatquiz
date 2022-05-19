import { botStates } from ".";
import { BotState, Mode } from "./types";

export function getBotState(ctx: any) {
  const botState = botStates[ctx.message.chat.id];
  if (!botState) createEmptyBotState(ctx);
  return botStates[ctx.message.chat.id];
}

export const emptyBotState: BotState = {
  mode: Mode.Active,
  quizChoices: [],
  qna: [],
  qNumber: 0,
  expectedAnswers: [],
  scoreBoard: {},
  playerNames: {},
};

export function createEmptyBotState(ctx: any) {
  botStates[ctx.message.chat.id] = {
    mode: Mode.Active,
    quizChoices: [],
    qna: [],
    qNumber: 0,
    expectedAnswers: [],
    scoreBoard: {},
    playerNames: {},
  };
}

export function resetToChoosingQuestion(ctx: any) {
  botStates[ctx.message.chat.id] = {
    qna: [],
    qNumber: 0,
    expectedAnswers: [],
    scoreBoard: {},
    playerNames: {},
    mode: Mode.ChooseQuestion,
    quizChoices: botStates[ctx.message.chat.id].quizChoices,
  };
}

export function debugObj(ctx: any, obj: object) {
  ctx.reply(JSON.stringify(obj));
}
