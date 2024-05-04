import React, { useState } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { Sprint, Tag } from './TaskModal';
import './Task.css'
import dayjs, { Dayjs } from 'dayjs';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Menu, MenuItem } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TestModal from './TestModal';
import ScienceIcon from '@mui/icons-material/Science';

interface TaskProps {
  id: number;
  taskName: string;
  taskSprint: Sprint | string;
  taskTag: Tag | string;
  taskDueDate: Dayjs;
  sourceColumn: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDeleteTask?: (taskId: number) => void;
}

type ActionType = 'Add Test' | 'Delete Task';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const Task: React.FC<TaskProps> = ({ id, taskName, taskSprint, taskTag, taskDueDate, sourceColumn, draggable = true, onDragStart, onClick, onDeleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id, sourceColumn },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [addTestModalOpen, setAddTestModalOpen] = useState(false);
  const [testInfo, setTestInfo] = useState<{ testName: string; steps: string[]; expectedResults: string[] } | null>(null);

  const handleAddTest = (testName: string, steps: string[], expectedResults: string[]) => {
    // Add your logic here to handle adding the test
    console.log('Test added:', testName);
    console.log('Steps:', steps);
    console.log('Expected Results:', expectedResults);
    setTestInfo({ testName, steps, expectedResults });
    setAddTestModalOpen(false); // Close the modal after adding the test
  };

  const handleButtonClick = (action: ActionType) => {
    // Define actions for each button in the dropdown
    switch (action) {
      case 'Add Test':
        setAddTestModalOpen(true);
        break;
      case 'Delete Task':
        deleteTask(id);
        break;
      default:
        break;
    }
    // Close the dropdown after an action is performed
    setAnchorEl(null);
  };

  const deleteTask = (taskId: number) => {
    // Call the onDeleteTask function passed from parent component
    console.log('Deleting task with ID:', taskId);
    if (onDeleteTask) {
      onDeleteTask(taskId);
    }
  };

  return (
    <div
      key={id}
      className="task"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      ref={drag}
    >
      <Card variant='outlined'>
        <div className='task-header'>
          <Button
              variant="outlined"
              aria-controls="task-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              className='dropdown-button'
            >
            <MoreVertIcon />
          </Button>
          <Menu
            id="task-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className='dropdown-button'
          >
            <MenuItem onClick={() => handleButtonClick('Add Test')}>Add Test</MenuItem>
            <MenuItem onClick={() => handleButtonClick('Delete Task')}>Delete Task</MenuItem>
          </Menu>
        </div>
          <React.Fragment>
            <CardContent>
              {/* <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Word of the Day
              </Typography> */}
              <Typography variant="h5" component="div">
                {taskName}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Samir Shahid
              </Typography>
              <Typography variant="body2">
                Iteration Path: {taskSprint}
                <br />
                State: {sourceColumn}
                <br />
                Item Type: {taskTag}
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant='outlined' size="small">Due Date: {taskDueDate.toString()}</Button>
              {testInfo && (
                <Button className='dropdown-button' variant="outlined" onClick={() => setAddTestModalOpen(true)}>
                  <ScienceIcon />
                </Button>
              )}
            </CardActions>
          </React.Fragment>
        </Card>
        {addTestModalOpen && (
          <TestModal
            open={addTestModalOpen}
            onClose={() => setAddTestModalOpen(false)}
            onAddTest={handleAddTest}
            testName={testInfo?.testName || ''}
            steps={testInfo?.steps || []}
            expectedResults={testInfo?.expectedResults || []}
          />
        )}
    </div>
  );
};

export default Task;
