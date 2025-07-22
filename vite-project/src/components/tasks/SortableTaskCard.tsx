import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface SortableTaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,

  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        onClick={onClick}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
};

export default SortableTaskCard;
