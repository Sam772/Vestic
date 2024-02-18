import React from 'react';
import './TaskModal.css';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  onClose: () => void;
  onDelete: (taskId: number) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, taskId, onClose, onDelete }) => {
  if (!isOpen) return null;
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Task Details</h2>
        <h3>Task ID: {taskId}</h3>
        <p>This is a placeholder for task details.</p>
        <button onClick={() => onDelete(taskId)}>Delete Task</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;