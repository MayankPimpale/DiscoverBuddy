import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { useAuthContext } from "../hooks/UseAuthContext";

const Header = () => {

  const [isLoading , setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {state , dispatch} = useAuthContext();
  const {user} = state || {};
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsLoading(true);  // Set loading state before logout
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    setIsLoading(false);
    setMenuOpen(false); // Close menu after logout
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">DiscoverBuddy</Link>
      </div>
      <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
        <Link to="/add-trip" onClick={() => setMenuOpen(false)}>Add-Trip</Link>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
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
    </nav>
  </header>
  );
};

export default Header;