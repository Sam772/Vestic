import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProjectCreation.css';
import ProjectModal from '../components/ProjectModal';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import Hero from '../components/Hero';
import getLPTheme from '../getLPTheme';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';
import WorkspaceCreation from './WorkspaceCreation';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

interface Workspace {
  name: string;
  description: string;
}

interface ProjectCreationProps {
  workspaces: Workspace[];
  projects: Project[];
  deleteWorkspace: (workspaceName: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export interface Project {
  name: string;
  description: string;
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

const ProjectCreation: React.FC<ProjectCreationProps> = ( { workspaces, deleteWorkspace, projects, setProjects } ) => {

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

  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  const workspaceDescription = new URLSearchParams(location.search).get('description') || '';

  useEffect(() => {
    // Update local storage when workspaces state changes
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // In ProjectCreation component
  useEffect(() => {
    // Save projects to local storage whenever it changes
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');

  const [showProjectList, setShowProjectList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWorkspaceButtonClick = (workspaceName: string) => {
    navigate(`/${workspaceName}`);
    setShowProjectList(true);
    setSelectedWorkspace(workspaceName);
    setProjects([]);
  };

  const handleProjectButtonClick = (projectName: string) => {
    navigate(`/${encodeURIComponent(projectName)}/projectoverview`);
  };

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreate = (projectName: string, projectDescription: string) => {
    setIsModalOpen(false);
    // You can handle the project creation logic here
    // const projectLink = `${name}/${projectName}`;
    // navigate(`/${projectLink}`, { state: { projectName, projectDescription } });

    const newProject: Project = {
      name: projectName,
      description: projectDescription
      // Add other properties as needed
    };

    // Add the new project to the list of projects for the selected workspace
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };
  
  // Function to delete a workspace
  const handleDeleteWorkspace = (workspaceName: string) => {
    deleteWorkspace(workspaceName);
    // Optionally, you can navigate to a different page or show a confirmation message after deletion
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Box sx={{ bgcolor: 'background.default', paddingTop: '80px' }}>
        <div className="project-creation-page-container">
          <div className="sidebar">
            <ThemeProvider theme={theme}>
              <Typography variant="h5">Your Workspaces</Typography>
            </ThemeProvider>
            <List>
              {workspaces.map((workspace, index) => (
                <ListItem key={index}>
                  <ListItemButton onClick={() => handleWorkspaceButtonClick(workspace.name)}>
                    <Button variant='outlined'>{workspace.name}</Button>
                  </ListItemButton>
                  <Button variant='outlined' onClick={() => handleDeleteWorkspace(workspace.name)}>Delete Workspace</Button>
                </ListItem>
              ))}
              <ListItemButton onClick={() => navigate('/workspacecreation')}>
                <Button variant='outlined'>Create a Workspace</Button>
              </ListItemButton>
            </List>
          </div>
          <div className="main-content">
          <ThemeProvider theme={theme}>
            <Typography variant="h6">
              <h1 className="project-creation-page-heading">Project Creation Page</h1>
            </Typography>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
              <Typography variant="subtitle1">
                <div className="workspace-details-container">
                  <h2>Workspace Details</h2>
                  <p>Name: {name}</p>
                  <p>Description: {workspaceDescription}</p>
                </div>
              </Typography>
          </ThemeProvider>
            {showProjectList && (
              <div className="project-list-container">
                <h2>Projects</h2>
                {selectedWorkspace && (
                <div>
                  {projects.map(project => (
                    <div key={project.name} className="project-item">
                      <Button variant='outlined' onClick={() => handleProjectButtonClick(project.name)}>{project.name}</Button>
                    </div>
                  ))}
                </div>
              )}
                {/* <button onClick={handleProjectButtonClick} className="new-button"><Button variant='outlined'>Project 1</Button></button>
                <button onClick={handleProjectButtonClick} className="new-button"><Button variant='outlined'>Project 2</Button></button> */}
              </div>
            )}
            <div className="create-project-container">
              <button onClick={handleCreateProjectClick} className="new-button"><Button variant='outlined'>Create New Project</Button></button>
            </div>
          </div>
          {isModalOpen && (
            <ProjectModal
              isOpen={isModalOpen}
              projectName=""
              projectDescription=""
              onClose={closeModal}
              onProjectCreate={handleProjectCreate}
            />
          )}
        </div>
      </Box>
    {/* <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      /> */}
    </ThemeProvider>
  );
};

export default ProjectCreation;
