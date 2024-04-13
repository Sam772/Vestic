import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProjectOverview.css';
import Task from '../components/Task'
import TaskModal from '../components/TaskModal';
import { useDrop, useDrag, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { PaletteMode } from '@mui/material/';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from '../components/AppAppBar';
import HeroProjectOverview from '../components/HeroProjectOverview';
import getLPTheme from '../getLPTheme';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material/';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { Sprint, Tag } from '../components/TaskModal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

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
  name: string;
  description: string;
  comments: string[];
  dueDateTime: Dayjs,
  files: File[]
  sprint: Sprint | string
  tag: Tag | string
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
  const [newTaskName, setNewTaskName] = useState<{[key: string]: string}>({
    New: '',
    Committed: '',
    Done: '',
  });

  // Stores the descriptions of new tasks, initialised with empty strings for each column
  const [newTaskDescription, setNewTaskDescription] = useState<Record<ColumnName, string>>({
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

  // Stores new files, initialised with empty array for each column name
  const [newFiles, setNewFiles] = useState<Record<ColumnName, File[]>>({
    New: [],
    Committed: [],
    Done: [],
  });

  const [setNewDueDateTime, setDueDateTime] = useState<Record<ColumnName, Dayjs>>({
    New: dayjs(),
    Committed: dayjs(),
    Done: dayjs(),
  });

  const [setNewSprint, setSprint] = useState<Record<ColumnName, Sprint>>({
    New: Sprint.Sprint1,
    Committed: Sprint.Sprint1,
    Done: Sprint.Sprint1,
  });

  // Stores the descriptions of new tasks, initialised with empty strings for each column
  const [newTaskTag, setNewTaskTag] = useState<Record<ColumnName, Tag>>({
    New : Tag.Tag1,
    Committed : Tag.Tag1,
    Done : Tag.Tag1,
  });

  // Stores the text used to filter tasks by name, initialised as an empty string
  const [filterText, setFilterText] = useState<string>('');
  const [selectedSprint, setSelectedSprint] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Get unique sprints from tasks
  const sprints: string[] = Array.from(
    new Set(
      Object.values(tasks).flatMap((taskList: Task[]) => taskList.map((task: Task) => task.sprint))
    )
  );

  // Get unique tags from tasks
  const tags: string[] = Array.from(
    new Set(
      Object.values(tasks).flatMap((taskList: Task[]) => taskList.map((task: Task) => task.tag))
    )
  );

  // Filter tasks based on selected sprint and filter text
  const filteredTasks: Tasks = Object.keys(tasks).reduce((filtered, columnName) => {
    filtered[columnName as keyof Tasks] = tasks[columnName as keyof Tasks].filter(task => {
      if (
        (selectedSprint === 'All' || task.sprint === selectedSprint) && 
        (selectedTag === 'All' || task.tag === selectedTag)
      ) {
        return task.name.toLowerCase().includes(filterText.toLowerCase());
      }
      return false;
    });
    return filtered;
  }, {} as Tasks);

  // Opens the task modal for the selected task
  const openModal = (taskId: number, event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!event || !(event.target as HTMLElement).closest('.dropdown-button')) {
      setSelectedTaskId(taskId);
      setIsModalOpen(true);
    }
  };


  // Closes the task modal
  const closeModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  };

  // Updates the task name of tasks
  const handleNewTaskTextChange = (columnName: ColumnName, newText: string) => {
    setNewTaskName(prevTexts => ({
      ...prevTexts,
      [columnName]: newText,
    }));
  };

  // Used for when a task is created
  const handleCreateNewTask = (columnName: ColumnName) => {

    // These fields are initialised when the task is created
    const name = newTaskName[columnName];
    const description = newTaskDescription[columnName];
    const comment = newComment[columnName] || '';
    const files = newFiles[columnName] || [];
    const dueDateTime = setNewDueDateTime[columnName] || Dayjs;
    const sprint = setNewSprint[columnName] || Sprint.Sprint1;
    const tag = newTaskTag[columnName] || Tag.Tag1;
    
    // Prevents task from being created if there is no text
    if (name.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        name: name,
        description: description,
        comments: [comment],
        dueDateTime: dueDateTime,
        files: files,
        sprint: sprint,
        tag: tag,
      };
      // Sets the initial state of tasks
      setTasks(prevTasks => ({
        ...prevTasks,
        [columnName]: [...prevTasks[columnName], newTask],
      }));
      // Sets the initial task name
      setNewTaskName(prevTexts => ({
        ...prevTexts,
        [columnName]: '',
      }));
      // Sets the initial task description
      setNewTaskDescription(prevDescriptions => ({
        ...prevDescriptions,
        [columnName]: '',
      }));
      // Sets the initial task comments
      setNewComment(prevComments => ({
        ...prevComments,
        [columnName]: '',
      }));
      // Sets the initial task due date and time
      setDueDateTime(prevDueDateTime => ({
        ...prevDueDateTime,
        [columnName]: dayjs(),
      }));
      // Sets the initial task files
      setNewFiles(prevFiles => ({
        ...prevFiles,
        [columnName]: [],
      }));
      // Sets the initial task files
      setSprint(prevSprint => ({
        ...prevSprint,
        [columnName]: Sprint.Sprint1,
      }));
      // Sets the initial task tag
      setNewTaskTag(prevTags => ({
        ...prevTags,
        [columnName]: Tag.Tag1,
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
  
  const moveTask = (taskId: number, sourceColumn: keyof Tasks, targetColumn: keyof Tasks | null, dropPosition: number | null ) => {
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


    // Determine the index where the task should be inserted based on drop position
    let insertIndex = currentTargetTasks.length; // By default, insert at the end
    if (dropPosition !== null) {
      insertIndex = dropPosition; // Use the dropPosition as the insertIndex
    }

    // Insert the task at the determined index
    const updatedTargetTasks = [...currentTargetTasks.slice(0, insertIndex), taskToMove, ...currentTargetTasks.slice(insertIndex)];

      console.log(`Moving task with ID ${taskId} from column ${sourceColumn} to column ${targetColumn}.`);
      console.log('Drop Position:', dropPosition);
      console.log('Insert Index:', insertIndex);
    
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
    drop: (item: { id: number; sourceColumn: string }, monitor) => {
      const dropPosition = monitor.getClientOffset()?.y ?? null;
      // Handle dropping the task into the respective column
      moveTask(item.id, item.sourceColumn as ColumnName, selectedColumn as ColumnName, dropPosition);
    },
  });

  const moveColumnLeft = (index: number) => {
    if (index > 0) {
      const newColumnOrder = [...columnOrder];
      const temp = newColumnOrder[index];
      newColumnOrder[index] = newColumnOrder[index - 1];
      newColumnOrder[index - 1] = temp;
      setColumnOrder(newColumnOrder);
    }
  };

  const moveColumnRight = (index: number) => {
    if (index < columnOrder.length - 1) {
      const newColumnOrder = [...columnOrder];
      const temp = newColumnOrder[index];
      newColumnOrder[index] = newColumnOrder[index + 1];
      newColumnOrder[index + 1] = temp;
      setColumnOrder(newColumnOrder);
    }
  };

  // Handle the onDrop event
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior
    event.preventDefault();
  
    // Retrieve the task data from the drag event
    const taskId = event.dataTransfer.getData('taskId');
    const sourceColumn = event.dataTransfer.getData('sourceColumn');
    const targetColumn = event.currentTarget.id as ColumnName; // Extract the column name from the drop target
  
    // Get the drop position relative to existing tasks
    const dropPosition = calculateDropPosition(event.clientY, event.currentTarget, tasks[targetColumn]);

    console.log('Drop Position: (handleDrop)', dropPosition);

    const totalTasksInTargetColumn = tasks[targetColumn]?.length || 0;

    console.log('totaltasks: ', totalTasksInTargetColumn);

    // Calculate the insertion index based on the drop position
    const insertionIndex = calculateInsertionIndex(dropPosition, tasks[targetColumn]);
    console.log('Insertion Index: (handleDrop)', insertionIndex);

    // If the task ID and source column are available, move the task
    if (taskId && sourceColumn) {
      // Move the task to the target column and position
      if (targetColumn !== null && targetColumn !== sourceColumn) {
        // Always pass updatedDropPosition, which could be null
        moveTask(parseInt(taskId), sourceColumn as ColumnName, targetColumn, insertionIndex);
      }
    }
  };

  // Function to calculate the drop position relative to existing tasks
  const calculateDropPosition = (clientY: number, dropTarget: HTMLDivElement, tasks: Task[]): number => {
    const { top, bottom, height } = dropTarget.getBoundingClientRect();
    const offsetY = clientY - top;
    console.log('OffsetY:', offsetY);
    const relativeY = offsetY / height;
    console.log('RelativeY:', relativeY);

    // Calculate the total number of tasks
    const totalTasks = tasks.length * 120;

    // Calculate the total height of tasks
    const totalHeight = tasks.length * 120; // Assuming each task has a height of 120px

    // Calculate the insertion index based on relative position
    const insertIndex = Math.floor(relativeY * totalHeight) / 120;

    return insertIndex;
  };


  // Function to calculate the insertion index based on drop position
  const calculateInsertionIndex = (dropPosition: number, tasks: Task[]): number => {
    // If drop position is 0 or less, insert at the beginning
    if (dropPosition <= 0) {
        return 0;
    }
    
    // If drop position exceeds the length of tasks, insert at the end
    if (dropPosition >= tasks.length) {
        return tasks.length;
    }

    // Otherwise, insert at the calculated position
    return dropPosition;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

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
  const handleSaveTask = (taskId: number, newTaskName: string, newTaskDescription: string, comments: string[], dueDateTime: Dayjs, files: File[], sprint: Sprint | string, tag: Tag | string) => {
    const updatedTasks = {
      ...tasks,
      New: tasks.New.map(task => task.id === taskId ? 
        { ...task, name: newTaskName,
          description: newTaskDescription,
          comments: [...comments],
          dueDateTime: dueDateTime,
          files: files,
          sprint: sprint,
          tag: tag,
        } : task),
      Committed: tasks.Committed.map(task => task.id === taskId ?
        { ...task, name: newTaskName,
          description: newTaskDescription,
          comments: [...comments],
          dueDateTime: dueDateTime,
          files: files,
          sprint: sprint,
          tag: tag,
        } : task),
      Done: tasks.Done.map(task => task.id === taskId ?
        { ...task, name: newTaskName,
          description: newTaskDescription,
          comments: [...comments],
          dueDateTime: dueDateTime,
          files: files,
          sprint: sprint,
          tag: tag,
        } : task),
    };
    setTasks(updatedTasks);
    closeModal();
    console.log("comments: ", comments);
  };

  // Calculate column height based on the number of tasks
  const calculateColumnHeight = (columnName: ColumnName): number => {
    
    // Get the number of tasks in the column
    const numTasks = filteredTasks[columnName].length;

    const minHeight = 300; //120
    const maxHeightPerTask = 120; //50
    const shouldAdjustHeight = numTasks > initialTaskCounts[columnName];
    const calculatedHeight = shouldAdjustHeight ? minHeight + (numTasks - initialTaskCounts[columnName]) * maxHeightPerTask : minHeight;

    return calculatedHeight;
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <CssBaseline />
    <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
    <HeroProjectOverview />
      <Box sx={{ bgcolor: 'background.default'}}>
        <div className="filter-container" style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="text"
            className="filter-box"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter tasks by name"
            fullWidth
          />
          <Select
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
            fullWidth
          >
            <MenuItem value="All">All Sprints</MenuItem>
            {sprints.map((sprint, index) => (
              <MenuItem key={index} value={sprint}>{sprint}</MenuItem>
            ))}
          </Select>
          <Select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            fullWidth
          >
            <MenuItem value="All">All Tags</MenuItem>
            {tags.map((tag, index) => (
              <MenuItem key={index} value={tag}>{tag}</MenuItem>
            ))}
          </Select>
        </div>
        <div ref={drop} className="kanban-board" /*onDrop={handleDrop}*/ onDragOver={handleDragOver}>
          {columnOrder.map((columnName, index) => (
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
                    <TextField
                      type="text"
                      className="input-field"
                      value={newColumnName || columnName}
                      onChange={(e) => setNewColumnName(e.target.value as ColumnName)}
                    />
                    {newColumnName ? (
                      <Button
                        variant='outlined'
                        onClick={() => handleRenameColumn(columnName as ColumnName, newColumnName)}
                        style={{marginRight: '8px'}}
                      >Save</Button>
                    ) : (
                      <Button disabled>Save</Button>
                    )}
                  </div>
                ) : (
                  <span onClick={() => setSelectedColumn(columnName)}>{columnName}</span>
                )}
                {index > 0 && (
                  <Button variant='outlined' style={{marginLeft: '8px'}} onClick={() => moveColumnLeft(index)}><WestIcon/></Button>
                )}
                {index < columnOrder.length - 1 && (
                  <Button variant='outlined' style={{marginLeft: '8px'}} onClick={() => moveColumnRight(index)}><EastIcon/></Button>
                )}
                </h2>
                <div style={{marginTop: '8px'}}>
                  {filteredTasks[columnName].map(task => (
                    <Task
                      key={task.id}
                      id={task.id}
                      taskName={task.name}
                      taskSprint={task.sprint}
                      taskTag={task.tag}
                      taskDueDate={task.dueDateTime}
                      sourceColumn={columnName}
                      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => openModal(task.id, e)}
                      draggable={true}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', String(task.id));
                        e.dataTransfer.setData('sourceColumn', columnName);
                      }}
                      onDeleteTask={deleteTask}
                    />
                  ))}
              </div>
              <div className='task-input-container' style={{marginBottom: '8px', marginTop: '8px'}}>
                {columnName === ColumnName.NEW && (
                  <TextField
                    type="text"
                    className="input-field"
                    value={newTaskName[columnName]}
                    onChange={(e) => handleNewTaskTextChange(columnName as ColumnName, e.target.value)}
                    placeholder="Enter task name"
                    fullWidth
                  />
                )}
              </div>
              {columnName === ColumnName.NEW && (
                <Button
                  variant='outlined'
                  className="create-task-button"
                  onClick={() => handleCreateNewTask(columnName as ColumnName)}>Create New Task
                </Button>
              )}
              <div style={{ marginTop: '8px'}}>
              <Button variant='outlined' 
                className="delete-column-button"
                onClick={() => handleDeleteColumn(columnName)}>Delete Column  
              </Button>
              </div>
            </div>
          ))}
          <div style={{marginBottom: '12px'}}>
            <TextField
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
              fullWidth
            />
            <Button variant='outlined'
              className="create-column-button"
              onClick={() => handleCreateNewColumn(null, selectedColumn!)}>Add New Column
            </Button>
          </div>
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              taskId={selectedTaskId || 0}
              taskName={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.name || '' : ''}
              taskDescription={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.description || '' : ''}
              comments={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.comments || [] : []}
              uploadedFiles={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.files || [] : []}
              dueDateTime={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.dueDateTime || dayjs() : dayjs()}
              taskSprint={selectedTaskId ? (tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.sprint || Sprint.Sprint1) : Sprint.Sprint1}
              taskTag={selectedTaskId ? tasks.New.concat(tasks.Committed, tasks.Done).find(task => task.id === selectedTaskId)?.tag || Tag.Tag1 : Tag.Tag1}
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
    </ThemeProvider>
  );
};

export default KanbanBoard;