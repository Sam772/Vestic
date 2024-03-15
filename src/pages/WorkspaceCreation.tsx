// WorkspaceCreation.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkspaceCreation: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const navigate = useNavigate();

  const handleWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  };

  const handleWorkspaceDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceDescription(e.target.value);
  };

  const createWorkspace = () => {
    const workspace = { name: workspaceName, description: workspaceDescription };
    localStorage.setItem('workspace', JSON.stringify(workspace));
    navigate(`/projectcreation?name=${encodeURIComponent(workspaceName)}&description=${encodeURIComponent(workspaceDescription)}`);
  };

  return (
    <div>
      <h1>Create Workspace</h1>
      <div>
        <label>Workspace Name:</label>
        <input type="text" value={workspaceName} onChange={handleWorkspaceNameChange} />
      </div>
      <div>
        <label>Workspace Description:</label>
        <input type="text" value={workspaceDescription} onChange={handleWorkspaceDescriptionChange} />
      </div>
      <button onClick={createWorkspace}>Create Workspace</button>
    </div>
  );
};

export default WorkspaceCreation;
