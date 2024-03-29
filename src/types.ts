export enum Mode {
  Active = "Active",
  ChooseQuestion = "ChooseQuestion",
  Asking = "Asking",
  Answering = "Answering",
  Inactive = "Inactive",
}

type Qna = {
  question: string;
  answer: string;
};

export type BotState = {
  mode: Mode;
  quizChoices: string[];
  qna: Qna[];
  qNumber: number;
  expectedAnswers: string[];
  hintNumber: number;
  hintMask: number[];
  scoreBoard: { [id: string]: number };
  playerNames: { [id: string]: string };
  menuId: string;
};
