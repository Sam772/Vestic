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
import WorkspaceModal from '../components/WorkspaceModal';
import EditWorkspaceModal from '../components/EditWorkspaceModal';
import EditProjectModal from '../components/EditProjectModal';
import HeroProjectOverview from '../components/HeroProjectOverview';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';

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
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
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

const ProjectCreation: React.FC<ProjectCreationProps> = ( { workspaces, setWorkspaces, deleteWorkspace, projects, setProjects } ) => {

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
  const params = useParams<{ name: string; description: string }>();
  const { name, description } = params;

  // const workspaceDescription = new URLSearchParams(location.search).get('description') || '';

  useEffect(() => {
    // Update local storage when workspaces state changes
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
    //console.log(workspaces);
  }, [workspaces]);

  // In ProjectCreation component
  useEffect(() => {
    // Save projects to local storage whenever it changes
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState<string>('');
  const [selectedWorkspaceDescription, setSelectedWorkspaceDescription] = useState<string>('');

  const [showProjectList, setShowProjectList] = useState(false);
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);

  const [editedWorkspaceName, setEditedWorkspaceName] = useState('');
  const [editedWorkspaceDescription, setEditedWorkspaceDescription] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isEditWorkspaceModalOpen, setIsEditWorkspaceModalOpen] = useState(false);

  const [editedProjectName, setEditedProjectName] = useState('');
  const [editedProjectDescription, setEditedProjectDescription] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);

  const handleWorkspaceButtonClick = (workspaceName: string, workspaceDescription: string) => {
    navigate(`/${encodeURIComponent(workspaceName)}?description=${encodeURIComponent(workspaceDescription)}`);
    setShowProjectList(true);
    setSelectedWorkspaceName(workspaceName);
    setSelectedWorkspaceDescription(workspaceDescription);

    const workspaceProjects = JSON.parse(localStorage.getItem(workspaceName) || '[]');
    setProjects(workspaceProjects);
  };

  const handleProjectButtonClick = (projectName: string) => {
    navigate(`/${encodeURIComponent(projectName)}/projectoverview`);
  };

  const handleCreateProjectClick = () => {
    setIsProjectModalOpen(true);
  };

  const handleProjectCreate = (projectName: string, projectDescription: string) => {
    setIsProjectModalOpen(true);
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

    // Save projects to local storage
    const workspaceProjects = JSON.parse(localStorage.getItem(selectedWorkspaceName) || '[]');
    localStorage.setItem(selectedWorkspaceName, JSON.stringify([...workspaceProjects, newProject]));

    const workspaceProjectsDesc = JSON.parse(localStorage.getItem(selectedWorkspaceDescription) || '[]');
    localStorage.setItem(selectedWorkspaceDescription, JSON.stringify([...workspaceProjects, newProject]));

    // Close the project modal
    closeProjectModal();
  };
  
  const handleDeleteProject = (projectName: string) => {
    // Filter out the project to be deleted
    const updatedProjects = projects.filter(project => project.name !== projectName);
    setProjects(updatedProjects);
  
    // Remove the project from local storage (if needed)
    const updatedWorkspaceProjects = JSON.parse(localStorage.getItem(selectedWorkspaceName) || '[]').filter((project: Project) => project.name !== projectName);
    localStorage.setItem(selectedWorkspaceName, JSON.stringify(updatedWorkspaceProjects));
  };

  // Function to delete a workspace
  const handleDeleteWorkspace = (workspaceName: string) => {
    deleteWorkspace(workspaceName);
    // Optionally, you can navigate to a different page or show a confirmation message after deletion
  };

  const handleEditWorkspace = (workspace: Workspace) => {
    // Assuming you have state variables to hold the edited workspace name and description
    setEditedWorkspaceName(workspace.name);
    setEditedWorkspaceDescription(workspace.description);
    setSelectedWorkspace(workspace);
    setIsEditWorkspaceModalOpen(true);
  };

  const handleEditWorkspaceModal = (name: string, description: string) => {
    // Find the index of the selected workspace in the workspaces array
    const workspaceIndex = workspaces.findIndex(workspace => workspace.name === selectedWorkspace?.name);
    // Create a copy of the workspaces array
    const updatedWorkspaces = [...workspaces];
    // Update the name and description of the selected workspace
    updatedWorkspaces[workspaceIndex] = { ...selectedWorkspace!, name, description };
    // Update the state with the new workspaces array
    setWorkspaces(updatedWorkspaces);
  
    // Update project data associated with the workspace
    const updatedProjects = projects.map(project => {
      if (project.name === selectedWorkspace?.name) {
        return { ...project, name };
      }
      return project;
    });
  
    // Update local storage with the new projects array
    localStorage.setItem(name, JSON.stringify(updatedProjects));
    localStorage.removeItem(selectedWorkspace?.name || '');
  
    // Update the state with the new projects array
    setProjects(updatedProjects);
  
    // Close the modal
    setIsEditWorkspaceModalOpen(false);
  };

  const handleEditProject = (project: Project) => {
    // Set the details of the project being edited to state variables
    setEditedProjectName(project.name);
    setEditedProjectDescription(project.description);
    setSelectedProject(project);
    // Open the edit project modal or navigate to a new page for editing
    setIsEditProjectModalOpen(true);
  };

  const handleEditProjectModal = (name: string, description: string) => {
    // Find the index of the selected project in the projects array
    const projectIndex = projects.findIndex(project => project.name === selectedProject?.name);
    // Create a copy of the projects array
    const updatedProjects = [...projects];
    // Update the name and description of the selected project
    updatedProjects[projectIndex] = { ...selectedProject!, name, description };
    // Update the state with the new projects array
    setProjects(updatedProjects);
  
    // Update local storage with the new projects array
    const workspaceProjects = JSON.parse(localStorage.getItem(selectedWorkspaceName) || '[]');
    const updatedWorkspaceProjects = workspaceProjects.map((project: Project) => {
      if (project.name === selectedProject?.name) {
        return { ...project, name };
      }
      return project;
    });
    localStorage.setItem(selectedWorkspaceName, JSON.stringify(updatedWorkspaceProjects));
    
    // Close the modal
    setIsEditProjectModalOpen(false);
  };  
  
  const closeEditWorkspaceModal = () => {
    setIsEditWorkspaceModalOpen(false);
  };

  const closeEditProjectModal = () => {
    setIsEditProjectModalOpen(false);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
  };

  const closeWorkspaceModal = () => {
    setIsWorkspaceModalOpen(false);
  };

  useEffect(() => {
    // Retrieve the first workspace from the list of workspaces
    const firstWorkspace = workspaces[0];
  
    if (firstWorkspace) {
      handleWorkspaceButtonClick(firstWorkspace.name, firstWorkspace.description);
    }
  }, [workspaces]); // Run this effect whenever the list of workspaces changes  

  // Function to add a new workspace
  const addWorkspace = (newWorkspace: Workspace) => {
    setWorkspaces((prevWorkspaces: Workspace[]) => [...prevWorkspaces, newWorkspace]);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <HeroProjectOverview />
      <Box sx={{ bgcolor: 'background.default'}}>
        <div className="project-creation-page-container">
          <div className="sidebar">
            <Typography variant="h5">Your Workspaces</Typography>
            <List>
              {workspaces.map((workspace, index) => (
                <ListItem key={index}>
                  <Button 
                    variant='outlined' 
                    onClick={() => handleWorkspaceButtonClick(workspace.name, workspace.description)}
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '160px',
                      maxWidth: '160px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {workspace.name}
                  </Button>
                  <Button variant='outlined' onClick={() => handleDeleteWorkspace(workspace.name)} sx={{ marginLeft: 1 }}>Delete</Button>
                  <Button variant='outlined' onClick={() => handleEditWorkspace(workspace)} sx={{ marginLeft: 1 }}>Edit</Button>
                </ListItem>
              ))}
              <Button variant='outlined' onClick={() => setIsWorkspaceModalOpen(true)} sx={{ marginTop: 1, marginLeft: 2 }}>Create a Workspace</Button>
            </List>
          </div>
          <div className="main-content">
            <ThemeProvider theme={theme}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1>{name}</h1>
              <div className="create-project-container">
                <button onClick={handleCreateProjectClick} className="new-button">
                  <Button variant='outlined'>Create New Project</Button>
                </button>
              </div>
            </Typography>
            </ThemeProvider>
            {showProjectList && (
              <div className="project-list-container">
                <h2>My Projects</h2>
                <Grid container spacing={2}>
                  {projects.map((project, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <Box
                        component={Card}
                        className="project-card"
                        sx={{
                          padding: 1,
                          height: 280,
                          '&:hover': {
                            border: '1px solid #3f51b5',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div" sx={{ marginBottom: 1 }}>
                            {project.name}
                          </Typography>
                          <Box sx={{ maxHeight: 100, overflowY: 'auto', marginBottom: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                              {project.description}
                            </Typography>
                          </Box>
                          <Button onClick={() => handleProjectButtonClick(project.name)} variant="outlined">
                            Project Overview
                          </Button>
                          <Button onClick={() => handleEditProject(project)} variant="outlined">
                            Edit Project
                          </Button>
                          <Button onClick={() => handleDeleteProject(project.name)} variant="outlined" color="error">
                            Delete Project
                          </Button>
                        </CardContent>
                          {/* Add more details or actions as needed */}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </div>
          {isProjectModalOpen && (
            <ProjectModal
              isOpen={isProjectModalOpen}
              projectName=""
              projectDescription=""
              onClose={closeProjectModal}
              onProjectCreate={handleProjectCreate}
              workspaceName={selectedWorkspaceName}
            />
          )}
          {isWorkspaceModalOpen && (
            <WorkspaceModal
              isOpen={isWorkspaceModalOpen}
              onClose={closeWorkspaceModal}
              onCreateWorkspace={addWorkspace}
            />
           )}
           {isEditWorkspaceModalOpen && (
            <EditWorkspaceModal
              isOpen={isEditWorkspaceModalOpen}
              onClose={closeEditWorkspaceModal}
              editedWorkspaceName={editedWorkspaceName}
              editedWorkspaceDescription={editedWorkspaceDescription}
              onWorkspaceEdit={handleEditWorkspaceModal}
            />
          )}
          {isEditProjectModalOpen && (
            <EditProjectModal
              isOpen={isEditProjectModalOpen}
              onClose={closeEditProjectModal}
              editedProjectName={editedProjectName}
              editedProjectDescription={editedProjectDescription}
              onProjectEdit={handleEditProjectModal}
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
