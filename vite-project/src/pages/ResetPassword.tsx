import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

 useEffect(() => {
  let accessToken = searchParams.get('access_token');
  let refreshToken = searchParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    accessToken = hashParams.get('access_token') || accessToken;
    refreshToken = hashParams.get('refresh_token') || refreshToken;
  }

  if (!accessToken || !refreshToken) {
    setMessage('Токен не знайдено, перейдіть на сторінку логіну.');
    setTimeout(() => navigate('/login'), 3000);
    return;
  }

  supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
    .then(({ error }) => {
      if (error) {
        setMessage('Невірний або прострочений токен. Перенаправлення на логін...');
        setTimeout(() => navigate('/login'), 3000);
      }
    });
}, [searchParams, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setMessage('Пароль має бути не менше 6 символів');
      return;
    }
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Пароль успішно змінено. Перенаправляємо...');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Зміна пароля</h2>

      <input
        type="password"
        placeholder="Новий пароль"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {message && <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold disabled:bg-blue-300"
      >
        {loading ? 'Змінюємо...' : 'Змінити пароль'}
      </button>
    </form>
  );
}
