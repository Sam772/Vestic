import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import HeroAnalytics from '../components/HeroAnalytics';
import getLPTheme from '../getLPTheme';
import './Analytics.css';

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

type Project = { id: number; name: string };

type Projects = {
  [key: number]: Project[];
};

const workspaces = [
  { id: 1, name: 'Workspace 1' },
  { id: 2, name: 'Workspace 2' },
];

const projects: Projects = {
  1: [
    { id: 1, name: 'Project 1A' },
    { id: 2, name: 'Project 1B' },
  ],
  2: [
    { id: 1, name: 'Project 2A' },
    { id: 2, name: 'Project 2B' },
  ],
};

const Analytics: React.FC = () => {

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

  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleWorkspaceChange = (workspaceId: number) => {
    setSelectedWorkspace(workspaceId);
    setSelectedProject(null);
  };

  const handleProjectChange = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const navigateToRandomProject = () => {
    // Randomly select a workspace
    const randomWorkspaceId = workspaces[Math.floor(Math.random() * workspaces.length)].id;
    // Randomly select a project from the selected workspace
    const randomProjectId = projects[randomWorkspaceId][Math.floor(Math.random() * projects[randomWorkspaceId].length)].id;
    // Navigate to the analytics page of the randomly selected project
    navigate(`/analytics/workspace/${randomWorkspaceId}/project/${randomProjectId}`);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
    <HeroAnalytics />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px' }}>
      <div className='analytics-container'>
          <div>
            {/* Workspace selection */}
            <h3>Select Workspace:</h3>
            <ToggleButtonGroup
              value={selectedWorkspace}
              exclusive
              onChange={(event, newValue) => handleWorkspaceChange(newValue as number)}
              aria-label="workspace"
            >
              {workspaces.map(workspace => (
                <ToggleButton key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          {selectedWorkspace && (
            <div>
              {/* Project selection */}
              <h3>Select Project:</h3>
              <ToggleButtonGroup
                value={selectedProject}
                exclusive
                onChange={(event, newValue) => handleProjectChange(newValue as number)}
                aria-label="project"
              >
                {projects[selectedWorkspace].map(project => (
                  <ToggleButton key={project.id} value={project.id}>
                    {project.name}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          )}
          {/* Display analytics based on selected workspace and project */}
          {selectedWorkspace && selectedProject && (
            <div>
              {/* Display analytics for selected project here */}
              <h3>Analytics for {projects[selectedWorkspace].find(p => p.id === selectedProject)?.name}</h3>
              {/* Add your analytics components here */}
            </div>
          )}
          <div>
            {/* Button to navigate to a random project's analytics page */}
            <button onClick={navigateToRandomProject}>Go to Random Project</button>
          </div>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default Analytics;
