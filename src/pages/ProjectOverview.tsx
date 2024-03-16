import React, { useState, useEffect } from 'react';
import './ProjectOverview.css';
import Task from '../components/Task'
import TaskModal from '../components/TaskModal';
import { useDrop } from 'react-dnd';

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

// Represents the page content
const KanbanBoard: React.FC = () => {

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
  

  const moveTask = (taskId: number, sourceColumn: keyof Tasks, targetColumn: keyof Tasks) => {
    const taskIndex = tasks[sourceColumn].findIndex(task => task.id === taskId);

    console.log(tasks[targetColumn]);
  
    if (taskIndex === -1) {
      return;
    }
  
    const taskToMove = tasks[sourceColumn][taskIndex];
  
    const updatedSourceTasks = tasks[sourceColumn].filter(task => task.id !== taskId);
  
    const updatedTargetTasks = [...tasks[targetColumn], taskToMove];

    console.log(tasks[targetColumn]);
  
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

  // Allows dropping and dragging of tasks
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: number; sourceColumn: ColumnName }, monitor) => {
      const sourceColumn = item.sourceColumn;
      moveTask(item.id, sourceColumn, selectedColumn as keyof Tasks);
    },
  });

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
    <div ref={drop} className="kanban-board">
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
        <div key={columnName} className="column" style={{ maxHeight: `${calculateColumnHeight(columnName)}px` }}>
          <h2>
            {selectedColumn === columnName ? (
              <div className="column">
                <input
                  type="text"
                  className="input-field"
                  value={columnName}
                  onChange={(e) => handleCreateNewColumn(columnName as ColumnName, e.target.value)}
                />
                <button onClick={() => setSelectedColumn(null)}>Save</button>
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
          value={""}
          onChange={(e) => setSelectedColumn(e.target.value)}
          placeholder="Enter new column name"
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
  );
};

export default KanbanBoard;