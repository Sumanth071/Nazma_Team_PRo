import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircleDot, Sparkles, Shield, FlaskConical, Stethoscope, Sun, Moon, CheckCircle2, Activity, Layers, Mail, Lock } from 'lucide-react';
import { UserRole } from '../../types';
import { useTheme } from '../../context/ThemeContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f26] flex items-center justify-center p-4 sm:p-6 font-sans transition-colors relative">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-5 right-5 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-all"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-[#0d1838] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 min-h-[580px] transition-colors">
        
        {/* Left Side: Clean Clinical Overview Panel */}
        <div className="bg-gradient-to-br from-[#060c21] via-[#0a1438] to-[#0f1d4a] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
                <CircleDot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight text-white leading-tight">
                  Polyp<span className="text-blue-400">AI</span>
                </div>
                <div className="text-[11px] text-blue-200/80 font-medium">
                  Clinical Decision Support
                </div>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2 pt-2">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                Polyp Detection & Analysis
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated screening support and lesion classification for colonoscopy procedures.
              </p>
            </div>

            {/* Feature Highlights (No cartoon or graphic images) */}
            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Diagnostic Accuracy</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    94.6% concordance validated against histological findings.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Automated Screening</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Real-time lesion detection with localized visual attention maps.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Lesion Classification</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Differentiates adenoma, serrated, hyperplastic, and normal mucosa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Medical Disclaimer */}
          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed relative z-10">
            Clinical decision support platform for research and validation.
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#0d1838] transition-colors">
          <div className="max-w-sm w-full mx-auto space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to your account</p>
            </div>

            {/* Clean Quick Demo Login Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Quick Demo Login
                </span>
                <span className="text-[10px] text-slate-400">1-click access</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Admin Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Admin')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 text-center transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Admin</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    Dr. Mitchell
                  </div>
                </button>

                {/* Researcher Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Researcher')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-center transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <FlaskConical className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Researcher</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    Prof. Chen
                  </div>
                </button>

                {/* Clinician Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Clinician')}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 text-center transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    <Stethoscope className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Clinician</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    Dr. Rostova
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. dr.mitchell@coloaipoly.org"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
