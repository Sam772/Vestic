import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
          <Link to="/">Home</Link>
          <Link to="/board">Kanban Board</Link>
          <Link to="/testing">Testing</Link>
          <Link to="/wiki">Wiki</Link>
          <Link to="/analytics">Analytics</Link>
      </ul>
    </nav>
  );
};

export default Navbar;