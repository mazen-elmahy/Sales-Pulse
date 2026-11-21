import React, { useState } from 'react';
import { ShieldCheck, Zap, Lock, Mail, ArrowRight, AlertCircle, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f50] via-[#29244f] to-[#0c0f50] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#bc4ea9] to-[#ecbc8c] shadow-lg shadow-[#bc4ea9]/20 mb-3">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sales<span className="text-[#ecbc8c]">Pulse</span>
          </h1>
          <p className="text-sm text-[#b0c0c4] mt-1">Admin-Only Read-Only Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrator Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Authenticate via Supabase Auth to access store metrics & inventory.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@salespulse.co"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#bc4ea9] focus:ring-1 focus:ring-[#bc4ea9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#bc4ea9] focus:ring-1 focus:ring-[#bc4ea9]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#bc4ea9] hover:bg-[#9e5a95] text-white font-semibold rounded-lg text-xs transition-colors shadow-md shadow-[#bc4ea9]/20 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying session...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-slate-400 uppercase font-medium tracking-wider">
                Or Instant Preview
              </span>
            </div>
          </div>

          {/* Demo Button */}
          <button
            type="button"
            onClick={loginAsDemo}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#bc4ea9]" />
            <span>Launch with Demo Data (Offline Mode)</span>
          </button>
        </div>

        {/* Footer Notice */}
        <div className="mt-6 text-center text-xs text-[#b0c0c4] flex items-center justify-center space-x-2">
          <Bot className="w-4 h-4 text-[#ecbc8c]" />
          <span>Customer shopping & ordering continue exclusively via the Telegram Bot</span>
        </div>
      </div>
    </div>
  );
};
