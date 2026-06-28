'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(true); // To toggle between sign-in/sign-up forms
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signed in successfully! Redirecting...');
      router.refresh(); // Refresh to update auth state
      router.push('/dashboard'); // Or wherever the user should go
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`, // Important for email confirmation
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (data.user) {
      setMessage('Registration successful! Please check your email to confirm your account.');
    } else {
      // This case handles when user is created but email confirmation is pending (e.g., if no user data but no error)
      setMessage('Account created. Please check your email to confirm your account.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-8 md:p-10 rounded-none max-w-md w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h2>

        <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-md font-medium text-black mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black rounded-none shadow-[2px_2px_0_0_#000] placeholder-gray-500 text-black"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-md font-medium text-black mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black rounded-none shadow-[2px_2px_0_0_#000] placeholder-gray-500 text-black"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] transition-all duration-150 ease-in-out
                       hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[4px_4px_0_0_#000]
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-[4px_4px_0_0_#000] disabled:translate-x-0 disabled:translate-y-0"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {message && (
          <p className={`mt-5 text-center text-md font-medium ${message.includes('success') || message.includes('Success') || message.includes('created') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setMessage(''); // Clear message when switching forms
            }}
            className="text-blue-600 hover:underline font-semibold text-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-none"
            disabled={loading}
          >
            {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}