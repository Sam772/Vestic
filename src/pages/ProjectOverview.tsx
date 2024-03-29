import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProjectOverview.css';
import Task from '../components/Task'
import TaskModal from '../components/TaskModal';
import { useDrop, useDrag, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import HeroProjectOverview from '../components/HeroProjectOverview';
import getLPTheme from '../getLPTheme';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

// Defines an individual task
interface Task {
  id: number;
  text: string;
  description: string;
  comments: string[];
}

// Represents a collection of tasks for each column of different states
interface Tasks {
  New: Task[];
  Committed: Task[];
  Done: Task[];
}

// The names of the columns
export enum ColumnName {
  NEW = 'New',
  COMMITTED = 'Committed',
  DONE = 'Done',
}

// Initialised with initial columns and tasks
const initialTasks: Tasks = {
  New: [],
  Committed: [],
  Done: [],
};

interface DropResult {
  columnName: ColumnName;
}

interface DraggableColumnProps {
  columnName: string; // Define the type of columnName
}

// Represents the page content
const KanbanBoard: React.FC = () => {

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const location = useLocation();
  const projectName = location.state?.projectName || '';
  const projectDescription = location.state?.projectDescription || '';

  // Represents the initial state of tasks
  const [tasks, setTasks] = useState<Tasks>(initialTasks);

  // Has the count of initial tasks
  const [initialTaskCounts, setInitialTaskCounts] = useState<Record<ColumnName, number>>({
    New: 0,
    Committed: 0,
    Done: 0,
  });

  // useEffect hook to set initial task counts when component mounts
  useEffect(() => {
    // Calculate initial task counts
    const newTaskCount = initialTasks.New.length;
    const committedTaskCount = initialTasks.Committed.length;
    const doneTaskCount = initialTasks.Done.length;

    // Set initial task counts
    setInitialTaskCounts({
      New: newTaskCount,
      Committed: committedTaskCount,
      Done: doneTaskCount,
    });
  }, []);

  // Represents the id of selected tasks, which doesn't exist initially hence null
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Opens and closes the modal for a task
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Contains the initial columns and their order
  const [columnOrder, setColumnOrder] = useState<ColumnName[]>([ColumnName.NEW, ColumnName.COMMITTED, ColumnName.DONE]);

  // Same as selected tasks but for columns
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  // Stores the text of new tasks, initialised with empty strings for each column
  const [newTaskTexts, setNewTaskTexts] = useState<{[key: string]: string}>({
    New: '',
    Committed: '',
    Done: '',
  });

  // Stores the descriptions of new tasks, initialised with empty strings for each column
  const [newTaskDescriptions, setNewTaskDescriptions] = useState<Record<ColumnName, string>>({
    New : '',
    Committed : '',
    Done : '',
  });

  // Stores new comments, initialised with empty strings for each column name
  const [newComment, setNewComment] = useState<Record<ColumnName, string>>({
    New: '',
    Committed: '',
    Done: '',
  });

  // Stores the text used to filter tasks by name, initialised as an empty string
  const [filterText, setFilterText] = useState<string>('');

  // Define state variables for the new column name
  const [newColumnName, setNewColumnName] = useState<ColumnName | "">('');

  // Function to handle renaming a column
  const handleRenameColumn = (oldColumnName: ColumnName, newColumnName: ColumnName) => {
    if (newColumnName.trim() !== '') {
      setColumnOrder(prevOrder => prevOrder.map(col => col === oldColumnName ? newColumnName : col));
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        updatedTasks[newColumnName] = updatedTasks[oldColumnName];
        delete updatedTasks[oldColumnName];
        return updatedTasks;
      });
      setSelectedColumn(null);
      setNewColumnName(''); // Reset the newColumnName state after renaming
    }
  };


  // Filters tasks by text input in the filter field and returns those tasks
  const filteredTasks = Object.keys(tasks).reduce((filtered, columnName) => {
    filtered[columnName as keyof Tasks] = tasks[columnName as keyof Tasks].filter(task => task.text.toLowerCase().includes(filterText.toLowerCase()));
    return filtered;
  }, {} as Partial<Tasks>) as Tasks;
  

  // Opens the task modal for the selected task
  const openModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  // Closes the task modal
  const closeModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  };

  // Updates the task name of tasks
  const handleNewTaskTextChange = (columnName: ColumnName, newText: string) => {
    setNewTaskTexts(prevTexts => ({
      ...prevTexts,
      [columnName]: newText,
    }));
  };

  // Used for when a task is created
  const handleCreateNewTask = (columnName: ColumnName) => {

    // These fields are initialised when the task is created
    const text = newTaskTexts[columnName];
    const description = newTaskDescriptions[columnName];
    const comment = newComment[columnName] || '';
    
    // Prevents task from being created if there is no text
    if (text.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: text,
        description: description,
        comments: [comment],
      };
      // Sets the initial state of tasks
      setTasks(prevTasks => ({
        ...prevTasks,
        [columnName]: [...prevTasks[columnName], newTask],
      }));
      // Sets the initial task name
      setNewTaskTexts(prevTexts => ({
        ...prevTexts,
        [columnName]: '',
      }));
      // Sets the initial task description
      setNewTaskDescriptions(prevDescriptions => ({
        ...prevDescriptions,
        [columnName]: '',
      }));
      // Sets the initial task comments
      setNewComment(prevComments => ({
        ...prevComments,
        [columnName]: '',
      }));
    }
  };

  // Used for when a comment has been posted
  const handlePostComment = (columnName: ColumnName) => {

    // Gets the comment from the task
    const comment = newComment[columnName];

    // Checks if the comment isn't empty
    if (comment && comment.length > 0) {
      const updatedTasks = {
        ...tasks,
        [columnName]: tasks[columnName].map(task => ({
          ...task,
          comments: [...task.comments, comment],
        })),
      };
      // Updated the state of the task
      setTasks(updatedTasks);
      // Sets the new comment
      setNewComment(prevComments => ({
        ...prevComments,
        [columnName]: '',
      }));
    }
  };

  // Updates the comment if it changes
  const handleNewCommentChange = (columnName: ColumnName, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Updates the state of the new comment
    setNewComment(prevComments => ({
      ...prevComments,
      [columnName]: value,
    }));
  };
  
  const moveTask = (taskId: number, sourceColumn: keyof Tasks, targetColumn: keyof Tasks | null) => {
    // Handle the case where targetColumn is null
    if (targetColumn === null) {
        console.error('Target column is null.');
        return;
    }

    const taskIndex = tasks[sourceColumn].findIndex(task => task.id === taskId);
  
    if (taskIndex === -1) {
      console.error(`Task with ID ${taskId} not found in column ${sourceColumn}.`);
      return;
    }
  
    const taskToMove = tasks[sourceColumn][taskIndex];
  
    const updatedSourceTasks = tasks[sourceColumn].filter(task => task.id !== taskId);
  
    // Check if targetColumn exists in tasks object
    if (!tasks.hasOwnProperty(targetColumn)) {
      // Handle the case where the targetColumn doesn't exist
      console.error(`Column "${targetColumn}" does not exist.`);
      return;
    }
  
    // Get the current tasks in the target column
    const currentTargetTasks = tasks[targetColumn] || [];
  
    const updatedTargetTasks = [...currentTargetTasks, taskToMove];

    console.log(`Moving task with ID ${taskId} from column ${sourceColumn} to column ${targetColumn}.`);
  
    setTasks(prevTasks => ({
      ...prevTasks,
      [sourceColumn]: updatedSourceTasks,
      [targetColumn]: updatedTargetTasks,
    }));
  };


  // For deleting tasks
  const deleteTask = (taskId: number) => {

    // Gets all tasks
    const updatedTasks: Tasks = { ...tasks };

    // Iterates through all the tasks in each column
    for (const column of [ColumnName.NEW, ColumnName.COMMITTED, ColumnName.DONE]) {
      updatedTasks[column] = updatedTasks[column].filter(task => task.id !== taskId);
    }

    // Updated the state of the current tasks
    setTasks(updatedTasks);
    closeModal();
  };

  // Allows dropping and dragging of tasks
  const [, drop] = useDrop({
    accept: 'TASK', // Accept dropped items of type 'TASK'
    drop: (item: { id: number; sourceColumn: string }) => {
      // Handle dropping the task into the respective column
      moveTask(item.id, item.sourceColumn as ColumnName, selectedColumn as ColumnName);
    },
  });

  // const DraggableColumn: React.FC<DraggableColumnProps> = ({ columnName }) => {
  //   // Define drag functionality for columns
  //   const [, columnDrag] = useDrag({
  //     type: 'COLUMN',
  //     item: { type: 'COLUMN' },
  //     collect: (monitor) => ({
  //       isDragging: monitor.isDragging(),
  //     })
  //   });
  // }

  // Allows dropping and dragging of columns
  const [, columnDrop] = useDrop({
    accept: 'COLUMN', // Accept dropped items of type 'COLUMN'
    drop: (item: { columnName: ColumnName }) => {
      // Handle dropping the column
      moveColumn(item.columnName, selectedColumn as ColumnName);
    },
  });

  const moveColumn = (dragColumnName: ColumnName, hoverColumnName: ColumnName) => {
    // Find the indices of the columns being dragged and hovered over
    const dragIndex = columnOrder.indexOf(dragColumnName);
    const hoverIndex = columnOrder.indexOf(hoverColumnName);
  
    // Make a copy of the column order array
    const newColumnOrder = [...columnOrder];
  
    // Remove the dragged column from its original position
    const [draggedColumn] = newColumnOrder.splice(dragIndex, 1);
  
    // Insert the dragged column at the position of the hovered column
    newColumnOrder.splice(hoverIndex, 0, draggedColumn);
  
    // Update the state with the new column order
    setColumnOrder(newColumnOrder);
  };

  // Handle the onDrop event
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior
    event.preventDefault();

    // Retrieve the task data from the drag event
    const taskId = event.dataTransfer.getData('taskId');
    const sourceColumn = event.dataTransfer.getData('sourceColumn');
    const targetColumn = event.currentTarget.id as ColumnName; // Extract the column name from the drop target

    // If the task ID and source column are available, move the task
    if (taskId && sourceColumn) {
      // Move the task to the target column
      if (targetColumn !== null && targetColumn !== sourceColumn) {
        moveTask(parseInt(taskId), sourceColumn as ColumnName, targetColumn);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // For creating a new column
  const handleCreateNewColumn = (columnName: ColumnName | null, newName: string) => {
    if (columnName !== null) {
      if (newName.trim() !== '') {
        setTasks(prevTasks => {
          const updatedTasks = {...prevTasks};
          updatedTasks[newName as ColumnName] = updatedTasks[columnName];
          delete updatedTasks[columnName];
          return updatedTasks;
        });
        setColumnOrder(prevOrder => {
          const newOrder = [...prevOrder];
          const index = newOrder.indexOf(columnName);
          if (index !== -1) {
            newOrder[index] = newName as ColumnName;
          }
          return newOrder;
        });
        setSelectedColumn(null);
      }
    } else {
      if (newName.trim() !== '') {
        setTasks(prevTasks => ({
          ...prevTasks,
          [newName.trim()]: [],
        }));
        setColumnOrder(prevOrder => [...prevOrder, newName as ColumnName]);
      }
    }
  };

  // For deleting a column
  const handleDeleteColumn = (columnName: ColumnName) => {
    setColumnOrder(prevOrder => prevOrder.filter(col => col !== columnName));
  
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      delete updatedTasks[columnName];
      return updatedTasks;
    });
  
    if (selectedTaskId && tasks[columnName].find(task => task.id === selectedTaskId)) {
      closeModal();
    }
  };

  // For saving the updated data of a new task
  const handleSaveTask = (taskId: number, newTaskName: string, newTaskDescription: string) => {
    const updatedTasks = {
      ...tasks,
      New: tasks.New.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
      Committed: tasks.Committed.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
      Done: tasks.Done.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
    };
    setTasks(updatedTasks);
    closeModal();
  };

  // Calculate column height based on the number of tasks
  const calculateColumnHeight = (columnName: ColumnName): number => {
    
    // Get the number of tasks in the column
    const numTasks = filteredTasks[columnName].length;

    const minHeight = 120;
    const maxHeightPerTask = 50;
    const shouldAdjustHeight = numTasks > initialTaskCounts[columnName];
    const calculatedHeight = shouldAdjustHeight ? minHeight + (numTasks - initialTaskCounts[columnName]) * maxHeightPerTask : minHeight;

    return calculatedHeight;
  };

  //#region - Unused functions
  const handleTaskRename = (taskId: number, newTaskName: string) => {
    const updatedTasks = {
      ...tasks,
      New: tasks.New.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
      Committed: tasks.Committed.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
      done: tasks.Done.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
    };
    setTasks(updatedTasks);
  };

  const handleDescriptionChange = (columnName: ColumnName, description: string) => {
    setNewTaskDescriptions(prevDescriptions => ({
      ...prevDescriptions,
      [columnName]: description,
    }));
  };

  const updateComments = (tasksArray: Task[], comment: string): Task[] => {
    return tasksArray.map(task => ({
      ...task,
      comments: [...task.comments, comment], // Add the new comment to the task's comments array
    }));
  };

  const getTaskName = (taskId: number): string => {
    for (const column of Object.values(tasks)) {
      const task = column.find((task : Task) => task.id === taskId);
      if (task) {
        return task.text;
      }
    }
    return '';
  };
  //#endregion

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
    <HeroProjectOverview />
      <Box sx={{ bgcolor: 'background.default'}}>
        <div ref={drop} className="kanban-board" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div className="filter-container">
            <input
              type="text"
              className="filter-box"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter tasks by name"
            />
          </div>
          {columnOrder.map(columnName => (
            <div 
              key={columnName}
              className="column"
              style={{ maxHeight: `${calculateColumnHeight(columnName)}px` }}
              id={columnName}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              //ref={columnDrag}
            >
              <h2>
                {selectedColumn === columnName ? (
                  <div className="column">
                    <input
                      type="text"
                      className="input-field"
                      value={newColumnName || columnName}
                      onChange={(e) => setNewColumnName(e.target.value as ColumnName)}
                    />
                    {newColumnName ? (
                      <button onClick={() => handleRenameColumn(columnName as ColumnName, newColumnName)}>Save</button>
                    ) : (
                      <button disabled>Save</button>
                    )}
                  </div>
                    ) : (
                      <span onClick={() => setSelectedColumn(columnName)}>{columnName}</span>
                    )}
                </h2>
              {filteredTasks[columnName].map(task => (
                <Task
                  key={task.id}
                  id={task.id}
                  text={task.text}
                  sourceColumn={columnName}
                  onClick={() => openModal(task.id)}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', String(task.id));
                    e.dataTransfer.setData('sourceColumn', columnName);
                  }}
                />
              ))}
              <div>
                <input
                  type="text"
                  className="input-field"
                  value={newTaskTexts[columnName]}
                  onChange={(e) => handleNewTaskTextChange(columnName as ColumnName, e.target.value)}
                  placeholder="Enter task name"
                />
                <button 
                  className="create-task-button"
                  onClick={() => handleCreateNewTask(columnName as ColumnName)}>Create New Task
                </button>
                <button 
                  className="delete-column-button"
                  onClick={() => handleDeleteColumn(columnName)}>Delete Column  
                </button>
              </div>
            </div>
          ))}
          <div>
            <input
              type="text"
              className="input-field"
              value={selectedColumn === null ? "" : selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              placeholder="Enter new column name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateNewColumn(null, selectedColumn!);
                }
              }}
            />
            <button
              className="create-column-button"
              onClick={() => handleCreateNewColumn(null, selectedColumn!)}>Add New Column
            </button>
          </div>
          {isModalOpen && (
            <TaskModal
            isOpen={isModalOpen}
            taskId={selectedTaskId || 0}
            taskName={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.text || '' : ''}
            taskDescription={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.description || '' : ''}
            comments={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.comments || [] : []}
            onClose={closeModal}
            onDelete={deleteTask}
            onSave={handleSaveTask}
            onPostComment={handlePostComment}
            newComment={newComment}
            onNewCommentChange={handleNewCommentChange}
            />
          )}
        </div>
      </Box>
      {/* <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      /> */}
    </ThemeProvider>
  );
};

export default KanbanBoard;