import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../features/auth/firebase.js";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Editor.css";
import "../../components/common/Common.css";

function Editor() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [state, setState] = useState({
    creating: true,
    quizId: "",
    quizTitle: "",
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

  useEffect(() => {}, []);

  return (
    <div>
      <Navbar></Navbar>
      <div className="editor">
        <div className="editor__btnContainer">
          <button className="editor__saveBtn" onClick={gotoDashboard}>
            Save
          </button>
          <button className="editor__discardBtn" onClick={gotoDashboard}>
            Discard
          </button>
        </div>
        <div className="bold">Quiz Title</div>
        <input
          className="giga-font bold"
          value={state.quizTitle}
          onChange={updateQuizTitle}
        ></input>

        <div className="bold editor__qnHeading">Quiz Questions</div>

        <div className="editor__qnaContainer">
          <div className="editor__qnaBox">
            <div className="editor__qnaBtnContainer">
              <button className="editor__discardBtn" onClick={gotoDashboard}>
                Discard
              </button>
            </div>
            <div className="editor__label">Question</div>
            <input value={state.quizTitle} onChange={updateQuizTitle}></input>
            <div className="editor__label">Possible Answers</div>
            <input value={state.quizTitle} onChange={updateQuizTitle}></input>
          </div>

          <div className="editor__qnaBox">
            <div className="editor__qnaBtnContainer">
              <button className="editor__discardBtn" onClick={gotoDashboard}>
                Discard
              </button>
            </div>
            <div className="editor__label">Question</div>
            <input value={state.quizTitle} onChange={updateQuizTitle}></input>
            <div className="editor__label">Possible Answers</div>
            <input value={state.quizTitle} onChange={updateQuizTitle}></input>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Editor;
