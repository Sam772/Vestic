import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

interface TestPlansModalProps {
  open: boolean;
  onClose: () => void;
}

const TestPlansModal: React.FC<TestPlansModalProps> = ({ open, onClose, }) => {

  return (
    <Modal 
      open={open}
      onClose={onClose}
      aria-labelledby="testplans-modal-title"
      aria-describedby="testplans-modal-description"
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
         <h2> Your Test Plans </h2>
      </Box>
    </Modal>
  );
};

export default TestPlansModal;
