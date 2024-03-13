import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './components/Navbar';
import KanbanBoard from './pages/ProjectOverview';
import Home from './pages/Home';
import ProjectCreation from './pages/ProjectCreation';
import Wiki from './pages/Wiki';
import Analytics from './pages/Analytics';
import Testing from './pages/Testing';

const App: React.FC = () => {
  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projectcreation" Component={ProjectCreation} />
          <Route path="/projectoverview" Component={KanbanBoard} />
          <Route path="/wiki" Component={Wiki} />
          <Route path="/analytics" Component={Analytics} />
          <Route path="/testing" Component={Testing} />
        </Routes>
      </div>
      </DndProvider>
    </Router>
  );
}

export default App;
