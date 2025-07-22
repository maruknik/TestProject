import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import type { FormikProps } from 'formik';

interface TaskFormValues {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface TaskFormFieldsProps {
  formik: FormikProps<TaskFormValues>;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ formik }) => (
  <>
    <TextField
      fullWidth
      margin="normal"
      id="title"
      name="title"
      label="Заголовок"
      value={formik.values.title}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.title && Boolean(formik.errors.title)}
      helperText={formik.touched.title && formik.errors.title}
      autoFocus
      required
    />
    <TextField
      fullWidth
      margin="normal"
      id="description"
      name="description"
      label="Опис"
      multiline
      rows={4}
      value={formik.values.description}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.description && Boolean(formik.errors.description)}
      helperText={formik.touched.description && formik.errors.description}
    />
    <TextField
      select
      fullWidth
      margin="normal"
      id="status"
      name="status"
      label="Статус"
      value={formik.values.status}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={formik.touched.status && Boolean(formik.errors.status)}
      helperText={formik.touched.status && formik.errors.status}
    >
      {statusOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  </>
);

export default TaskFormFields;
