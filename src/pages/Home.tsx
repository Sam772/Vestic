import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">Home Page</h1>
      <button className="create-workspace-button">
        <Link to="/workspacecreation" className="create-workspace-link">Create Workspace</Link>
      </button>
    </div>
  );
};

export default Home;
