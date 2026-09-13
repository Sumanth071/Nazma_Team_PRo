import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Sparkles,
  Lock,
  Mail,
  Sun,
  Moon,
  AlertTriangle,
  ArrowRight,
  Server,
  FileCheck,
  Users,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const AdminLogin: React.FC = () => {
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
      // Verify user is administrator
      const stored = localStorage.getItem('coloai_user');
      const user = stored ? JSON.parse(stored) : null;
      if (user && user.role !== 'Admin') {
        setError('Access Denied: This terminal is strictly reserved for System Administrators. Please use the Staff Portal.');
        return;
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin('Admin');
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate administrator demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 font-sans relative">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-rose-400 shadow-sm transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      {/* Ambient Red/Indigo Security Glows */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#0d1322] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-rose-900/30 grid grid-cols-1 md:grid-cols-12 min-h-[560px] relative z-10">
        
        {/* Left Side: Administrator Command Center HUD (5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#0a0f1d] via-[#11182c] to-[#150e1f] p-5 sm:p-7 md:p-8 lg:p-10 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-rose-900/20 relative overflow-hidden">
          
          <div className="space-y-4 sm:space-y-6">
            {/* Header Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white font-black shadow-lg shadow-rose-600/30 border border-rose-400/30 shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
                  Colo<span className="text-rose-400">AI</span> Admin
                </div>
                <div className="text-[10px] sm:text-[11px] text-rose-300/80 font-mono tracking-wider uppercase">
                  Governance & Security Terminal
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] sm:text-[11px] font-mono font-semibold text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>SECURITY CLEARANCE LEVEL 3</span>
            </div>

            <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                Administrative System Control
              </h1>
              <p className="text-xs text-slate-300/90 leading-relaxed">
                Central management portal for MLOps model promotions, RBAC permissions, audit trail verifications, and clinical benchmark datasets.
              </p>
            </div>

            {/* Admin Capabilities List */}
            <div className="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">Model Registry & Production Promotion</div>
                  <div className="text-[10px] text-slate-400">Activate and deploy AI model versions with 1 click</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">Immutable Security Audit Trail</div>
                  <div className="text-[10px] text-slate-400">Track all clinical logins, inferences, and approvals</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-white">User Access & Role Management</div>
                  <div className="text-[10px] text-slate-400">Granular permission control across medical staff</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 mt-4 sm:mt-0 border-t border-rose-900/30 text-[10px] sm:text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>TERMINAL: ADMIN-01</span>
            <span className="text-emerald-400">AUDIT LOGGING ENFORCED</span>
          </div>
        </div>

        {/* Right Side: Admin Sign In Form (7 cols) */}
        <div className="md:col-span-7 p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center bg-[#0d1322] text-white">
          <div className="max-w-md w-full mx-auto space-y-4 sm:space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-950/50 border border-rose-800 text-[10px] sm:text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                Restricted Access
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Administrator Sign In</h2>
              <p className="text-xs text-slate-400">Authenticate using your administrative master credentials</p>
            </div>

            {/* Dedicated 1-Click Admin Demo Login Button */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 space-y-2 sm:space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  1-Click Administrator Demo Access
                </span>
                <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Admin Persona</span>
              </div>

              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="w-full p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-rose-600/30 transition-all cursor-pointer group min-h-[44px]"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 text-left">
                  <Shield className="w-4 h-4 text-rose-200 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white text-xs">Sign in as Dr. Sarah Mitchell</div>
                    <div className="text-[10px] text-rose-200 font-normal">Chief Administrator & System Governance Officer</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700 text-rose-300 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@coloaipoly.org"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Master Security Key / Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 text-rose-600 focus:ring-rose-500 bg-slate-900"
                  />
                  <span>Persist administrative session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
              >
                {loading ? 'Authenticating...' : 'Access Admin Control Center'}
              </button>
            </form>

            {/* Link to Clinical Staff Portal */}
            <div className="pt-3 sm:pt-4 border-t border-slate-800 text-center">
              <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-300">
                  Are you a Medical Clinician or Researcher?
                </span>
                <Link
                  to="/login"
                  className="text-xs font-bold text-blue-400 hover:underline inline-flex items-center gap-1 py-1"
                >
                  Staff Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
