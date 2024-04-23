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
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import FileUploadButton from './FileUploadButton';
import Typography from '@mui/material/Typography';
import { upload } from '@testing-library/user-event/dist/upload';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface TaskModalProps {
  isOpen: boolean;
  taskId: number;
  taskName: string;
  taskDescription: string;
  comments: string[];
  dueDateTime: Dayjs | null;
  uploadedFiles: File[]
  taskSprint: Sprint | string;
  taskTag: Tag | string;
  onClose: () => void;
  onDelete: (taskId: number) => void;
  onSave: (
    taskId: number,
    newTaskName: string,
    newTaskDescription: string,
    comments: string[],
    dueDateTime: Dayjs,
    newUploadedFiles: File[],
    taskSprint: Sprint | string,
    taskTag: Tag | string) => void;
  onPostComment: (columnName: ColumnName) => void;
  newComment: Record<ColumnName, string>;
  onNewCommentChange: (columnName: ColumnName, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum Sprint {
  Sprint1 = 'Sprint 1',
  Sprint2 = 'Sprint 2',
  Sprint3 = 'Sprint 3',
}

export enum Tag {
  Tag1 = 'Feature',
  Tag2 = 'Bug',
  Tag3 = 'Epic',
  Tag4 = 'User Story'
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  taskId,
  taskName,
  taskDescription,
  comments: initialComments = [],
  dueDateTime,
  uploadedFiles,
  taskSprint,
  taskTag,
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

  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dueDateTime ? dayjs(dueDateTime) : null);

  const [currentUploadedFiles, setCurrentUploadedFiles] = useState<File[]>(uploadedFiles);

  const [currentTaskSprint, setCurrentTaskSprint] = useState<Sprint | string>(taskSprint);
  const [customSprint, setCustomSprint] = useState('');

  const [currentTaskTag, setCurrentTaskTag] = useState<Tag | string>(taskTag|| Tag.Tag1);
  const [customTag, setCustomTag] = useState('');


  const [availableSprints, setAvailableSprints] = useState<Sprint[]>(() => {
    const savedSprints = localStorage.getItem('customSprints');
    return savedSprints ? JSON.parse(savedSprints) : [Sprint.Sprint1, Sprint.Sprint2, Sprint.Sprint3];
  });
  
  useEffect(() => {
    localStorage.setItem('customSprints', JSON.stringify(availableSprints));
  }, [availableSprints]);

  const [availableTags, setAvailableTags] = useState<Tag[]>(() => {
    const savedTags = localStorage.getItem('customTags');
    return savedTags ? JSON.parse(savedTags) : [Tag.Tag1, Tag.Tag2, Tag.Tag3, Tag.Tag4];
  });
    
  useEffect(() => {
    localStorage.setItem('customTags', JSON.stringify(availableTags));
  }, [availableTags]);

  const handleSave = () => {
    console.log('Saving task...');
    // console.log('Due Date & Time:', selectedDateTime);
    //console.log('Due Time:', selectedTime);
    //console.log("File List: ", currentUploadedFiles);
    onSave(
      taskId,
      currentTaskName,
      currentTaskDescription,
      commentList,
      selectedDateTime ? dayjs(selectedDateTime.toDate()) : dayjs(),
      currentUploadedFiles,
      currentTaskSprint,
      currentTaskTag
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
    setSelectedDateTime(dueDateTime ? dayjs(dueDateTime) : null);
    //setCurrentTaskTag(taskTag);
    // console.log('Due Date & Time:', dueDateTime);
    //console.log('Due Time:', dueTime);
    //console.log('Task name:', currentTaskName);
    //console.log('Task description:', currentTaskDescription);
    //console.log('Comments:', commentList);
    // console.log("File List1: ", currentUploadedFiles);
    // console.log("File List2: ", uploadedFiles);
  }, [taskName, taskDescription, commentList, dueDateTime, uploadedFiles]);

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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setCurrentUploadedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleCustomSprintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSprint(e.target.value);
  };

  const handleAddCustomSprint = () => {
    if (customSprint.trim() !== '') {
      setAvailableSprints(prevSprints => [...prevSprints, customSprint as Sprint]);
      setCurrentTaskSprint(customSprint as Sprint);
      setCustomSprint('');
    }
  };

  const handleDeleteSprint = (sprint: Sprint) => {
    setAvailableSprints(prevSprints => prevSprints.filter(s => s !== sprint));
    setCurrentTaskSprint('');
  };

  const handleCustomTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTag(e.target.value);
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() !== '') {
      setAvailableTags(prevTags => [...prevTags, customTag as Tag]);
      setCurrentTaskTag(customTag as Tag);
      setCustomTag('');
    }
  };

  const handleDeleteTag = (tag: Tag) => {
    setAvailableTags(prevTags => prevTags.filter(t => t !== tag));
    setCurrentTaskTag('');
  };
  
  const handleTextFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
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
            <div style={{marginBottom: '8px', marginTop: '8px'}}>
              <div style={{marginBottom: '8px'}}>
                <strong>
                  <label htmlFor="taskName">Sprints</label>
                </strong>
              </div>
              <Select
                value={currentTaskSprint}
                onChange={(e) => setCurrentTaskSprint(e.target.value as Sprint)}
              >
                <MenuItem disabled value="">
                  Select Sprint
                </MenuItem>
                {availableSprints.map((sprint, index) => (
                  <MenuItem key={index} value={sprint}>
                    {sprint}
                    <Button
                      size="small"
                      onClick={() => handleDeleteSprint(sprint)}
                    >
                      <CloseIcon />
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </div>
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <TextField
                  value={customSprint}
                  onChange={handleCustomSprintChange}
                  onKeyDown={handleTextFieldKeyDown}
                  label="Custom Sprint"
                  variant="outlined"
                  size="small"
                />
                <Button variant='outlined' onClick={handleAddCustomSprint}>Confirm</Button>
              </div>
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <div style={{marginBottom: '8px'}}>
                  <strong>
                    <label htmlFor="taskName">Tags</label>
                  </strong>
                </div>
              <Select
                value={currentTaskTag}
                onChange={(e) => setCurrentTaskTag(e.target.value as Tag)}
              >
                <MenuItem disabled value="">
                  Select Tag
                </MenuItem>
                {availableTags.map((tag, index) => (
                  <MenuItem key={index} value={tag}>
                    {tag}
                    <Button
                      size="small"
                      onClick={() => handleDeleteTag(tag)}
                    >
                      <CloseIcon />
                    </Button>
                  </MenuItem>
                ))}
              </Select>
            </div>
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <TextField
                  value={customTag}
                  onChange={handleCustomTagChange}
                  onKeyDown={handleTextFieldKeyDown}
                  label="Custom Tag"
                  variant="outlined"
                  size="small"
                />
                <Button variant='outlined' onClick={handleAddCustomTag}>Confirm</Button>
              </div>
            <div className="date-time-container">
              <div style={{marginBottom: '8px', marginTop: '8px'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Select DateTime"
                    value={selectedDateTime ? dayjs(selectedDateTime) : null}
                    onChange={(date: Dayjs | null) => setSelectedDateTime(date ? dayjs(date.toDate()) : null)}
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
            <div className='comments-list'>
              {commentList.map((comment, index) => (
                <div key={index} className='comment-box' style={{marginBottom: '8px'}}>
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
