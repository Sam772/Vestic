import React from 'react';
import { Link } from 'react-router-dom';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import PageContent from './PageContent';

interface SidebarProps {
  pageNames: string[];
  createWikiPage: (pageName: string) => void;
  deleteWikiPage: (pageName: string) => void;
  currentPageName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ pageNames, createWikiPage, deleteWikiPage, currentPageName }) => {

  const handleCreateWikiPage = () => {
    const pageName = prompt('Enter the name for the new Wiki Page:');
    if (pageName) {
      createWikiPage(pageName);
    }
  };

  const handleDeleteWikiPage = (pageName: string) => {
    if (window.confirm(`Are you sure you want to delete the Wiki Page "${pageName}"?`)) {
      deleteWikiPage(pageName);
    }
  };

  return (
    <div className="sidebar">
      <h2>Your Wiki Pages</h2>
      <List>
        {pageNames.map(page => (
          <ListItem key={page}>
            <ListItemButton component={Link} to={`/wiki/wikis/${page}`}>
              <ListItemText primary={page} />
            </ListItemButton>
            <Button onClick={() => handleDeleteWikiPage(page)}>Delete</Button>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleCreateWikiPage}>Create New Wiki Page</Button>
      <PageContent pageName={currentPageName} />
    </div>
  );
};

export default Sidebar;
