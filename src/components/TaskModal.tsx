import React, { useEffect, useState } from 'react';
import { ColumnName } from "../pages/ProjectOverview";
import './TaskModal.css';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  taskName: string;
  taskDescription: string;
  comments: string[];
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onSave: (taskId: number, newTaskName: string, newTaskDescription: string, comments: string[]) => void;
  onPostComment: (columnName: ColumnName) => void;
  newComment: Record<ColumnName, string>;
  onNewCommentChange: (columnName: ColumnName, e: React.ChangeEvent<HTMLInputElement>) => void;
}


const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskId,
  taskName,
  taskDescription,
  onClose,
  onDelete,
  onSave,
}) => {
  const [currentTaskName, setCurrentTaskName] = useState(taskName);
  const [currentTaskDescription, setCurrentTaskDescription] = useState(taskDescription);
  const [comments, setComments] = useState('');
  const [commentList, setCommentList] = useState<string[]>([]);

  const handleSave = () => {
    onSave(taskId, currentTaskName, currentTaskDescription, [comments]);
    onClose();
  };

  const handlePostComment = () => {
    if (comments.trim() !== '') {
      setCommentList(prevComments => [...prevComments, comments]);
      setComments('');
    }
  };

  useEffect(() => {
    setCurrentTaskName(taskName);
    setCurrentTaskDescription(taskDescription);
  }, [taskName, taskDescription]);

  if (!isOpen) return null;
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="task-modal-body">
          <div className="form-group">
            <label htmlFor="taskName">Task Name:</label>
            <input
              type="text"
              id="taskName"
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskDescription">Task Description:</label>
            <textarea
              id="taskDescription"
              value={currentTaskDescription}
              onChange={(e) => setCurrentTaskDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments:</label>
            <input
              type="text"
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <button className='post-btn' onClick={handlePostComment}>Post</button>
          </div>
          <div className="comments-preview">
            <strong>Comments:</strong>
          </div>
          <ul className='comments-list'>
              {commentList.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>
        </div>
        <div className="task-modal-footer">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="delete-btn" onClick={() => onDelete(taskId)}>Delete Task</button>
          {/* <button className="exit-btn" onClick={onClose}>Exit</button> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
