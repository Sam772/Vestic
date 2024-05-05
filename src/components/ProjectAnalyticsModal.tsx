import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

interface ProjectAnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  totalItems: () => number;
  itemsInSprints: () => number;
}

const ProjectAnalyticsModal: React.FC<ProjectAnalyticsModalProps> = ({ open, onClose, totalItems, itemsInSprints }) => {

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
        <Typography variant="h6" id="projectanalytics-modal-title" gutterBottom>
          Add Analytic
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Total Items:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{totalItems()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Items in Sprints:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{itemsInSprints()}</Typography>
          </Grid>
          {/* Add more Grid items for other statistics */}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProjectAnalyticsModal;
