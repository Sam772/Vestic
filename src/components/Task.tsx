import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';

interface TaskProps {
  id: number;
  text: string;
  sourceColumn: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

const Task: React.FC<TaskProps> = ({ id, text, sourceColumn, draggable = true, onDragStart, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { type: 'TASK', id, sourceColumn },
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
      ref={drag}
    >
      {text}
    </div>
  );
};

export default Task;
