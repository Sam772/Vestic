import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li className="navbar-item">
          <div className="navbar-link">Vestic</div>
        </li>
        <li className="navbar-item">
          <Link to="/" className="navbar-link">Home</Link>
        </li>
        {/* <li className="navbar-item">
          <Link to="/projectcreation" className="navbar-link">Project Creation</Link>
        </li> */}
        <li className="navbar-item">
          <Link to="/projectoverview" className="navbar-link">Project Overview</Link>
        </li>
        <li className="navbar-item">
          <Link to="/wiki" className="navbar-link">Wiki</Link>
        </li>
        <li className="navbar-item">
          <Link to="/analytics" className="navbar-link">Analytics</Link>
        </li>
        <li className="navbar-item">
          <Link to="/testing" className="navbar-link">Testing</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
