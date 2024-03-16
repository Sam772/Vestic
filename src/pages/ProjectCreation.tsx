import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProjectCreation.css';
import ProjectModal from '../components/ProjectModal';

const ProjectCreation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();

  const workspaceDescription = new URLSearchParams(location.search).get('description') || '';

  const [showProjectList, setShowProjectList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWorkspaceButtonClick = () => {
    setShowProjectList(true);
  };

  const handleProjectButtonClick = () => {
    navigate('/projectoverview');
  };

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
  };

  const handleProjectCreate = (projectName: string, projectDescription: string) => {
    setIsModalOpen(false);
    // You can handle the project creation logic here
    const projectLink = `${name}/${projectName}`;
    navigate(`/${projectLink}`, { state: { projectName, projectDescription } });
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="project-creation-page-container">
      <div className="sidebar">
        <button onClick={handleWorkspaceButtonClick} className="workspace-button">{name}</button>
        <button onClick={() => navigate('/workspacecreation')} className="workspace-button">Create a Workspace</button>
      </div>
      <div className="main-content">
        <h1 className="project-creation-page-heading">Project Creation Page</h1>
        <div className="workspace-details-container">
          <h2>Workspace Details</h2>
          <p>Name: {name}</p>
          <p>Description: {workspaceDescription}</p>
        </div>
        {showProjectList && (
          <div className="project-list-container">
            <h2>Projects</h2>
            <button onClick={handleProjectButtonClick} className="project-button">Project 1</button>
            <button onClick={handleProjectButtonClick} className="project-button">Project 2</button>
          </div>
        )}
        <div className="create-project-container">
          <button onClick={handleCreateProjectClick} className="create-project-button">Create New Project</button>
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
  );
};

export default ProjectCreation;
