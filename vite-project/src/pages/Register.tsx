import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../service/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form.email, form.password);
      setMessage('Підтвердіть email для входу');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Реєстрація</h1>
      <input type="email" name="email" placeholder="Email" required onChange={e => setForm({ ...form, email: e.target.value })} className="..." />
      <input type="password" name="password" placeholder="Пароль" required onChange={e => setForm({ ...form, password: e.target.value })} className="..." />
      {message && <p className="text-center text-red-500 dark:text-green-400">{message}</p>}
      <button type="submit" className="...">Зареєструватися</button>
      <button type="button" onClick={() => navigate('/login')} className="...">Назад до входу</button>
    </form>
  );
}
