import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight, Sparkles, AlertCircle, KeyRound, Mail, UserCheck } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in.');
    } finally {
      setLoading(false);
    }
  }

  // Quick Demo Login Helper
  async function handleQuickDemo(demoEmail) {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto mb-3 shadow-inner">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Sign In to TEVIX</h2>
        <p className="text-xs text-slate-400">Access your team intelligence workspace</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* QUICK DEMO CREDENTIALS SHORTCUT */}
      <div className="bg-slate-900 border border-indigo-900/60 rounded-xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>1-Click Demo Profiles (For Judging)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Click any preset persona to instantly sign in with pre-seeded hackathon team data:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemo('arjun@tevix.dev')}
            disabled={loading}
            className="text-left p-2 rounded-lg bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700/60 transition-all text-xs group"
          >
            <span className="font-bold text-white block group-hover:text-indigo-300">Arjun Kumar</span>
            <span className="text-[10px] text-indigo-400">Team Leader • Quantum Leap</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('kavin@tevix.dev')}
            disabled={loading}
            className="text-left p-2 rounded-lg bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700/60 transition-all text-xs group"
          >
            <span className="font-bold text-white block group-hover:text-emerald-300">Kavin Raj</span>
            <span className="text-[10px] text-emerald-400">Backend Candidate (+44% Lift)</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('divya@tevix.dev')}
            disabled={loading}
            className="text-left p-2 rounded-lg bg-slate-950 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-700/60 transition-all text-xs group"
          >
            <span className="font-bold text-white block group-hover:text-purple-300">Divya Menon</span>
            <span className="text-[10px] text-purple-400">AI/ML Engineer Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('priya@tevix.dev')}
            disabled={loading}
            className="text-left p-2 rounded-lg bg-slate-950 hover:bg-pink-950/60 border border-slate-800 hover:border-pink-700/60 transition-all text-xs group"
          >
            <span className="font-bold text-white block group-hover:text-pink-300">Priya Sharma</span>
            <span className="text-[10px] text-pink-400">UI/UX Designer Member</span>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@tevix.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
