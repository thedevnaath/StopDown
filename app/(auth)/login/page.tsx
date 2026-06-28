'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // On successful login, redirect to a protected route (e.g., dashboard)
    router.push('/dashboard');
    router.refresh(); // Refresh the page to update the session status
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-black text-center border-b-2 border-black pb-4 mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border-2 border-black bg-white focus:ring-0 focus:border-black shadow-[4px_4px_0_0_#000] placeholder-gray-400 text-black"
              placeholder="your@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border-2 border-black bg-white focus:ring-0 focus:border-black shadow-[4px_4px_0_0_#000] placeholder-gray-400 text-black"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-bold bg-red-100 border-2 border-red-600 p-2 shadow-[2px_2px_0_0_#ef4444]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 border-2 border-black shadow-[4px_4px_0_0_#000] text-lg font-bold hover:bg-gray-800 transition-all duration-100
                       disabled:bg-gray-400 disabled:shadow-[2px_2px_0_0_#6b7280] disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/signup" // Assuming a signup route exists at /app/(auth)/signup/page.tsx
            className="font-bold text-black hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}