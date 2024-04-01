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
  comments: initialComments = [],
  onClose,
  onDelete,
  onSave,
}) => {
  const [currentTaskName, setCurrentTaskName] = useState(taskName);
  const [currentTaskDescription, setCurrentTaskDescription] = useState(taskDescription);
  const [comments, setComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentList, setCommentList] = useState<string[]>([]); // Initialize with initial comments
  const [initialized, setInitialized] = useState(false);

  const handleSave = () => {
    console.log('Saving task...');
    console.log('comments: ', comments);
    onSave(taskId, currentTaskName, currentTaskDescription, commentList);
    onClose();
  };

  const handlePostComment = () => {
    if (commentInput.trim() !== '') {
      const updatedCommentList = [...commentList, commentInput];
      setCommentList(updatedCommentList);
      setComments(updatedCommentList); // Update the comments state
      setCommentInput('');
    }
  };
  
  
  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  useEffect(() => {
    setCurrentTaskName(taskName);
    setCurrentTaskDescription(taskDescription);
    console.log('Task name:', currentTaskName);
    console.log('Task description:', currentTaskDescription);
    console.log('Comments:', commentList);
  }, [taskName, taskDescription, commentList]);

  useEffect(() => {
    if (!initialized) {
      setCommentList(initialComments);
      setInitialized(true);
    }
  }, [initialized, initialComments]);
  
  useEffect(() => {
    if (initialComments.length > 0) {
      setCommentList(initialComments);
    }
  }, [initialComments]);
  

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
            <strong>
              <label htmlFor="taskName">Name</label>
            </strong>
            <TextField
              type="text"
              id="taskName"
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
              style={{
                width: '100%',
                fontSize: '16px',
                marginBottom: '6px'
              }}
            />
          </div>
          <div className="form-group">
            <strong>
              <label htmlFor="taskDescription">Description</label>
            </strong>
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
            <strong>
              <label htmlFor="comments">Activity</label>
            </strong>
            <br/>
            <TextField
              multiline
              rows={2}
              type="text"
              id="comments"
              placeholder='Write a comment...'
              value={commentInput}
              onChange={handleNewCommentChange}
              style={{
                width: '100%',
                fontSize: '16px',
                marginBottom: '6px'
              }}
            />
          </div>
          <div>
            <Button variant='outlined' className='post-btn' onClick={handlePostComment}>Save</Button>
          </div>
          <div className="comments-preview">
            <strong>Activity</strong>
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
                    style={{
                      width: '100%',
                      fontSize: '16px',
                      marginBottom: '6px'
                    }}
                  />
                </div>
              ))}
            </div>
        </div>
        <div>
          <Button variant='outlined' className="save-btn" onClick={handleSave}>Save</Button>
          <Button variant='outlined' className="delete-btn" onClick={() => onDelete(taskId)}>Delete Task</Button>
          {/* <button className="exit-btn" onClick={onClose}>Exit</button> */}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
