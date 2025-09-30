import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <div className="logo-icon">EV</div>
          <span className="logo-text">EV Battery Swap</span>
        </div>
        
        <div className="nav-menu">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/plans" className="nav-link">Battery Subscription Plans</Link>
        </div>
        
        <div className="nav-buttons">
          <Link to="/login" className="btn-signin">Sign in</Link>
          <Link to="/register" className="btn-register">Register now</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

