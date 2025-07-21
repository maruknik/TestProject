import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/dashboard');
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg flex flex-col gap-6"
    >
      <h1 className="text-3xl font-semibold text-center text-gray-800">Логін</h1>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="px-4 py-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 text-center">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Логін
      </button>

      <button
        type="button"
        onClick={() => navigate('/register')}
        className="bg-gray-600 text-white py-3 rounded-md font-medium hover:bg-gray-700 transition"
      >
        Реєстрація
      </button>

      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        className="bg-yellow-600 text-white py-3 rounded-md font-medium hover:bg-yellow-700 transition"
      >
        Відновити пароль
      </button>
    </form>
  );
}
