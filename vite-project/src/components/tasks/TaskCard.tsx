import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { GripVertical } from 'lucide-react';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  dragAttributes?: React.HTMLAttributes<HTMLElement>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  dragListeners,
  dragAttributes,
}) => {
  return (
    <Card
      variant="outlined"
      sx={{ mb: 1, cursor: 'pointer' }}
      onClick={() => onClick(task)}
    >
      <CardContent className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <Typography variant="h6" component="div" noWrap>
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {task.description}
            </Typography>
          )}
        </div>

     
        <div
          {...dragAttributes}
          {...dragListeners}
          role="button"
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor: 'grab', display: 'inline-flex' }}
          aria-label="Перетягнути"
        >
          <GripVertical size={18} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
