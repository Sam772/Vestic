import React from 'react';
import './App.css';
import Navbar from './pages/Navbar';
import KanbanBoard from './pages/KanbanBoard';

function App() {
  return (
    <div className="App">
      <Navbar />
      <KanbanBoard />
    </div>
  );
}

export default App;
