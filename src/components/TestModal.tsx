import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid } from '@mui/material';

interface TestModalProps {
  open: boolean;
  testName: string;
  steps: string[];
  expectedResults: string[];
  onClose: () => void;
  onAddTest: (testName: string, steps: string[], expectedResults: string[]) => void;
}

const TestModal: React.FC<TestModalProps> = ({ open, testName: initialTestName = '', steps: initialSteps = [], expectedResults: initialExpectedResults = [], onClose, onAddTest }) => {
  const [testName, setTestName] = useState(initialTestName);
  const [steps, setSteps] = useState<string[]>(initialSteps);
  const [expectedResults, setExpectedResults] = useState<string[]>(initialExpectedResults);

  useEffect(() => {
    setTestName(initialTestName);
    setSteps(initialSteps);
    setExpectedResults(initialExpectedResults);
  }, [open, initialTestName, initialSteps, initialExpectedResults]);

  const handleAddTest = () => {
    onAddTest(testName, steps, expectedResults);
    setTestName('');
    setSteps([]);
    setExpectedResults([]);
    onClose();
  };

  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const handleExpectedResultChange = (index: number, value: string) => {
    const updatedExpectedResults = [...expectedResults];
    updatedExpectedResults[index] = value;
    setExpectedResults(updatedExpectedResults);
  };

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleAddExpectedResult = () => {
    setExpectedResults([...expectedResults, '']);
  };

  return (
    <Modal 
      open={open}
      onClose={onClose}
      aria-labelledby="test-modal-title"
      aria-describedby="test-modal-description"
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Steps
            </Typography>
            {steps.map((step, index) => (
              <TextField
                key={index}
                label={`Step ${index + 1}`}
                variant="outlined"
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                fullWidth
              />
            ))}
            <Button variant="contained" onClick={handleAddStep}>Add Step</Button>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Expected Results
            </Typography>
            {expectedResults.map((result, index) => (
              <TextField
                key={index}
                label={`Expected Result ${index + 1}`}
                variant="outlined"
                value={result}
                onChange={(e) => handleExpectedResultChange(index, e.target.value)}
                fullWidth
              />
            ))}
            <Button variant="contained" onClick={handleAddExpectedResult}>Add Expected Result</Button>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={handleAddTest}>Create Test</Button>
      </Box>
    </Modal>
  );
};

export default TestModal;
