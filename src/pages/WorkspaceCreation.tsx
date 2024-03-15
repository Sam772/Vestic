import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkspaceCreation.css';

const WorkspaceCreation: React.FC = () => {
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
    navigate(`/projectcreation?name=${encodeURIComponent(workspaceName)}&description=${encodeURIComponent(workspaceDescription)}`);
  };

  return (
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
      <button onClick={createWorkspace} className="create-workspace-button">Create Workspace</button>
    </div>
  );
};

export default WorkspaceCreation;
