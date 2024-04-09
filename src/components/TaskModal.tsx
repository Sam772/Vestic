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
import FileUploadButton from './FileUploadButton';
import Typography from '@mui/material/Typography';
import { upload } from '@testing-library/user-event/dist/upload';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  taskName: string;
  taskDescription: string;
  comments: string[];
  dueDate: Dayjs;
  dueTime: Dayjs;
  uploadedFiles: File[]
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onSave: (taskId: number, newTaskName: string, newTaskDescription: string, comments: string[], dueDate: Date, dueTime: Date, newUploadedFiles: File[]) => void;
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
  dueDate,
  dueTime,
  uploadedFiles,
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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dueDate ? dayjs(dueDate) : null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dueTime ? dayjs(dueTime) : null);
  const [currentUploadedFiles, setCurrentUploadedFiles] = useState<File[]>(uploadedFiles);

  const handleSave = () => {
    console.log('Saving task...');
    console.log('Due Date:', selectedDate);
    console.log('Due Time:', selectedTime);
    //console.log("File List: ", currentUploadedFiles);
    onSave(
      taskId,
      currentTaskName,
      currentTaskDescription,
      commentList,
      selectedDate?.toDate() || new Date(),
      selectedTime?.toDate() || new Date(),
      currentUploadedFiles
    );
    onClose();
  };

  const handlePostComment = () => {
    if (commentInput.trim() !== '') {
      const updatedCommentList = [...commentList, commentInput];
      setCommentList(updatedCommentList);
      setComments(updatedCommentList);
      setCommentInput('');
    }
  };
  
  const handleNewCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  useEffect(() => {
    setCurrentTaskName(taskName);
    setCurrentTaskDescription(taskDescription);
    setCurrentUploadedFiles(uploadedFiles);
    //console.log('Task name:', currentTaskName);
    //console.log('Task description:', currentTaskDescription);
    //console.log('Comments:', commentList);
    // console.log("File List1: ", currentUploadedFiles);
    // console.log("File List2: ", uploadedFiles);
  }, [taskName, taskDescription, commentList, uploadedFiles]);

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

  useEffect(() => {
    setSelectedDate(dueDate ? dayjs(dueDate) : null);
    setSelectedTime(dueTime ? dayjs(dueTime) : null);
  }, [dueDate, dueTime]);

  useEffect(() => {
    //console.log('Initial selectedDate:', selectedDate);
    //console.log('Initial selectedTime:', selectedTime);
  }, []);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setCurrentUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
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
        <div className="scroll-container">
          <div className="form-container">
            <div className="form-group">
              <div style={{marginBottom: '8px'}}>
                <strong>
                  <label htmlFor="taskName">Name</label>
                </strong>
              </div>
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
              <div style={{marginBottom: '8px'}}>
                <strong>
                  <label htmlFor="taskDescription">Description</label>
                </strong>
              </div>
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
            <div className="date-time-container">
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate ? dayjs(selectedDate) : null}
                    onChange={(date: Dayjs | null) => setSelectedDate(date ? dayjs(date.toDate()) : null)}
                  />
                </LocalizationProvider>
              </div>
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Select Time"
                    value={selectedTime ? dayjs(selectedTime) : null}
                    onChange={(time: Dayjs | null) => setSelectedTime(time ? dayjs(time.toDate()) : null)}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <strong>
              <label htmlFor="files">File Upload</label>
            </strong>
            <FileUploadButton onChange={handleFileUpload} />
            <div style={{marginBottom: '8px', marginTop: '8px'}}>
              <strong>
                <label htmlFor="files">Uploaded Files</label>
              </strong>
              {currentUploadedFiles.map((file, index) => (
                <div key={index} style={{marginTop: '2px'}}>
                  <a href={URL.createObjectURL(file)} download={file.name}>
                    <Typography color="text.primary" variant="body2">
                      {file.name}
                    </Typography>
                  </a>
                </div>
              ))}
            </div>
            <strong style={{marginBottom: '8px', marginTop: '8px'}}>
              <label htmlFor="comments">Activity</label>
            </strong>
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
            <div style={{marginBottom: '8px', marginTop: '16px'}}>
              <Button variant='outlined' className='post-btn' onClick={handlePostComment}>
                Save
              </Button>
            </div>
            <div className="comments-preview" >
              <strong>Activity</strong>
            </div>
            <div className='comments-list'>
                {commentList.map((comment, index) => (
                  <div key={index} className='comment-box' style={{marginBottom: '8px', marginTop: '8px'}}>
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
          <div>
            <Button variant='outlined' className="save-btn" onClick={handleSave}>
              Save Details
            </Button>
            <Button variant='outlined' className="delete-btn" onClick={() => onDelete(taskId)}>
              Delete Task
            </Button>
          </div>
          <br/>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
