import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../features/auth/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import "./Navbar.css";

function Navbar() {
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

  return (
    <div className="navbar">
      <div className="navbar-logo">NeatQuiz</div>{" "}
      <div className="navbar-right">
        <div className="">{name}</div>
        <button className="navbar__btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
export default Navbar;
