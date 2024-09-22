import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Addnewadmin from "./pages/Addnewadmin.jsx";
import Message from "./pages/Message.jsx";
import Doctors from "./pages/Doctor.jsx";
import Nav from "./pages/Nav.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./context/Context.jsx";
import axios from "axios";
import "./App.css";
import AddNewDoctor from "./pages/Addnewdoctor.jsx"

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchadmin = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/user/admin/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        
        setUser(res.data.data);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchadmin();
  }, [isAuthenticated]);

  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/doctor/addnew" element={<AddNewDoctor />}></Route>
          <Route path="/admin/addnew" element={<Addnewadmin />}></Route>
          <Route path="/messages" element={<Message />}></Route>
          <Route path="/doctors" element={<Doctors />}></Route>
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
