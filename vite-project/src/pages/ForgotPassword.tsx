import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setMessage('Введіть коректний email');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Лист для відновлення пароля надіслано на пошту.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Відновлення пароля</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {message && (
        <p
          className={`mb-4 text-center font-semibold ${
            message.includes('надіслано') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded transition-colors duration-200"
      >
        {loading ? 'Надсилаємо...' : 'Надіслати лист'}
      </button>
    </form>
  );
}
