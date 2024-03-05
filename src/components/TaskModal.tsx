import React, { useEffect, useState } from 'react';
import './TaskModal.css';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  taskName: string;
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onSave: (newTaskName: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, taskId, taskName, onClose, onDelete, onSave }) => {
  const [currentTaskName, setCurrentTaskName] = useState(taskName);

  const handleSave = () => {
    onSave(currentTaskName);
    onClose();
  };

  useEffect(() => {
    setCurrentTaskName(taskName);
  }, [taskName]);
  
  if (!isOpen) return null;
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <label htmlFor="taskName"></label>
        <input
          type="text"
          id="taskName"
          value={currentTaskName}
          onChange={(e) => setCurrentTaskName(e.target.value)}
        />
        <h3>Task ID: {taskId}</h3>
        <h2>Task Details</h2>
        <p>This is a placeholder for task details.</p>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => onDelete(taskId)}>Delete Task</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;