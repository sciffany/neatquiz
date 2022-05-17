import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../features/auth/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "../../components/common/Navbar";
import "./Dashboard.css";
import "../../components/common/Common.css";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);
  const goToEditor = () => {
    navigate("/edit");
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
