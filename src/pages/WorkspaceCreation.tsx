import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceCreation.css';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import getLPTheme from '../getLPTheme';
import { Button as MUIButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

const WorkspaceCreation: React.FC = () => {

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  };

  const handleWorkspaceDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceDescription(e.target.value);
  };

  const createWorkspace = () => {
    if (!workspaceName.trim() || !workspaceDescription.trim()) {
      setError('Please fill in both workspace name and description.');
      return;
    }

    const workspace = { name: workspaceName, description: workspaceDescription };
    localStorage.setItem('workspace', JSON.stringify(workspace));
    //navigate(`/projectcreation?name=${encodeURIComponent(workspaceName)}&description=${encodeURIComponent(workspaceDescription)}`);
    navigate(`/${encodeURIComponent(workspaceName)}?description=${encodeURIComponent(workspaceDescription)}`);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px' }}>
        <div className="workspace-creation-container">
          <h1>Create Workspace</h1>
          <div className="input-container">
            <label>Workspace Name:</label>
            <input type="text" value={workspaceName} onChange={handleWorkspaceNameChange} className="workspace-input" />
          </div>
          <div className="input-container">
            <label>Workspace Description:</label>
            <input type="text" value={workspaceDescription} onChange={handleWorkspaceDescriptionChange} className="workspace-input" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <List>
            <button onClick={createWorkspace} className="new-workspace-button"><MUIButton>Create Workspace</MUIButton></button>
          </List>
        </div>
    </Box>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
  );
};

export default WorkspaceCreation;
