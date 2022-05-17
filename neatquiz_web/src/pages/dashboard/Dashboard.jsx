import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../features/auth/firebase";
import { query, collection, getDocs, where, addDoc } from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Dashboard.css";
import "../../components/common/Common.css";

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading && !user) return navigate("/");
  }, [user, loading, navigate]);

  const goToEditor = async () => {
    const newDoc = await addDoc(collection(db, "quizzes"), {
      uid: user.uid,
    });
    navigate("/edit", {
      state: {
        quizId: newDoc.id,
      },
    });
  };

  return (
    <div>
      <Navbar></Navbar>

      <div className="decks">
        <div className="giga-font bold">My Quizzes</div>
        <div className="decks__hr">
          <hr />
        </div>
        <div className="decks__br"></div>
        <div className="decks__deck">
          <div className="deck__title">Words Ending in -IST</div>
          <div>Guess these words ending in -IST</div>
          <div>Quiz Length: 20</div>
        </div>
        <div className="decks__deck">
          <div className="deck__title">Words Ending in -IST#2</div>
          <div>Guess these words ending in -IST</div>
          <div>Quiz Length: 200</div>
        </div>
        <div className="decks__deck">
          <button className="decks__createBtn" onClick={goToEditor}>
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
