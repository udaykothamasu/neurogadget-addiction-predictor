import React, { useState, useEffect, useCallback } from 'react';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export interface AuthUser {
  email: string;
  name?: string;
  provider: 'email' | 'google';
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

type Mode = 'login' | 'signup';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    resetForm();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Demo: Accept any credentials (replace with real API call)
    setTimeout(() => {
      onLogin({
        email: email.trim(),
        name: name.trim() || undefined,
        provider: 'email',
      });
      setLoading(false);
    }, 600);
  };

  const handleGoogleCredential = useCallback(
    (response: { credential: string }) => {
      try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        onLogin({
          email: payload.email,
          name: payload.name,
          provider: 'google',
        });
      } catch (err) {
        console.error('Google sign-in error:', err);
        setError('Google sign-in failed. Please try again.');
      }
    },
    [onLogin]
  );

  useEffect(() => {
    const win = window as Window & { google?: { accounts?: { id?: unknown } } };
    const checkGoogle = () => {
      if (win.google?.accounts?.id) {
        setGoogleReady(true);
        return true;
      }
      return false;
    };
    if (checkGoogle()) return;
    const script = document.querySelector('script[src*="gsi/client"]');
    if (script) {
      const interval = setInterval(() => {
        if (checkGoogle()) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => setGoogleReady(true);
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!googleReady || !GOOGLE_CLIENT_ID) return;

    const win = window as Window & { google?: { accounts: { id: { initialize: (c: object) => void; renderButton: (el: HTMLElement, c: object) => void } } } };
    const initGoogle = () => {
      if (win.google?.accounts?.id) {
        win.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredential,
          auto_select: false,
        });
        const btnContainer = document.getElementById('google-btn-container');
        if (btnContainer && btnContainer.children.length === 0) {
          win.google!.accounts.id.renderButton(btnContainer, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: 320,
          });
        }
      }
    };

    const interval = setInterval(() => {
      if (win.google?.accounts?.id) {
        initGoogle();
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [googleReady, handleGoogleCredential]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f4f6f9]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e8ecf1] overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-14 h-14 bg-[#55c2da] rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
              N
            </div>
            <h1 className="text-2xl font-semibold text-[#1a2332]">NeuroGadget</h1>
            <p className="text-[#4a5568] mt-1 text-sm">
              {mode === 'login' ? 'Sign in to access your assessment' : 'Create an account to get started'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#e8ecf1]">
            <button
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'text-[#55c2da] border-b-2 border-[#55c2da] bg-[#55c2da]/10'
                  : 'text-[#6b7280] hover:text-[#1a2332]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'text-[#55c2da] border-b-2 border-[#55c2da] bg-[#55c2da]/10'
                  : 'text-[#6b7280] hover:text-[#1a2332]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e8ecf1] focus:ring-2 focus:ring-[#55c2da] focus:border-[#55c2da] outline-none transition bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e8ecf1] focus:ring-2 focus:ring-[#55c2da] focus:border-[#55c2da] outline-none transition bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e8ecf1] focus:ring-2 focus:ring-[#55c2da] focus:border-[#55c2da] outline-none transition bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-white bg-[#55c2da] hover:bg-[#4ab3c9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="px-8">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#e8ecf1]" />
              <span className="text-xs text-[#6b7280] font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-[#e8ecf1]" />
            </div>
          </div>

          {/* Google Sign-In */}
          <div className="p-8 pt-5 flex flex-col items-center">
            <div id="google-btn-container" className="flex justify-center min-h-[44px]" />
            {!GOOGLE_CLIENT_ID && (
              <p className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Add VITE_GOOGLE_CLIENT_ID to .env to enable Google sign-in
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-[#6b7280] text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
