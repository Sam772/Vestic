import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

interface ProjectModalProps {
  isOpen: boolean;
  projectName: string;
  projectDescription: string;
  onClose: () => void;
  onProjectCreate: (projectName: string, projectDescription: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectName: initialProjectName,
  projectDescription: initialProjectDescription,
  onClose,
  onProjectCreate,
}) => {
  const [projectName, setProjectName] = useState(initialProjectName);
  const [projectDescription, setProjectDescription] = useState(initialProjectDescription);

  const handleCreate = () => {
    // Handle save logic here
    onProjectCreate(projectName, projectDescription);
    onClose();
  };

  useEffect(() => {
    setProjectName(initialProjectName);
    setProjectDescription(initialProjectDescription);
  }, [isOpen, initialProjectName, initialProjectDescription]);

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="project-modal-title"
      aria-describedby="project-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px',
        }}
      >
        <Typography variant="h5" component="h2" id="project-modal-title" gutterBottom>
          Create Project
        </Typography>
        <TextField
          label="Project Name"
          id="projectName"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Project Description"
          id="projectDescription"
          fullWidth
          multiline
          rows={4}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <Button variant="contained" onClick={handleCreate} color="primary">
            Create
          </Button>
          <Button variant="contained" onClick={onClose} color="secondary" sx={{ ml: 2 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProjectModal;
