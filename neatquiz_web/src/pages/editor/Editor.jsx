import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../features/auth/firebase";
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
    navigate("/edit");
  };
  const updateQuizTitle = (event) => {
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
        <div className="bold">Quiz Title</div>
        <input
          className="giga-font bold"
          value={state.quizTitle}
          onChange={updateQuizTitle}
        ></input>

        <div className="bold editor__qnHeading">Quiz Questions</div>

        <div>Question</div>

        <button className="editor__backBtn" onClick={gotoDashboard}>
          back
        </button>
      </div>
    </div>
  );
}
export default Editor;
