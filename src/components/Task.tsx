import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';

interface TaskProps {
  id: number;
  text: string;
  sourceColumn: string; // Add sourceColumn prop
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void; // Add onClick prop
}

const Task: React.FC<TaskProps> = ({ id, text, sourceColumn, draggable = true, onDragStart, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id, sourceColumn }, // Include sourceColumn information
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      key={id}
      className="task"
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      ref={drag} // Add drag ref
    >
      {text}
    </div>
  );
};

export default Task;
