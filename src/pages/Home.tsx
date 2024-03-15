import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Home: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="/workspacecreation">Create Workspace</Link>
    </div>
  );
};

export default Home;
