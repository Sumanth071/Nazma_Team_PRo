import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CircleDot,
  Sparkles,
  Shield,
  FlaskConical,
  Stethoscope,
  Sun,
  Moon,
  Activity,
  Layers,
  Mail,
  Lock,
  Radio,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HospitalScene {
  id: string;
  title: string;
  tag: string;
  description: string;
  image: string;
  metric: string;
  metricLabel: string;
  badge: string;
}

const HOSPITAL_SCENES: HospitalScene[] = [
  {
    id: 'endo_suite',
    title: 'Smart Endoscopy Suite 4',
    tag: 'Live Procedure Room',
    description: 'High-definition colonoscopy imaging with real-time deep neural feature mapping during active endoscopic screening.',
    image: '/hospital/hospital_endo_suite.jpg',
    metric: '94.6%',
    metricLabel: 'Diagnostic Accuracy',
    badge: 'PACS Connected • 60 FPS',
  },
  {
    id: 'ai_lab',
    title: 'AI Diagnostics Research Lab',
    tag: 'Explainable AI Suite',
    description: 'Explainable decision intelligence laboratory calculating SHAP feature attributions and deep attention heatmaps.',
    image: '/hospital/hospital_ai_lab.jpg',
    metric: '768-D',
    metricLabel: 'Feature Vector Embedding',
    badge: 'Explainability Engine Online',
  },
  {
    id: 'clinical_team',
    title: 'Multidisciplinary Clinical Care',
    tag: 'Physician Review Team',
    description: 'Collaborative diagnostic sign-off by gastroenterologists, histopathologists, and clinical endoscopists.',
    image: '/hospital/hospital_clinical_team.jpg',
    metric: '< 1.2s',
    metricLabel: 'Inference Latency',
    badge: 'Clinical Board Active',
  },
];

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Animated hospital scenes carousel state
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Auto-advance scenes every 5.5 seconds with smooth transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % HOSPITAL_SCENES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

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

  const currentScene = HOSPITAL_SCENES[currentSceneIndex];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f26] flex items-center justify-center p-4 sm:p-6 font-sans transition-colors relative">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-5 right-5 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-[#0d1838] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[620px] transition-colors">
        
        {/* Left Side: Animated High-Tech Hospital Viewport (7 cols on lg screens) */}
        <div className="lg:col-span-7 relative p-8 sm:p-10 text-white flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 min-h-[440px] lg:min-h-[620px]">
          
          {/* Animated Ken Burns Cross-fading Hospital Background Images */}
          {HOSPITAL_SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            return (
              <div
                key={scene.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
                }`}
              >
                <img
                  src={scene.image}
                  alt={scene.title}
                  className={`w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out ${
                    isActive ? 'scale-108' : 'scale-100'
                  }`}
                />
                {/* Cinematic Glassmorphic Hospital Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#07112e]/75 to-[#04091a]/85" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#040817]/90 via-transparent to-[#040817]/60" />
              </div>
            );
          })}

          {/* Top Header: Logo & Live Status Telemetry */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/40 border border-blue-400/30">
                <CircleDot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight text-white leading-tight">
                  Colo<span className="text-blue-400">AI</span>
                </div>
                <div className="text-[11px] text-blue-200/90 font-medium">
                  Hospital Decision Support System
                </div>
              </div>
            </div>

            {/* Live Network Pulse Indicator */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-semibold text-emerald-400 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{currentScene.badge}</span>
            </div>
          </div>

          {/* Center: Dynamic Animated Hospital Scene Information Card */}
          <div className="relative z-10 my-auto py-8 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{currentScene.tag}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug drop-shadow-md">
                {currentScene.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed drop-shadow">
                {currentScene.description}
              </p>
            </div>

            {/* Live Hospital Telemetry Mini Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/15 backdrop-blur-md">
                <div className="text-lg sm:text-xl font-black text-emerald-400">
                  {currentScene.metric}
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {currentScene.metricLabel}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/15 backdrop-blur-md">
                <div className="text-lg sm:text-xl font-black text-blue-400">
                  4 Classes
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  Histological Lesion Sorting
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls: Interactive Scene Switchers */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {HOSPITAL_SCENES.map((scene, index) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setCurrentSceneIndex(index)}
                  className={`group px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    index === currentSceneIndex
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 border border-blue-400/50'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${index === currentSceneIndex ? 'bg-white' : 'bg-slate-400 group-hover:bg-white'}`} />
                  <span className="hidden sm:inline">{scene.id === 'endo_suite' ? 'Endo Suite' : scene.id === 'ai_lab' ? 'AI Lab' : 'Clinical Team'}</span>
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              Live Medical Simulation
            </span>
          </div>
        </div>

        {/* Right Side: Clean Modern Login Form & Personas (5 cols on lg screens) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#0d1838] transition-colors">
          <div className="max-w-sm w-full mx-auto space-y-5">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Staff Portal</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access clinical decision records</p>
            </div>

            {/* Quick Demo Login Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  1-Click Demo Login
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Ready</span>
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
                  Hospital Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@coloaipoly.org"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Access Key / Password
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
                  <span>Remember session</span>
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
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              New clinician or researcher?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Register account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
