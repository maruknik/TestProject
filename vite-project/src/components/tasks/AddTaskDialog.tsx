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
  status: Task['status'];
  submit?: string;
}

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  userId: string;
}

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
};

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onTaskAdded, userId }) => {
  const formik = useFormik<TaskFormValues>({
    initialValues,
    validationSchema: taskValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      if (!userId) {
        setErrors({ submit: 'Користувач не авторизований' });
        setSubmitting(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert([
            {
              user_id: userId,
              title: values.title,
              description: values.description,
              status: values.status,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          onTaskAdded(data);
          resetForm();
          onClose();
        }
      } catch (error: any) {
        setErrors({ submit: error.message || 'Сталася помилка при додаванні задачі' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Додати завдання</DialogTitle>
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogContent dividers>
          <TaskFormFields formik={formik} />
          {formik.errors.submit && (
            <Typography color="error" mt={1}>
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={formik.isSubmitting}>
            Відмінити
          </Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Додаємо...' : 'Додати'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskDialog;
