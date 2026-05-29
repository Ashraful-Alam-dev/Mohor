'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Login failed.');
      }

      localStorage.setItem('mohor_token', result.token);
      localStorage.setItem('mohor_user', JSON.stringify(result.user));

      setSuccessMessage('Logged in successfully! Redirecting...');
      
      if (result.user.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }

    } catch (error) {
      setErrorMessage(error.message || 'Invalid credentials or connection fault.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white border border-neutral-200/80 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-emerald-800 font-medium mt-1">Sign in to your account</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 mb-5 text-sm font-medium text-red-800 bg-red-50 border border-red-100 rounded-xl">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 mb-5 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
              placeholder="+8801XXXXXXXXX" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3.5 border border-neutral-200 rounded-xl bg-white text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-medium text-sm" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-xl transition duration-150 shadow-sm shadow-emerald-700/10 disabled:opacity-60 cursor-pointer text-sm tracking-wide mt-2"
          >
            {loading ? 'Verifying Credentials...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-medium text-neutral-600">
          Don't have an account yet?{' '}
          <a href="/signup" className="text-emerald-700 hover:text-emerald-800 font-bold transition">
            Create One
          </a>
        </div>
      </div>
    </div>
  );
}