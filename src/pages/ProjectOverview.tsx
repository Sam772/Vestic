import React, { useState } from 'react';
import './ProjectOverview.css';
import Task from '../components/Task'
import TaskModal from '../components/TaskModal';

interface Task {
  id: number;
  text: string;
}

interface Tasks {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

enum ColumnName {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
}

const initialTasks: Tasks = {
  todo: [],
  inProgress: [],
  done: [],
  // { id: 4, text: 'Task 4' },
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [columnOrder, setColumnOrder] = useState<ColumnName[]>([ColumnName.TODO, ColumnName.IN_PROGRESS, ColumnName.DONE]);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  
  const [newTaskTexts, setNewTaskTexts] = useState<{[key: string]: string}>({
    todo: '',
    inProgress: '',
    done: '',
  });

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
    if (text.trim() !== '') {
      const newTask: Task = {
        id: Date.now(),
        text: text,
      };
      setTasks(prevTasks => ({
        ...prevTasks,
        [columnName]: [...prevTasks[columnName], newTask],
      }));
      setNewTaskTexts(prevTexts => ({
        ...prevTexts,
        [columnName]: '',
      }));
    }
  };

  const handleTaskRename = (taskId: number, newTaskName: string) => {
    const updatedTasks = {
      ...tasks,
      todo: tasks.todo.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
      inProgress: tasks.inProgress.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
      done: tasks.done.map(task => task.id === taskId ? { ...task, text: newTaskName } : task),
    };
    setTasks(updatedTasks);
  };

  const moveTask = (taskId: number, sourceColumn: keyof Tasks, targetColumn: keyof Tasks) => {
  const sourceTasks = tasks[sourceColumn].filter(task => task.id !== taskId);
  const targetTask = tasks[sourceColumn].find(task => task.id === taskId);

  if (!targetTask) {
    return;
  }

  const targetTasks = [...tasks[targetColumn], targetTask];

  setTasks(prevTasks => ({
      ...prevTasks,
      [sourceColumn]: sourceTasks,
      [targetColumn]: targetTasks,
    }));
  };

  const deleteTask = (taskId: number) => {
    const updatedTasks: Tasks = { ...tasks };
    for (const column of [ColumnName.TODO, ColumnName.IN_PROGRESS, ColumnName.DONE]) {
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
    // Remove the column from the column order
    setColumnOrder(prevOrder => prevOrder.filter(col => col !== columnName));
  
    // Remove the tasks associated with the column
    setTasks(prevTasks => {
      const updatedTasks = { ...prevTasks };
      delete updatedTasks[columnName];
      return updatedTasks;
    });
  
    // Close any open modal if the task to be deleted is in the column being deleted
    if (selectedTaskId && tasks[columnName].find(task => task.id === selectedTaskId)) {
      closeModal();
    }
  };

  return (
    <div className="kanban-board">
      {columnOrder.map(columnName => (
        <div key={columnName} className="column">
          <h2>
            {selectedColumn === columnName ? (
              <div>
                <input
                  type="text"
                  value={columnName}
                  onChange={(e) => handleCreateNewColumn(columnName as ColumnName, e.target.value)}
                />
                <button onClick={() => setSelectedColumn(null)}>Save</button>
              </div>
            ) : (
              <span onClick={() => setSelectedColumn(columnName)}>{columnName}</span>
            )}
          </h2>
          {tasks[columnName].map(task => (
            <Task
              key={task.id}
              id={task.id}
              text={task.text}
              onClick={() => openModal(task.id)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('taskId', String(task.id));
                e.dataTransfer.setData('sourceColumn', columnName);
              }}
            />
          ))}
          <div>
            <input
              type="text"
              value={newTaskTexts[columnName]}
              onChange={(e) => handleNewTaskTextChange(columnName as ColumnName, e.target.value)}
              placeholder="Enter task name"
            />
            <button onClick={() => handleCreateNewTask(columnName as ColumnName)}>Create New Task</button>
            <button onClick={() => handleDeleteColumn(columnName)}>Delete Column</button>
          </div>
        </div>
      ))}
      <div>
        <input
          type="text"
          value={""}
          onChange={(e) => setSelectedColumn(e.target.value)}
          placeholder="Enter new column name"
        />
        <button onClick={() => handleCreateNewColumn(null, selectedColumn!)}>Add New Column</button>
      </div>
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          taskId={selectedTaskId!} // Pass the selected task ID to the modal
          taskName={selectedTaskId ? getTaskName(selectedTaskId) : ''}
          onClose={closeModal}
          onDelete={deleteTask}
          onSave={(newTaskName) => handleTaskRename(selectedTaskId!, newTaskName)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;