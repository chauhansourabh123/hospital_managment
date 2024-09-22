import { useContext, useEffect, useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";
import { Context } from "./context/Context.jsx";
import Appointment from "./pages/Appointment.jsx";
import axios from "axios";
import Footer from "./components/Footer.jsx";

function App() {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/user/patient/me", { withCredentials: true });
        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/appointment" element={<Appointment />}></Route>
      </Routes>
      <ToastContainer position="top-center" />
      <Footer/>
    </Router>
  );
}

export default App;
