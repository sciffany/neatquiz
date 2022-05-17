import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../features/auth/firebase";
import {
  query,
  collection,
  getDocs,
  where,
  addDoc,
  orderBy,
} from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Dashboard.css";
import "../../components/common/Common.css";
import { Qna } from "../editor/Editor";

type Quiz = {
  id: string;
  title?: string;
  created?: string;
  description?: string;
  questions?: Qna[];
};

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    async function loadQuizzes() {
      const q = query(
        collection(db, "quizzes"),
        orderBy("created"),
        where("uid", "==", user!.uid)
      );
      const querySnapshot = await getDocs(q);
      setQuizzes(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
    if (!loading && !user) {
      return navigate("/");
    } else if (user) {
      loadQuizzes();
    }
  }, [user, loading, navigate]);

  const goToEditor = async () => {
    const newDoc = await addDoc(collection(db, "quizzes"), {
      uid: user?.uid,
      title: "Untitled",
      description: "",
      published: false,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    });
    navigate("/edit", {
      state: {
        quizId: newDoc.id,
      },
    });
  };

  const editQuiz = (quizId: string) => {
    navigate("/edit", {
      state: {
        quizId,
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
        {quizzes.map((quiz) => (
          <div className="decks__deck" key={quiz.id}>
            <div className="deck__title" onClick={() => editQuiz(quiz.id)}>
              {quiz.title}
            </div>
            <div>
              Created:{" "}
              {quiz.created?.substring(0, 10) +
                " " +
                quiz.created?.substring(11, 19)}
            </div>
            <div>{quiz.description !== "" ? quiz.description : "\n"}</div>
            <div>Number of Questions: {quiz.questions?.length || 0}</div>
          </div>
        ))}
        <div className="decks__deck">
          <button className="decks__createBtn" onClick={goToEditor}>
            New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
