import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import AddTaskDialog from '../components/tasks/AddTaskDialog';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskDetailsDialog from '../components/tasks/TaskDetailsDialog';
import type { Task } from '../types/task';
import TaskCard from '../components/tasks/TaskCard';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  fetchTasksByUser,
  updateTaskIndicesInDb,
  addTask,
  updateTaskStatusAndIndex,
} from '../service/taskService';

interface TasksProps {
  userId: string | null;
}

const statuses: Task['status'][] = ['todo', 'in_progress', 'done'];

const Tasks: React.FC<TasksProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasksByUser(userId!);
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'index'>) => {
    try {
      const tasksInStatus = tasks.filter(t => t.status === taskData.status);
      const maxIndex = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.index)) : -1;
      const newTaskWithIndex = { ...taskData, index: maxIndex + 1, user_id: userId! };

      const newTask = await addTask(newTaskWithIndex);
      setTasks(prev => [...prev, newTask]);
      setAddDialogOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;

    const overTask = tasks.find(t => t.id === over.id);
    const overStatus = (overTask ? overTask.status : over.id) as Task['status'];

    try {
      if (draggedTask.status !== overStatus) {
        // Переходимо в інший статус
        const newStatusTasks = tasks
          .filter(t => t.status === overStatus)
          .sort((a, b) => a.index - b.index);

        const newIndex = newStatusTasks.length;

        const updatedDraggedTask = { ...draggedTask, status: overStatus, index: newIndex };

        const oldStatusTasks = tasks
          .filter(t => t.status === draggedTask.status && t.id !== draggedTask.id)
          .sort((a, b) => a.index - b.index)
          .map((t, i) => ({ ...t, index: i }));

        setTasks(prev => {
          const otherTasks = prev.filter(t => t.id !== draggedTask.id);

          return [
            ...otherTasks.filter(t => t.status !== draggedTask.status && t.status !== overStatus),
            ...oldStatusTasks,
            updatedDraggedTask,
            ...newStatusTasks,
          ].sort((a, b) => {
            if (a.status === b.status) return a.index - b.index;
            return statuses.indexOf(a.status) - statuses.indexOf(b.status);
          });
        });

        await updateTaskStatusAndIndex(updatedDraggedTask.id, updatedDraggedTask.status, updatedDraggedTask.index);
        await updateTaskIndicesInDb(oldStatusTasks);

        return;
      }

      if (draggedTask.status === overStatus) {
        const statusTasks = tasks
          .filter(t => t.status === draggedTask.status && t.id !== draggedTask.id)
          .sort((a, b) => a.index - b.index);

        const overTaskIndex = statusTasks.findIndex(t => t.id === over.id);
        if (overTaskIndex === -1) return;

        const newStatusTasks = [
          ...statusTasks.slice(0, overTaskIndex),
          draggedTask,
          ...statusTasks.slice(overTaskIndex),
        ].map((t, i) => ({ ...t, index: i }));

        setTasks(prev =>
          prev
            .filter(t => t.status !== draggedTask.status)
            .concat(newStatusTasks)
            .sort((a, b) => {
              if (a.status === b.status) return a.index - b.index;
              return statuses.indexOf(a.status) - statuses.indexOf(b.status);
            }),
        );

        await updateTaskIndicesInDb(newStatusTasks);

        return;
      }
    } catch (err: any) {
      setError(err.message);
      await fetchTasks();
    }
  };

  if (!userId)
    return (
      <Typography className="text-center mt-10 text-gray-700 text-lg font-medium select-none">
        Будь ласка, увійдіть у систему.
      </Typography>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-20">
        <CircularProgress />
      </div>
    );

  const tasksByStatus = statuses.reduce<Record<Task['status'], Task[]>>(
    (acc, status) => {
      acc[status] = tasks
        .filter(task => task.status === status)
        .sort((a, b) => a.index - b.index);
      return acc;
    },
    { todo: [], in_progress: [], done: [] }
  );

  return (
    <>
      <div className="flex justify-start px-4 mt-6 mb-6">
        <button
          type="button"
          className="
            px-6 py-3
            bg-gradient-to-r from-green-400 via-green-500 to-green-600
            text-white rounded-xl
            shadow-lg hover:shadow-xl
            hover:from-green-500 hover:via-green-600 hover:to-green-700
            active:scale-95 transition-transform duration-150
            focus:outline-none focus:ring-4 focus:ring-green-300
            font-semibold select-none
          "
          onClick={() => setAddDialogOpen(true)}
        >
          Додати завдання
        </button>
      </div>

      {error && (
        <p className="text-red-600 mb-4 font-semibold px-4 select-none">{error}</p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap gap-4 justify-between px-4">
          {statuses.map(status => (
            <SortableContext
              key={status}
              items={tasksByStatus[status].map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <section
                className="
                  flex-1 min-w-[320px] max-w-md
                  rounded-3xl p-6
                  bg-white
                  border border-gray-200
                  shadow-lg
                  hover:shadow-2xl
                  transition-shadow duration-300
                  flex flex-col
                "
                id={status}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  className="mb-6 text-gray-800 font-bold text-center select-none tracking-wide"
                >
                  {status === 'todo' && 'Заплановані'}
                  {status === 'in_progress' && 'В процесі'}
                  {status === 'done' && 'Завершені'}
                </Typography>

                <TaskColumn
                  status={status}
                  tasks={tasksByStatus[status]}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskClick={handleTaskClick}
                />
              </section>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="pointer-events-none scale-105 shadow-2xl rounded-2xl">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onTaskAdded={handleAddTask}
        userId={userId!}
      />

      <TaskDetailsDialog
        open={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={handleTaskUpdate}
      />
    </>
  );
};

export default Tasks;
