import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div className="project-creation-page">
      <h1>Project Creation Page</h1>
      <div>
        <h2>Workspace Details</h2>
        <p>Name: {workspaceName}</p>
        <p>Description: {workspaceDescription}</p>
      </div>
      <div>
        <button onClick={handleWorkspaceButtonClick}>{workspaceName}</button>
        {showProjectList && (
          <div>
            <h2>Projects</h2>
            <button onClick={handleProjectButtonClick}>Project 1</button>
            <button onClick={handleProjectButtonClick}>Project 2</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCreation;
