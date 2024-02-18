import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import KanbanBoard from './pages/KanbanBoard';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <KanbanBoard />
        <Routes>
          <Route path="/board" Component={KanbanBoard} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
