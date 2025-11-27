import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav-links">
          <h1>FAQ Platform</h1>
          <div>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/faqs"
              className={location.pathname === "/faqs" ? "active" : ""}
            >
              FAQs
            </Link>
            {isAuthenticated ? (
              <>
                <span style={{ color: "#ccc", margin: "0 10px" }}>|</span>
                <span
                  className="user-name"
                  style={{ color: "#aaa", padding: "0 10px" }}
                >
                  Hello, {user?.username}!
                </span>
                <Link to="/login" onClick={handleLogout}>
                  Logout
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className={location.pathname === "/login" ? "active" : ""}
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
