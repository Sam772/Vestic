import React, { useEffect, useState } from 'react';
import './ProjectModal.css';

interface ProjectModalProps {
  isOpen: boolean;
  projectName: string;
  projectDescription: string;
  onClose: () => void;
  onProjectCreate: (projectName: string, projectDescription: string) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectName: initialProjectName,
  projectDescription: initialProjectDescription,
  onClose,
  onProjectCreate,
}) => {
  const [projectName, setProjectName] = useState(initialProjectName);
  const [projectDescription, setProjectDescription] = useState(initialProjectDescription);

  const handleCreate = () => {
    // Handle save logic here
    onProjectCreate(projectName, projectDescription);
    onClose();
  };

  useEffect(() => {
    setProjectName(initialProjectName);
    setProjectDescription(initialProjectDescription);
  }, [isOpen, initialProjectName, initialProjectDescription]);

  if (!isOpen) return null;

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="project-modal-header">
          <h2>Create Project</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="project-modal-body">
          <div className="form-group">
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectDescription">Project Description:</label>
            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="project-modal-footer">
        <button className="create-btn" onClick={handleCreate}>Create</button>
          <button className="exit-btn" onClick={onClose}>Exit</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
