'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Wrong password');
      }
    } catch {
      setError('Error verifying password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-4 p-8 bg-gray-800 rounded-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          🔒 Protected App
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter access password"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
