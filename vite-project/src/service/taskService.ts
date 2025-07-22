import { supabase } from '../supabaseClient';
import type { Task } from '../types/task';

export const fetchTasksByUser = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('status', { ascending: true })
    .order('index', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
};

export const updateTaskIndicesInDb = async (tasksToUpdate: Task[]): Promise<void> => {
  for (const task of tasksToUpdate) {
    const { error } = await supabase
      .from('tasks')
      .update({ index: task.index })
      .eq('id', task.id);
    if (error) throw new Error(error.message);
  }
};

export const addTask = async (
  taskData: Omit<Task, 'id' | 'created_at' | 'index'>
): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([taskData])
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Помилка при додаванні завдання');

  return data;
};

export const updateTaskStatusAndIndex = async (
  taskId: string,
  status: Task['status'],
  index: number
): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .update({ status, index })
    .eq('id', taskId);

  if (error) throw new Error(error.message);
};
