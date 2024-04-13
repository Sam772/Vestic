import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '../pages/WorkspaceCreation';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkspace: (workspace: Workspace) => void;
}

const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ isOpen, onClose, onCreateWorkspace }) => {
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

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim() || !workspaceDescription.trim()) {
      setError('Please fill in both workspace name and description.');
      return;
    }

    // Create workspace object
    const newWorkspace: Workspace = {
        name: workspaceName,
        description: workspaceDescription,
    };

    onCreateWorkspace(newWorkspace);

    console.log(newWorkspace);

    setWorkspaceName('');
    setWorkspaceDescription('');
    setError('');

    onClose();
  };

  useEffect(() => {
    // Retrieve workspaces from local storage
    const storedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');

    // Check if there are any stored workspaces
    if (storedWorkspaces.length > 0) {
      // If there are stored workspaces, navigate the user to the project creation page
      navigate(`/${encodeURIComponent(storedWorkspaces[0].name)}`);
    }
  }, [navigate]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create Workspace
        </Typography>
        <TextField
          label="Workspace Name"
          value={workspaceName}
          onChange={handleWorkspaceNameChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Workspace Description"
          value={workspaceDescription}
          onChange={handleWorkspaceDescriptionChange}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handleCreateWorkspace}>Create</Button>
      </Box>
    </Modal>
  );
};

export default WorkspaceModal;
