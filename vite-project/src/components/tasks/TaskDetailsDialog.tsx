import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { supabase } from '../../supabaseClient';
import TaskFormFields from './TaskFormFields';
import type { Task } from '../../types/task';
import { taskValidationSchema } from './taskValidationSchema';

interface TaskFormValues {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  submit?: string;
}

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
}

const TaskDetailsDialog: React.FC<Props> = ({ open, task, onClose, onTaskUpdated }) => {
  const formik = useFormik<TaskFormValues>({
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      submit: '', 
    },
    enableReinitialize: true,
    validationSchema: taskValidationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (!task) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: values.title,
            description: values.description,
            status: values.status,
          })
          .eq('id', task.id)
          .select()
          .single();

        if (error) throw error;

        if (data) {
          onTaskUpdated(data);
          onClose();
        }
      } catch (err: any) {
        setErrors({ submit: err.message || 'Помилка при оновленні' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Перегляд / Редагування задачі</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <TaskFormFields formik={formik} />
          {formik.errors.submit && (
            <Typography color="error" mt={2}>
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрити</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            Зберегти
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDetailsDialog;
