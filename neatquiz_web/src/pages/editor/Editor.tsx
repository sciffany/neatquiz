import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../features/auth/firebase.js";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Editor.css";
import "../../components/common/Common.css";

export type Qna = {
  question: string;
  answer: string;
};

type Quiz = {
  title: string;
  description: string;
  published: boolean;
  questions: Qna[];
};

type EditorState = Quiz & { quizId: string };

function Editor() {
  const navigate = useNavigate();
  const location: { state: any } = useLocation();
  const [state, setState] = useState<EditorState>({
    quizId: "",
    title: "Untitled",
    description: "",
    questions: [],
    published: false,
  });
  const updateQuizTitle = (event: any) => {
    setState((state) => ({
      ...state,
      title: event.target.value,
    }));
  };
  const updateQuizDescription = (event: any) => {
    setState((state) => ({
      ...state,
      description: event.target.value,
    }));
  };
  const updateCheckbox = (event: any) => {
    setState((state) => ({
      ...state,
      published: event.target.checked,
    }));
  };
  const updateQna = (event: any, qnaIndex: number, type: string) => {
    const newQuestions = [...state.questions];
    newQuestions[qnaIndex] = {
      ...newQuestions[qnaIndex],
      [type]: event.target.value,
    };

    setState((state) => ({
      ...state,
      questions: newQuestions,
    }));
  };

  const deleteQna = (qnaIndex: number) => {
    const newQuestions = state.questions.filter(
      (_: any, index: number) => index !== qnaIndex
    );

    setState((state) => ({
      ...state,
      questions: newQuestions,
    }));
  };
  const addQna = () => {
    setState((state) => ({
      ...state,
      questions: [...state.questions, { question: "", answer: "" }],
    }));
  };

  const saveChanges = async () => {
    const quiz = doc(db, "quizzes", state.quizId);
    await updateDoc(quiz, {
      title: state.title,
      description: state.description,
      questions: state.questions,
      published: state.published,
      modified: new Date().toISOString(),
    });
  };
  const exit = async () => {
    const acceptDelete = window.confirm(
      "Are you sure you want to navigate away? Any unsaved changes will be lost"
    );
    if (acceptDelete) {
      navigate("/dashboard");
    }
  };
  const deleteQuiz = async () => {
    const acceptDelete = window.confirm(
      "Are you sure you want to delete this quiz? This action cannot be undone."
    );
    if (acceptDelete) {
      await deleteDoc(doc(db, "quizzes", state.quizId));
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    async function retrieveQuiz() {
      const quizId = location?.state?.quizId;
      const docRef = doc(db, "quizzes", quizId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return;
      const docData: Quiz = docSnap.data() as Quiz;
      setState((state) => ({
        ...state,
        ...docData,
        quizId,
      }));
    }
    retrieveQuiz();
  }, [location]);

  return (
    <div>
      <Navbar></Navbar>
      <div className="editor">
        <div className="editor__btnContainer">
          <div>
            Published
            <label className="switch">
              <input
                onChange={updateCheckbox}
                checked={state.published}
                type="checkbox"
              />
              <span className="slider round"></span>
            </label>
          </div>
          <button className="editor__saveBtn" onClick={saveChanges}>
            Save Changes
          </button>
          <button className="editor__discardBtn" onClick={exit}>
            Exit
          </button>
          <button className="editor__deleteBtn" onClick={deleteQuiz}>
            Delete Quiz
          </button>
        </div>
        <div className="bold">Quiz Title</div>
        <input
          className="giga-font bold"
          value={state.title}
          onChange={updateQuizTitle}
        ></input>

        <div className="editor__descLabel">Description</div>
        <textarea
          className="editor__description"
          value={state.description}
          onChange={updateQuizDescription}
        ></textarea>

        <div className="bold editor__qnHeading">Quiz Questions</div>

        <div className="editor__qnaContainer">
          {state.questions.map((qna, qnaIndex) => (
            <div className="editor__qnaBox">
              <div className="editor__qElement">
                <div className="editor__label">Question</div>
                <input
                  value={qna.question}
                  className="editor__input"
                  onChange={(event) => updateQna(event, qnaIndex, "question")}
                ></input>
              </div>
              <div className="editor__aElement">
                <div className="editor__label">Possible Answers</div>
                <input
                  value={qna.answer}
                  className="editor__input"
                  onChange={(event) => updateQna(event, qnaIndex, "answer")}
                ></input>
              </div>
              <div className="editor__qnaBtnContainer">
                <button
                  className="editor__deleteQnBtn"
                  onClick={() => deleteQna(qnaIndex)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button className="editor__saveBtn" onClick={addQna}>
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
export default Editor;
