import { botStates } from ".";
import { BotState, Mode } from "./types";

export function getBotState(ctx: any) {
  const botState = botStates[ctx.message.chat.id];
  if (!botState) createEmptyBotState(ctx);
  return botStates[ctx.message.chat.id];
}

export function createEmptyBotState(ctx: any) {
  botStates[ctx.message.chat.id] = {
    mode: Mode.Active,
    quizChoices: [],
    qna: [],
    qNumber: 0,
    expectedAnswers: [],
    scoreBoard: {},
    playerNames: {},
    menuId: "",
    hintMask: [],
    hintNumber: 0,
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
    menuId: botStates[ctx.message.chat.id].menuId,
    hintMask: [],
    hintNumber: 0,
  };
}

export function debugObj(ctx: any, obj: object) {
  ctx.reply(JSON.stringify(obj));
}
