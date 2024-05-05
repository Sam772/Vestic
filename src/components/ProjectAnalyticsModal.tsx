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
  featureTasks: () => number;
  bugTasks: () => number;
  otherTasks: () => number;
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
  featureTasks: featureTasks,
  bugTasks: bugTasks,
  otherTasks: otherTasks,
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
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 500,
          maxWidth: 1000,
          minHeight: 500,
          maxHeight: '80vh',
          '& h2': {
            fontSize: '1.8rem',
            marginBottom: '1.5rem',
          },
          '& .analytics-section': {
            marginBottom: '2rem',
          },
          '& .analytics-item': {
            fontSize: '1.2rem',
            marginBottom: '0.5rem',
          },
        }}
      >
        <Button
          className="close-btn"
          onClick={onClose}
          sx={{ position: 'absolute', top: 5, right: 0 }}
        >
          <CloseIcon />
        </Button>
        <h2>Your Project Analytics</h2>
        <Grid container spacing={4} className="analytics-section">
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              General Analytics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Typography className="analytics-item">Total Tasks:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className="analytics-item">{totalTasks()}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography className="analytics-item">Completed Tasks:</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography className="analytics-item">{completedTasks()}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Sprint Analytics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography className="analytics-item">Sprint 1:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{tasksInSprint1()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">Sprint 2:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{tasksInSprint2()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">Sprint 3:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{tasksInSprint3()}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Tag Analytics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography className="analytics-item">Feature Tasks:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{featureTasks()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">Bug Tasks:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{bugTasks()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">Other Tasks:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className="analytics-item">{otherTasks()}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProjectAnalyticsModal;
