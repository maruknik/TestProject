import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import { supabase } from '../supabaseClient';
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
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) setError(error.message);
    else setTasks(data || []);
    setLoading(false);
  };

  const handleTaskAdd = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    if (statuses.includes(over.id as Task['status']) && activeTask.status !== over.id) {
      const updatedTask = { ...activeTask, status: over.id as Task['status'] };

      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );

      const { error } = await supabase
        .from('tasks')
        .update({ status: updatedTask.status })
        .eq('id', updatedTask.id);

      if (error) {
        setError(error.message);
        fetchTasks();
      }
    }
  };

  if (!userId)
    return <Typography className="text-center mt-10">Будь ласка, увійдіть у систему.</Typography>;

  if (loading)
    return (
      <div className="flex justify-center items-center h-20">
        <CircularProgress />
      </div>
    );

  const tasksByStatus = statuses.reduce<Record<Task['status'], Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    { todo: [], in_progress: [], done: [] }
  );

  return (
    <>
      <div className="flex justify-start px-4 mt-6 mb-6">
        <button
          type="button"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors font-semibold select-none"
          onClick={() => setAddDialogOpen(true)}
        >
          Додати завдання
        </button>
      </div>

      {error && <p className="text-red-600 mb-4 font-semibold px-4">{error}</p>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-wrap gap-6 justify-between px-4">
          {statuses.map((status) => (
            <SortableContext
              key={status}
              items={tasksByStatus[status].map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 min-w-[300px] max-w-sm border border-gray-300 rounded-lg p-4 shadow-md bg-white">
                <TaskColumn
                  status={status}
                  tasks={tasksByStatus[status]}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="pointer-events-none">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTaskDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onTaskAdded={handleTaskAdd}
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
