import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-heading">Home Page</h1>
      <Link to="/workspacecreation" className="create-workspace-link">Create Workspace</Link>
    </div>
  );
};

export default Home;
