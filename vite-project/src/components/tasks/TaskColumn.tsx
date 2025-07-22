import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../../types/task';
import SortableTaskCard from './SortableTaskCard';

interface TaskColumnProps {
  status: Task['status'];
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskClick: (task: Task) => void;
}

const statusLabels: Record<Task['status'], string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  tasks,
  onTaskUpdate,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-white rounded-xl p-4 min-h-[480px] shadow-sm border transition-colors duration-300 ${
        isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'
      }`}
    >
      <h2 className="text-lg font-semibold mb-4 select-none">{statusLabels[status]}</h2>
      <div className="flex-grow overflow-y-auto space-y-1">
        {tasks.length === 0 ? (
          <p className="text-gray-400 italic select-none">Немає задач</p>
        ) : (
          tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
