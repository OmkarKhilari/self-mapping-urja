import React from 'react';
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="../urja_logo.png" alt="Company Logo" className="company-logo" />
      </div>
      <div className="navbar-title">
        Self Mapping
      </div>
    </nav>
  );
}

export default Navbar;
