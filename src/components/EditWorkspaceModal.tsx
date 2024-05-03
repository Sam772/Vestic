import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

interface EditWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedWorkspaceName: string;
  editedWorkspaceDescription: string;
  onWorkspaceEdit: (name: string, description: string) => void;
}

const EditWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  isOpen,
  onClose,
  editedWorkspaceName,
  editedWorkspaceDescription,
  onWorkspaceEdit,
}) => {
  const [name, setName] = React.useState(editedWorkspaceName);
  const [description, setDescription] = React.useState(editedWorkspaceDescription);

  const handleSave = () => {
    onWorkspaceEdit(name, description);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Workspace</DialogTitle>
      <DialogContent>
        <TextField
          label="Workspace Name"
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

export default EditWorkspaceModal;
