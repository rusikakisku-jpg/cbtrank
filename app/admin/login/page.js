export const runtime = 'edge';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rusikakisku@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        router.push('/admin');
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
            CBTRANK PANEL
          </h1>
          <span className="inline-block bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30 text-xs font-semibold px-3 py-1 rounded-full">
            AUTHENTIC D1 USER ACCESS
          </span>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">
              Admin Email (Database Record)
            </label>
            <input 
              type="email" 
              placeholder="rusikakisku@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <input 
              type="password" 
              placeholder="Enter password (default: admin123)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366f1]"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#4f46e5] hover:opacity-95 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating with D1...' : 'Sign In to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  );
}
