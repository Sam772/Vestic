import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ProjectAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  totalTasks: () => number;
  tasksInSprint1: () => number;
  tasksInSprint2: () => number;
  tasksInSprint3: () => number;
  completedTasks: () => number;
}

const ProjectAnalyticsModal: React.FC<ProjectAnalyticsModalProps> = ({ 
  open,
  onClose,
  totalTasks:
  totalTasks,
  tasksInSprint1: tasksInSprint1,
  tasksInSprint2: tasksInSprint2,
  tasksInSprint3: tasksInSprint3,
  completedTasks: completedTasks
}) => {

  return (
    <Modal 
      open={open}
      onClose={onClose}
      aria-labelledby="projectanalytics-modal-title"
      aria-describedby="projectanalytics-modal-description"
      className='dropdown-button'
    >
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        minWidth: 300
      }}>
          <Button className="close-btn" onClick={onClose} sx={{ position: 'absolute', top: 5, right: 0 }}>
            <CloseIcon />
          </Button>
        <h2> Your Project Analytics </h2>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Total Tasks:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{totalTasks()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Tasks in Sprint 1:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{tasksInSprint1()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Tasks in Sprint 2:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{tasksInSprint2()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Tasks in Sprint 3:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{tasksInSprint3()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Completed Tasks:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{completedTasks()}</Typography>
          </Grid>
          {/* Add more Grid items for other statistics */}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProjectAnalyticsModal;
