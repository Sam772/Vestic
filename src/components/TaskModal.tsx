import React from 'react';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({isOpen, taskId, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Task Details</h2>
        <p>Task ID: {taskId}</p>
        <p>This is a placeholder for task details.</p>
      </div>
    </div>
  );
};

export default TaskModal;
