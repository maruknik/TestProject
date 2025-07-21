import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  setLoading(false);
  setMessage(error ? error.message : 'Лист надіслано! Перевірте пошту.');
};


  return (
    <form
      onSubmit={handleReset}
      className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Відновити пароль</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {message && <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold disabled:bg-blue-300">
        {loading ? 'Надсилаємо...' : 'Надіслати лист'}
      </button>
    </form>
  );
}
