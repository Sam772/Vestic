import React, { useState } from 'react';
import './KanbanBoard.css';
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

const initialTasks: Tasks = {
  todo: [],
  inProgress: [],
  done: [],
  // { id: 4, text: 'Task 4' },
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);
  const [newTaskText, setNewTaskText] = useState<string>('');

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  };

  const moveTask = (taskId: number, sourceColumn: keyof Tasks, targetColumn: keyof Tasks) => {
  const sourceTasks = tasks[sourceColumn].filter(task => task.id !== taskId);
  const targetTask = tasks[sourceColumn].find(task => task.id === taskId);

  if (!targetTask) {
    return; // handle the case where the task is not found
  }

  const targetTasks = [...tasks[targetColumn], targetTask];

  setTasks(prevTasks => ({
      ...prevTasks,
      [sourceColumn]: sourceTasks,
      [targetColumn]: targetTasks,
    }));
  };

  const handleCreateNewTask = () => {
    if (newTaskText.trim() !== '') {
      const newTask: Task = {
        id: Date.now(), // Generating a unique id for the new task
        text: newTaskText,
      };
      setTasks(prevTasks => ({
        ...prevTasks,
        todo: [...prevTasks.todo, newTask],
      }));
      setNewTaskText(''); // Clearing the input field after creating the new task
    }
  };

  return (
    <div className="kanban-board">
      <div className="column" onDrop={(e) => {
        e.preventDefault();
        const taskId = +e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn') as keyof Tasks;
        moveTask(taskId, sourceColumn, 'todo');
      }}
        onDragOver={(e) => e.preventDefault()}>
        <h2>Todo</h2>
        {tasks.todo.map(task => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            onClick={() => openModal(task.id)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'todo');
            }}
          />
        ))}
        <div>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter task name"
          />
          <button onClick={handleCreateNewTask}>Create New Task</button>
        </div>
      </div>

      <div className="column" onDrop={(e) => {
        e.preventDefault();
        const taskId = +e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn') as keyof Tasks;
        moveTask(taskId, sourceColumn, 'inProgress');
      }}
        onDragOver={(e) => e.preventDefault()}>
        <h2>In Progress</h2>
        {tasks.inProgress.map(task => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            onClick={() => openModal(task.id)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'inProgress');
            }}
          />
        ))}
      </div>

      <div className="column" onDrop={(e) => {
        e.preventDefault();
        const taskId = +e.dataTransfer.getData('taskId');
        const sourceColumn = e.dataTransfer.getData('sourceColumn') as keyof Tasks;
        moveTask(taskId, sourceColumn, 'done');
      }}
        onDragOver={(e) => e.preventDefault()}>
        <h2>Done</h2>
        {tasks.done.map(task => (
          <Task
            key={task.id}
            id={task.id}
            text={task.text}
            onClick={() => openModal(task.id)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'done');
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          taskId={selectedTaskId!} // Pass the selected task ID to the modal
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default KanbanBoard;