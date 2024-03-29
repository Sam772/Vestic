import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceCreation.css';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import getLPTheme from '../getLPTheme';
import TextField from '@mui/material/TextField';
import { Button as MUIButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

export interface Workspace {
  name: string;
  description: string;
}

interface WorkspaceCreationProps {
  handleWorkspaceCreate: (workspace: Workspace) => void;
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

const WorkspaceCreation: React.FC<WorkspaceCreationProps> = ({ handleWorkspaceCreate }) => {

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
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
  
    // Create workspace object
    const newWorkspace: Workspace = {
      name: workspaceName,
      description: workspaceDescription,
    };
  
    // Call handleWorkspaceCreate function to update workspaces state
    handleWorkspaceCreate(newWorkspace);
  
    console.log(newWorkspace)

    setWorkspaceName('');
    setWorkspaceDescription('');
    setError('');
  
    navigate(`/${encodeURIComponent(workspaceName)}?description=${encodeURIComponent(workspaceDescription)}`, { state: { workspaces } });
  };
  

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px' }}>
        <div className="workspace-creation-container">
        <ThemeProvider theme={theme}>
          <Typography variant="h6">
            <h1>Let's create A Workspace</h1>
          </Typography>
        </ThemeProvider>
          <div className="input-container">
            <ThemeProvider theme={theme}>
              <Typography variant="subtitle1">
                <label>Enter Workspace Name</label>
              </Typography>
            </ThemeProvider>
              <TextField
                type="text"
                multiline
                variant="outlined"
                placeholder='Enter workspace name...'
                className="workspace-input"
                value={workspaceName}
                onChange={handleWorkspaceNameChange}
                />
              {/* <input type="text" value={workspaceName} onChange={handleWorkspaceNameChange} className="workspace-input" /> */}
          </div>
          <div className="input-container">
            <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  <label>Enter Workspace Description</label>
                </Typography>
            </ThemeProvider>
            <TextField
              type="text"
              multiline
              variant="outlined"
              placeholder='Enter workspace description...'
              className="workspace-input"
              value={workspaceDescription}
              onChange={handleWorkspaceDescriptionChange}
              />
            {/* <input type="text" value={workspaceDescription} onChange={handleWorkspaceDescriptionChange} className="workspace-input" /> */}
          </div>
          {error && <p className="error-message">{error}</p>}
          <List>
            <button onClick={createWorkspace} className="new-workspace-button"><MUIButton variant='outlined'>Create Workspace</MUIButton></button>
          </List>
        </div>
    </Box>
      {/* <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      /> */}
    </ThemeProvider>
  );
};

export default WorkspaceCreation;
