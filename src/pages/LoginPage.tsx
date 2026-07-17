import { useState } from 'react';
import { Mountain, ShieldCheck, User } from 'lucide-react';

export function LoginPage({ login }: { login: (username: string, role: string) => void }) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (tab === 'login') {
      if (username === 'admin' && password === 'admin123') {
        login('admin', 'admin');
      } else if (username === 'user' && password === 'user123') {
        login('user', 'user');
      } else {
        setError('Invalid username or password.');
      }
    } else {
      if (username && email && password) {
        login(username, 'user');
      } else {
        setError('All fields are required.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-black to-gray-900">
      <div className="w-full max-w-md p-8 rounded-xl bg-gray-900/60 backdrop-blur-xl border border-yellow-500/15">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600">
            <Mountain size={28} className="text-black" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to access the monitoring system</p>
        </div>

        <div className="flex gap-2 mb-6 p-1 bg-gray-800/50 rounded-lg">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'login' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-yellow-500'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === 'register' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-yellow-500'}`}>Register</button>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10 transition-all" placeholder="Enter username" required />
          </div>
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10 transition-all" placeholder="Enter email" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5 tracking-wide">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-yellow-500/15 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/10 transition-all" placeholder="Enter password" required />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-bold text-black bg-gradient-to-r from-yellow-500 to-orange-600 hover:translate-y-[-2px] transition-transform shadow-lg">
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {tab === 'login' && (
          <div className="mt-5 p-3 rounded-lg bg-gray-800/50 text-sm">
            <p className="text-gray-400 font-semibold mb-1">Demo Credentials:</p>
            <p className="text-gray-500 flex items-center gap-1.5 mb-1"><ShieldCheck size={14} className="text-yellow-500" /> Admin: <code className="text-yellow-500">admin / admin123</code></p>
            <p className="text-gray-500 flex items-center gap-1.5"><User size={14} className="text-yellow-500" /> User: <code className="text-yellow-500">user / user123</code></p>
          </div>
        )}
      </div>
    </div>
  );
}
