import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

interface TestModalProps {
  open: boolean;
  onClose: () => void;
  onAddTest: (testName: string) => void;
}

const TestModal: React.FC<TestModalProps> = ({ open, onClose, onAddTest }) => {
  const [testName, setTestName] = useState('');

  const handleAddTest = () => {
    onAddTest(testName);
    setTestName('');
    onClose();
  };

  return (
    <Modal 
      open={open}
      onClose={onClose}
      aria-labelledby="test-modal-title"
      aria-describedby="test-modal-description"
      className='dropdown-button'
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: 300 }}>
        <Typography variant="h6" id="test-modal-title" gutterBottom>
          Add Test
        </Typography>
        <TextField
          label="Test Name"
          variant="outlined"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          fullWidth
          autoFocus
        />
        <Button variant="contained" onClick={handleAddTest}>Add</Button>
      </Box>
    </Modal>
  );
};

export default TestModal;
