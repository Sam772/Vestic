import React, { useState } from 'react';
import './ProjectOverview.css';
import Task from '../components/Task'
import TaskModal from '../components/TaskModal';
import { useDrop } from 'react-dnd';

interface Task {
  id: number;
  text: string;
  description: string;
}

interface Tasks {
  New: Task[];
  Committed: Task[];
  Done: Task[];
}

enum ColumnName {
  NEW = 'New',
  COMMITTED = 'Committed',
  DONE = 'Done',
}

const initialTasks: Tasks = {
  New: [],
  Committed: [],
  Done: [],
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [columnOrder, setColumnOrder] = useState<ColumnName[]>([ColumnName.NEW, ColumnName.COMMITTED, ColumnName.DONE]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  const [newTaskTexts, setNewTaskTexts] = useState<{[key: string]: string}>({
    todo: '',
    inProgress: '',
    done: '',
  });

  const [newTaskDescriptions, setNewTaskDescriptions] = useState<Record<ColumnName, string>>({
    "New" : '',
    "Committed" : '',
    "Done" : '',
  });
  

  const [filterText, setFilterText] = useState<string>('');

  const filteredTasks = Object.keys(tasks).reduce((filtered, columnName) => {
    filtered[columnName as keyof Tasks] = tasks[columnName as keyof Tasks].filter(task => task.text.toLowerCase().includes(filterText.toLowerCase()));
    return filtered;
  }, {} as Partial<Tasks>) as Tasks;
  

  const openModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  };

  const handleNewTaskTextChange = (columnName: ColumnName, newText: string) => {
    setNewTaskTexts(prevTexts => ({
      ...prevTexts,
      [columnName]: newText,
    }));
  };

  const handleCreateNewTask = (columnName: ColumnName) => {
    const text = newTaskTexts[columnName];
    const description = newTaskDescriptions[columnName];
  
    if (text.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: text,
        description: description,
      };
      setTasks(prevTasks => ({
        ...prevTasks,
        [columnName]: [...prevTasks[columnName], newTask],
      }));
      setNewTaskTexts(prevTexts => ({
        ...prevTexts,
        [columnName]: '',
      }));
      setNewTaskDescriptions(prevDescriptions => ({
        ...prevDescriptions,
        [columnName]: '',
      }));
    }
  };

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
  
  
    

  const deleteTask = (taskId: number) => {
    const updatedTasks: Tasks = { ...tasks };
    for (const column of [ColumnName.NEW, ColumnName.COMMITTED, ColumnName.DONE]) {
      updatedTasks[column] = updatedTasks[column].filter(task => task.id !== taskId);
    }
    setTasks(updatedTasks);
    closeModal();
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

  const handleSaveTask = (taskId: number, newTaskName: string, newTaskDescription: string) => {
    const updatedTasks = {
      ...tasks,
      todo: tasks.New.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
      inProgress: tasks.Committed.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
      done: tasks.Done.map(task => task.id === taskId ? { ...task, text: newTaskName, description: newTaskDescription } : task),
    };
    setTasks(updatedTasks);
    closeModal();
  };

  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: number; sourceColumn: ColumnName }, monitor) => {
      const sourceColumn = item.sourceColumn;
      moveTask(item.id, sourceColumn, selectedColumn as keyof Tasks);
    },
  });

  return (
    <div ref={drop} className="kanban-board">
      <input
        type="text"
        className="filter-box"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        placeholder="Filter tasks by name"
      />
      {columnOrder.map(columnName => (
        <div key={columnName} className="column">
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
        onClose={closeModal}
        onDelete={deleteTask}
        onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;