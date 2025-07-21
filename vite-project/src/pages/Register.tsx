import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(form);
    setMessage(error ? error.message : 'Підтвердіть email для входу');
    if (!error) setTimeout(() => navigate('/login'), 3000);
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Реєстрація</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <input
        type="password"
        name="password"
        placeholder="Пароль"
        required
        onChange={e => setForm({ ...form, password: e.target.value })}
        className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {message && <p className="text-center text-red-500 dark:text-green-400">{message}</p>}

      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold">
        Зареєструватися
      </button>

      <button type="button" onClick={() => navigate('/login')} className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded">
        Назад до входу
      </button>
    </form>
  );
}
