import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProjectCreation.css';

const ProjectCreation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const workspaceName = searchParams.get('name') || '';
  const workspaceDescription = searchParams.get('description') || '';

  const [showProjectList, setShowProjectList] = useState(false);

  const handleWorkspaceButtonClick = () => {
    setShowProjectList(true);
  };

  const handleProjectButtonClick = () => {
    navigate('/projectoverview');
  };

  return (
    <div className="project-creation-page-container">
      <h1 className="project-creation-page-heading">Project Creation Page</h1>
      <div className="workspace-details-container">
        <h2>Workspace Details</h2>
        <p>Name: {workspaceName}</p>
        <p>Description: {workspaceDescription}</p>
      </div>
      <div>
        <button onClick={handleWorkspaceButtonClick} className="workspace-button">{workspaceName}</button>
        {showProjectList && (
          <div className="project-list-container">
            <h2>Projects</h2>
            <button onClick={handleProjectButtonClick} className="project-button">Project 1</button>
            <button onClick={handleProjectButtonClick} className="project-button">Project 2</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCreation;
