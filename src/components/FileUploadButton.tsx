import React from 'react';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import FileUploadIcon from '@mui/icons-material/FileUpload';

interface FileUploadButtonProps {
    onChange: (files: FileList | null) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onChange }) => {
  const handleFileUpload = (onChange: (files: FileList | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onChange(files);
    }
  };

  const handleFileButtonClick = () => {
    const fileUploadInput = document.getElementById('file-upload');
    if (fileUploadInput) {
      fileUploadInput.click();
    }
  };

  return (
    <React.Fragment>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileUpload(onChange)}
        multiple
        style={{ display: 'none' }}
      />
      <ButtonBase onClick={handleFileButtonClick} style={{ display: 'inline-flex' }}>
        <Button variant="outlined" startIcon={<FileUploadIcon />}>
          Choose Files
        </Button>
      </ButtonBase>
    </React.Fragment>
  );
};

export default FileUploadButton;
