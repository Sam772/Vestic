import React, { useEffect, useState } from 'react';
import { ColumnName } from "../pages/ProjectOverview";
import './TaskModal.css';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { Button, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

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
          <Button className="close-btn" onClick={onClose}>
            <CloseIcon></CloseIcon>
          </Button>
        </div>
        <div className="">
          <div className="form-group">
            <label htmlFor="taskName">Task Name:</label>
            <TextField
              type="text"
              id="taskName"
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="taskDescription">Task Description:</label>
            <TextField
              multiline
              rows={4}
              variant='outlined'
              id="taskDescription"
              value={currentTaskDescription}
              onChange={(e) => setCurrentTaskDescription(e.target.value)}
              style={{
                width: '100%',
                fontSize: '16px',
                marginBottom: '6px'
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="comments">Comments:</label>
            <br/>
            <TextField
              type="text"
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          <Button variant='outlined' className='post-btn' onClick={handlePostComment}>Save</Button>
          <div className="comments-preview">
            <strong>Comments:</strong>
          </div>
          <div className='comments-list'>
              {commentList.map((comment, index) => (
                <div key={index} className='comment-box'>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    defaultValue={comment}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              ))}
            </div>
        </div>
        <div className="task-modal-footer">
          <Button variant='outlined' className="save-btn" onClick={handleSave}>Save</Button>
          <Button variant='outlined' className="delete-btn" onClick={() => onDelete(taskId)}>Delete Task</Button>
          {/* <button className="exit-btn" onClick={onClose}>Exit</button> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
