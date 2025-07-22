import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../service/authService';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
        setError(err.message || 'Помилка отримання користувача');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Помилка виходу');
    }
  };

  if (loading)
    return (
      <div className="text-center mt-24 text-gray-500 dark:text-gray-400">
        Завантаження...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-24 text-red-600 font-semibold">
        Помилка: {error}
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-24 text-gray-500 dark:text-gray-400">
        Користувач не знайдений.
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-xl shadow-lg space-y-4">
      <h1 className="text-3xl font-bold text-center">👤 Профіль</h1>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Створено:</strong> {new Date(user.created_at).toLocaleString()}
      </p>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-md font-semibold"
      >
        Вийти
      </button>
    </div>
  );
}
