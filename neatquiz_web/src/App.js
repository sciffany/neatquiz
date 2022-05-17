import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import Login from "./pages/auth/Login";
import Editor from "./pages/editor/Editor";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/reset" element={<Reset />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/edit" element={<Editor />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
