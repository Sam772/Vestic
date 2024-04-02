import React, { useEffect, useState } from 'react';
import { ColumnName } from "../pages/ProjectOverview";
import './TaskModal.css';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTimePicker } from '@mui/lab';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  taskName: string;
  taskDescription: string;
  comments: string[];
  startDate: Date
  endDate: Date
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onSave: (taskId: number, newTaskName: string, newTaskDescription: string, comments: string[], startDate: Date, endDate: Date) => void;
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
  startDate,
  endDate,
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
    onSave(taskId, currentTaskName, currentTaskDescription, commentList, startDate, endDate);
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
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate) {
      setSelectedDate(dayjs(selectedDate));
    }
  }, [selectedDate]);

  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleOpenCalendar = () => {
    console.log("Opening calendar...");
    console.log("openCalendar state:", openCalendar); // Log the current state before updating
    setOpenCalendar(true);
    console.log("openCalendar state after update:", openCalendar); // Log the state after updating
  };
  
  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };
  
  const handleTimeChange = (time: Date | null) => {
    setSelectedTime(time);
  };

  if (!isOpen) return null;
  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <h2>Edit Task</h2>
          <Button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>
        <div className="form-container">
          <div className="form-group">
            <strong>
              <label htmlFor="taskName">Name</label>
            </strong>
            <TextField
              type="text"
              id="taskName"
              value={currentTaskName}
              onChange={(e) => setCurrentTaskName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
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
              fullWidth
              size="small"
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
              fullWidth
              variant="outlined"
              size="small"
            />
          </div>
            <div style={{marginBottom: '8px', marginTop: '8px'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={handleDateChange}
                  onClose={handleCloseCalendar}
                  //renderInput={(params: TextFieldProps) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
            <div style={{marginBottom: '8px', marginTop: '8px'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Select Time"
                  value={selectedTime ? dayjs(selectedTime) : null}
                  //onChange={handleTimeChange}
                  onClose={handleCloseCalendar}
                  //renderInput={(params: TextFieldProps) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </div>
          <div>
            <Button variant='outlined' className='post-btn' onClick={handlePostComment}>
              Save
            </Button>
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
                    fullWidth
                    size="small"
                  />
                </div>
              ))}
            </div>
        </div>
        <div className="button-container">
          <Button variant='outlined' className="save-btn" onClick={handleSave}>
            Save
          </Button>
          <Button variant='outlined' className="delete-btn" onClick={() => onDelete(taskId)}>
            Delete Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
