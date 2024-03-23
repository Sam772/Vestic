import React from 'react';
import { Link } from 'react-router-dom';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import PageContent from './PageContent';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

interface SidebarProps {
  pageNames: string[];
  createWikiPage: (pageName: string) => void;
  deleteWikiPage: (pageName: string) => void;
  currentPageName: string;
  setPageName: (pageName: string) => void; // Add setPageName prop
}

const Sidebar: React.FC<SidebarProps> = ({ pageNames, createWikiPage, deleteWikiPage, currentPageName, setPageName }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateWikiPage = () => {
    const pageName = prompt('Enter the name for the new Wiki Page:');
    if (pageName) {
      createWikiPage(pageName);
    }
  };

  const handleDeleteWikiPage = (pageName: string) => {
    if (window.confirm(`Are you sure you want to delete the Wiki Page "${pageName}"?`)) {
      if (pageNames.length === 1) {
        // If there's only one wiki page left, navigate to ../../wiki
        navigate('../../wiki');
        setPageName('');
      } else if (pageName === currentPageName) {
        // If deleting the current wiki page, navigate to the first wiki page in the list
        deleteWikiPage(pageName);
        const firstPageName = pageNames[0];
        navigate(`../../wiki/wikis/${firstPageName}`);
        setPageName(firstPageName);
      } else {
        // Otherwise, proceed with deleting the wiki page
        deleteWikiPage(pageName);
      }
    }
  };
  

  const handleSelectWikiPage = (pageName: string) => {
    setPageName(pageName); // Set the selected page name
  };

  return (
    <div className='sidebar'>
      <Box display="flex">
        <Box flex="1">
          <h2>Your Wiki Pages</h2>
          <List>
            {pageNames.map(page => (
              <ListItem key={page}>
                <ListItemButton component={Link} to={`/wiki/wikis/${page}`} onClick={() => handleSelectWikiPage(page)}>
                  <ListItemText primary={page} />
                </ListItemButton>
                <Button variant='outlined' onClick={() => handleDeleteWikiPage(page)}>Delete</Button>
              </ListItem>
            ))}
          </List>
          <Button variant='outlined' onClick={handleCreateWikiPage}>Create New Wiki Page</Button>
        </Box>
        <Box flex="2">
          <PageContent pageName={currentPageName} />
        </Box>
      </Box>
    </div>
  );
};

export default Sidebar;
