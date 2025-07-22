import * as Yup from 'yup';

export const taskValidationSchema = Yup.object({
  title: Yup.string()
    .max(100, 'Максимум 100 символів')
    .required('Обов’язкове поле'),
  description: Yup.string().max(500, 'Максимум 500 символів'),
  status: Yup.string()
    .oneOf(['todo', 'in_progress', 'done'])
    .required('Виберіть статус'),
});
