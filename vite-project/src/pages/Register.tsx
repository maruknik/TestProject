import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Перевірте пошту для підтвердження!');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg flex flex-col gap-6"
    >
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Реєстрація</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={handleChange}
        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        name="password"
        placeholder="Пароль"
        required
        onChange={handleChange}
        className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {message && (
        <p className="text-center text-red-600">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Зареєструватися
      </button>

      <button
        type="button"
        onClick={() => navigate('/login')}
        className="bg-gray-600 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
      >
        На логін
      </button>
    </form>
  );
}
