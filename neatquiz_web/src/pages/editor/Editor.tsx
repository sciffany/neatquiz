import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../features/auth/firebase.js";
import {
  query,
  collection,
  getDocs,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Editor.css";
import "../../components/common/Common.css";

export type Qna = {
  question: string;
  answer: string;
};

type EditorState = {
  quizId: string;
  quizTitle: string;
  quizQuestions: Qna[];
  quizPublished: boolean;
};

function Editor(params: any) {
  const navigate = useNavigate();
  const location: { state: any } = useLocation();
  const [state, setState] = useState<EditorState>({
    quizId: "",
    quizTitle: "Untitled",
    quizQuestions: [],
    quizPublished: false,
  });
  const gotoDashboard = () => {
    navigate("/dashboard");
  };
  const updateQuizTitle = (event: any) => {
    const newQuizTitle = event.target.value;
    setState((state) => ({
      ...state,
      quizTitle: newQuizTitle,
    }));
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
    setState((state) => ({
      ...state,
      quizId: location?.state?.quizId,
    }));
  }, []);

  function checkDirty() {}

  return (
    <div>
      <Navbar></Navbar>
      <div className="editor">
        <div className="editor__btnContainer">
          <div>
            Published
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <button className="editor__saveBtn" onClick={gotoDashboard}>
            Save Changes
          </button>
          <button className="editor__discardBtn" onClick={gotoDashboard}>
            Discard Changes
          </button>
          <button className="editor__deleteBtn" onClick={deleteQuiz}>
            Delete Quiz
          </button>
        </div>
        <div className="bold">Quiz Title</div>
        <input
          className="giga-font bold"
          value={state.quizTitle}
          onChange={updateQuizTitle}
        ></input>

        <div className="editor__descLabel">Description</div>
        <textarea className="editor__description"></textarea>

        <div className="bold editor__qnHeading">Quiz Questions</div>

        <div className="editor__qnaContainer">
          <div className="editor__qnaBox">
            <div className="editor__qElement">
              <div className="editor__label">Question</div>
              <input className="editor__input" onChange={checkDirty}></input>
            </div>
            <div className="editor__aElement">
              <div className="editor__label">Possible Answers</div>
              <input className="editor__input" onChange={checkDirty}></input>
            </div>
            <div className="editor__qnaBtnContainer">
              <button className="editor__deleteQnBtn" onClick={gotoDashboard}>
                Delete
              </button>
            </div>
          </div>

          <button className="editor__saveBtn" onClick={gotoDashboard}>
            Add Question
          </button>

          {JSON.stringify(state)}
        </div>
      </div>
    </div>
  );
}
export default Editor;
