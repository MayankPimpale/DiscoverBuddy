import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAuthContext } from "../hooks/UseAuthContext";

const Header = () => {

  const [isLoading , setIsLoading] = useState(false);
  const {state , dispatch} = useAuthContext();
  const {user} = state || {};
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({type: "LOGOUT"});
    setIsLoading(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">DiscoverBuddy</Link>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/add-trip">Add-Trip</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <div className="header-auth">
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={handleLogout} disabled={isLoading} className="btn">
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/signup" className="btn">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;