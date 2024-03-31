import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import PageContent from './PageContent';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

interface SidebarProps {
  pageNames: string[];
  createWikiPage: (pageName: string) => void;
  deleteWikiPage: (pageName: string) => void;
  currentPageName: string;
  setPageName: (pageName: string) => void; // Add setPageName prop
  renameWikiPage: (oldName: string, newName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ pageNames, createWikiPage, deleteWikiPage, currentPageName, setPageName, renameWikiPage }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [renamingWikiPage, setRenamingWikiPage] = useState<string | null>(null);
  const [newWikiName, setNewWikiName] = useState('');

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  const handleCreateWikiPage = () => {
    const pageName = prompt('Enter the name for the new Wiki Page:');
    if (pageName) {
      createWikiPage(pageName);
      navigate(`/wiki/wikis/${pageName}`);
    }
  };

  const handleDeleteWikiPage = (pageName: string) => {
    if (window.confirm(`Are you sure you want to delete the Wiki Page "${pageName}"?`)) {
      if (pageNames.length === 1) {
        // If there's only one wiki page left, navigate to ../../wiki
        deleteWikiPage(pageName);
        navigate('../../wiki');
        setPageName('');
      } else if (pageName === currentPageName) {
        // If deleting the current wiki page, navigate to the first wiki page in the list
        deleteWikiPage(pageName);
        const remainingPages = pageNames.filter(page => page !== pageName);
        const firstPageName = remainingPages[0];
        navigate(`../../wiki/wikis/${firstPageName}`);
        setPageName(firstPageName);
      } else {
        // Otherwise, proceed with deleting the wiki page
        deleteWikiPage(pageName);
      }
    }
  };

  const handleRenameStart = (pageName: string) => {
    setRenamingWikiPage(pageName);
    setNewWikiName('');
  };

  const handleRenameWikiPage = (oldName: string, newName: string) => {
    renameWikiPage(oldName, newName);
    setRenamingWikiPage(null);
    navigate(`../../wiki/wikis/${newName}`);
    setNewWikiName("");
  };

  const handleSelectWikiPage = (pageName: string) => {
    setPageName(pageName); // Set the selected page name
    setRenamingWikiPage(pageName);
    setNewWikiName(pageName);
  };

  return (
    <div className='sidebar'>
      <ThemeProvider theme={theme}>
        <Box display="flex">
          <Box flex="1" sx={{ paddingTop: '80px' }}>
            <Typography variant="h5">Your Wikis</Typography>
            <List>
              {pageNames.map((page, index) => (
                <ListItem key={page}>
                  {renamingWikiPage === page ? (
                    <TextField
                      value={newWikiName}
                      onChange={(e) => setNewWikiName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameWikiPage(page, newWikiName)}
                      onBlur={() => handleRenameWikiPage(page, newWikiName)}
                      autoFocus
                      sx={
                        { input: { color: 'white' } }
                      }
                    />
                  ) : (
                  <ListItemButton component={Link} to={`/wiki/wikis/${page}`} onClick={() => handleSelectWikiPage(page)}>
                    <ListItemText primary={page} />
                  </ListItemButton>
                  )}
                  <Button variant='outlined' onClick={() => handleDeleteWikiPage(page)}>Delete Wiki</Button>
                </ListItem>
              ))}
            </List>
            <Button variant='outlined' onClick={handleCreateWikiPage}>Create New Wiki</Button>
          </Box>
          <Box flex="2">
            <PageContent pageName={currentPageName} />
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default Sidebar;
