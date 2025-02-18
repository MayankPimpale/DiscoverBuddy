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
  const [menuOpen, setMenuOpen] = useState(false);


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
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <nav className={`header-nav ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
        <Link to="/add-trip" onClick={() => setMenuOpen(false)}>Add-Trip</Link>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
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
            <Link to="/login" className="btn" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="btn" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;