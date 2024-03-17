import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppAppBar from './components/AppAppBar';
import LandingPage from './pages/LandingPage';
import KanbanBoard from './pages/ProjectOverview';
import ProjectCreation from './pages/ProjectCreation';
import WorkspaceCreation from './pages/WorkspaceCreation';
import Wiki from './pages/Wiki';
import Analytics from './pages/Analytics';
import Testing from './pages/Testing';
import Sidebar from './components/Sidebar';
import { PaletteMode } from '@mui/material';
import { Link } from './components/Types';

const App: React.FC = () => {
  const [wikiPages, setWikiPages] = useState<string[]>([]);

  const [mode, setMode] = React.useState<PaletteMode>('light');

  const createWikiPage = (pageName: string) => {
    setWikiPages([...wikiPages, pageName]);
  };

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div>
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/:name" element={<ProjectCreation />} />
            <Route path="/workspacecreation" element={<WorkspaceCreation />} />
            <Route path="/:workspace/:projectName" element={<KanbanBoard />} />
            <Route path="/wiki" element={<Wiki createWikiPage={createWikiPage} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/testing" element={<Testing />} />
            {wikiPages.map(pageName => (
              <Route key={pageName} path={`/wiki/${pageName}`} element={<Sidebar pageName={pageName} />} />
            ))}
            {wikiPages.length > 0 && <Route path="/wiki" element={<Navigate to={`/wiki/${wikiPages[0]}`} />} />}
          </Routes>
        </div>
      </DndProvider>
    </Router>
  );
}

export default App;
