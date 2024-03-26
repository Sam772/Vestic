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
import WikiCreate from './pages/WikiCreate';
import { PaletteMode } from '@mui/material';
import { Link } from './components/Types';

const App: React.FC = () => {
  const [wikiPages, setWikiPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<string>('');

  const createWikiPage = (pageName: string) => {
    setWikiPages([...wikiPages, pageName]);
    setCurrentPage(pageName);
  };

  const deleteWikiPage = (pageName: string) => {
    const updatedPages = wikiPages.filter(page => page !== pageName);
    setWikiPages(updatedPages);
    if (currentPage === pageName) {
      setCurrentPage(updatedPages[0] || ''); // Set the first page in the list as current page, or empty string if no pages left
    }
  };

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/:name" element={<ProjectCreation />} />
            <Route path="/workspacecreation" element={<WorkspaceCreation />} />
            <Route path="/:workspace/:projectName" element={<KanbanBoard />} />
            <Route path="/wiki" element={<Wiki createWikiPage={createWikiPage} wikiPages={wikiPages} />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/wikicreate" element={<WikiCreate createWikiPage={createWikiPage} />} />
            {wikiPages.map(pageName => (
              <Route
              key={pageName}
              path={`/wiki/wikis/${pageName}`}
              element={
                <Sidebar
                  pageNames={wikiPages}
                  createWikiPage={createWikiPage}
                  deleteWikiPage={deleteWikiPage}
                  currentPageName={currentPage}
                  setPageName={setCurrentPage}
                />
              }
              />
            ))}
            {wikiPages.length > 0 && <Route path="/wiki/wikis" element={<Navigate to={`/wiki/wikis/${wikiPages[0]}`} />} />}
          </Routes>
        </div>
      </DndProvider>
    </Router>
  );
}

export default App;
