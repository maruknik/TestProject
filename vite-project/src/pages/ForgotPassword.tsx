import { useState } from 'react';
import { resetPassword } from '../service/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Лист надіслано! Перевірте пошту.');
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto mt-24 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Відновити пароль</h2>
      <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="..." />
      {message && <p className="text-center text-sm text-green-600 dark:text-green-400">{message}</p>}
      <button type="submit" disabled={loading} className="...">
        {loading ? 'Надсилаємо...' : 'Надіслати лист'}
      </button>
    </form>
  );
}
