'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error: signupError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signupError) {
      setError(signupError.message);
    } else if (data.user) {
      setMessage('Please check your email to confirm your account.');
      // Optionally redirect to a confirmation instruction page
      // router.push('/auth/check-email');
    } else if (data.session) {
      // If user is immediately signed in (e.g., email confirmation not required for new signups)
      router.push('/protected'); // Redirect to a protected route
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white border-2 border-black shadow-[4px_4px_0_0_#000] p-8 space-y-6">
        <h1 className="text-3xl font-bold text-black border-b-2 border-black pb-2 mb-6">Sign Up</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}
          {message && <p className="text-green-600 text-sm font-medium mt-2">{message}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-300 text-black font-bold py-3 px-4 border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 ease-in-out"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 font-medium underline hover:text-blue-800">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}