import React, { useState } from 'react';

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
  todo: [
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
  ],
  inProgress: [
    { id: 3, text: 'Task 3' },
  ],
  done: [
    { id: 4, text: 'Task 4' },
  ],
};

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Tasks>(initialTasks);

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
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'todo');
            }}
          >
            {task.text}
          </div>
        ))}
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
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'inProgress');
            }}
          >
            {task.text}
          </div>
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
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('taskId', String(task.id));
              e.dataTransfer.setData('sourceColumn', 'done');
            }}
          >
            {task.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;