import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedProjectName: string;
  editedProjectDescription: string;
  onProjectEdit: (name: string, description: string) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  editedProjectName: editedProjectName,
  editedProjectDescription: editedProjectDescription,
  onProjectEdit: onProjectEdit,
}) => {
  const [name, setName] = React.useState(editedProjectName);
  const [description, setDescription] = React.useState(editedProjectDescription);

  const handleSave = () => {
    onProjectEdit(name, description);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Projecte</DialogTitle>
      <DialogContent>
        <TextField
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectModal;
