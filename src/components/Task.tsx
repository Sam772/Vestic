import React from 'react';

interface TaskProps {
  id: number;
  text: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void; // Add onClick prop
}

const Task: React.FC<TaskProps> = ({ id, text, draggable = true, onDragStart, onClick }) => {
  return (
    <div
      key={id}
      className="task"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Task;