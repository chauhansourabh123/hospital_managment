import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../context/Context.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/patient/logout", {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setIsAuthenticated(false)
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLogin = () => {
    navigateTo("/login");
  };

  return (
    <nav className="container">
      <div className="logo"><img src="./logo.png" alt="logo" /></div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to={"/"}>Home</Link>
          <Link to={"/appointment"}>Appointment</Link>
          <Link to={"about"}>About us</Link>
        </div>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="logoutBtn btn">
            Logout
          </button>
        ) : (
          <button onClick={handleLogin} className="loginBtn btn">
            Login
          </button>
        )}
      </div>
      <div className="hamburger" onClick={()=> setShow(prev => !prev)}>
      <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
