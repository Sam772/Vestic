import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { Sprint } from './TaskModal';
import dayjs, { Dayjs } from 'dayjs';

interface TaskProps {
  id: number;
  taskName: string;
  taskSprint: Sprint | string;
  taskDueDate: Dayjs;
  sourceColumn: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onClick?: () => void;
}

const Task: React.FC<TaskProps> = ({ id, taskName, taskSprint, taskDueDate, sourceColumn, draggable = true, onDragStart, onClick }) => {
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
      <div>{taskName}</div>
      <div>Iteration Path: {taskSprint}</div>
      <div>State: {sourceColumn}</div>
      <div>Due Date: {taskDueDate.format('YYYY-MM-DD')}</div>
    </div>
  );
};

export default Task;
