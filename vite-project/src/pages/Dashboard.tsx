import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-24 text-gray-500">Loading...</div>;

  return (
    <div
      className="max-w-sm mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg
                 flex flex-col gap-4"
    >
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-4">Профіль</h1>
      
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Створено:</strong> {new Date(user.created_at).toLocaleString()}</p>
      
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white py-3 rounded-md font-medium
                   hover:bg-red-700 transition"
      >
        Вийти
      </button>
    </div>
  );
}
