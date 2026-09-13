import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CircleDot,
  Sparkles,
  FlaskConical,
  Stethoscope,
  Sun,
  Moon,
  Activity,
  Mail,
  Lock,
  Radio,
  Shield,
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
  motionClass: string;
}

const HOSPITAL_SCENES: HospitalScene[] = [
  {
    id: 'endo_suite',
    title: 'Smart Endoscopy Suite 4',
    tag: 'Live Surgical Stream • 60 FPS',
    description: 'High-definition mucosal video stream with automated real-time deep neural feature mapping.',
    image: '/hospital/hospital_endo_suite.jpg',
    metric: '94.6%',
    metricLabel: 'Diagnostic Accuracy',
    badge: 'PACS Optical Stream Active',
    motionClass: 'animate-hospital-fast-1',
  },
  {
    id: 'ai_lab',
    title: 'AI Diagnostics Research Lab',
    tag: 'Explainable AI Engine',
    description: 'Real-time computation synthesizing SHAP morphological attributions and deep attention heatmaps.',
    image: '/hospital/hospital_ai_lab.jpg',
    metric: '768-D',
    metricLabel: 'Feature Vector Embedding',
    badge: 'Neural Engine Online',
    motionClass: 'animate-hospital-fast-2',
  },
  {
    id: 'clinical_team',
    title: 'Multidisciplinary Clinical Care',
    tag: 'Specialist Sign-off',
    description: 'Collaborative diagnostic validation by gastroenterologists, histopathologists, and clinical endoscopists.',
    image: '/hospital/hospital_clinical_team.jpg',
    metric: '< 1.2s',
    metricLabel: 'Inference Latency',
    badge: 'Clinical Board Active',
    motionClass: 'animate-hospital-fast-3',
  },
];

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fast animated hospital scenes carousel (3.2 seconds rotation)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Fast automatic scene progression
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % HOSPITAL_SCENES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const routeByRole = (role?: string) => {
    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'Clinician') {
      navigate('/clinician/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Retrieve stored user or default navigate
      const stored = localStorage.getItem('coloai_user');
      const user = stored ? JSON.parse(stored) : null;
      routeByRole(user?.role);
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
      routeByRole(role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate demo account.');
    } finally {
      setLoading(false);
    }
  };

  const currentScene = HOSPITAL_SCENES[currentSceneIndex];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f26] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 font-sans transition-colors relative">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-5xl bg-white dark:bg-[#0d1838] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[620px] transition-colors">
        
        {/* Left Side: Fast-Animated High-Tech Hospital Viewport (7 cols on lg) */}
        <div className="lg:col-span-7 relative p-5 sm:p-7 md:p-8 lg:p-10 text-white flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80 min-h-[300px] sm:min-h-[360px] lg:min-h-[620px]">
          
          {/* Continuous Fast-Motion Cross-fading Hospital Background Images */}
          {HOSPITAL_SCENES.map((scene, idx) => {
            const isActive = idx === currentSceneIndex;
            return (
              <div
                key={scene.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
                }`}
              >
                <img
                  src={scene.image}
                  alt={scene.title}
                  className={`w-full h-full object-cover ${scene.motionClass}`}
                />
                {/* Cinematic Glassmorphic Hospital Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#07112e]/75 to-[#04091a]/85" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#040817]/90 via-transparent to-[#040817]/65" />
              </div>
            );
          })}


          {/* Top Header: Logo & Live Status Telemetry */}
          <div className="relative z-20 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/40 border border-blue-400/30 shrink-0">
                <CircleDot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
                  Colo<span className="text-blue-400">AI</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-blue-200/90 font-medium">
                  Clinical Staff Portal
                </div>
              </div>
            </div>

            {/* Live Network Pulse Indicator */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-[10px] sm:text-[11px] font-semibold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="truncate max-w-[150px] sm:max-w-none">{currentScene.badge}</span>
            </div>
          </div>

          {/* Center: Dynamic Animated Hospital Scene Information Card */}
          <div className="relative z-20 my-auto py-4 sm:py-6 space-y-2.5 sm:space-y-3.5 max-w-lg">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span>{currentScene.tag}</span>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                {currentScene.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed drop-shadow line-clamp-3 sm:line-clamp-none">
                {currentScene.description}
              </p>
            </div>

            {/* Live Hospital Telemetry Mini Cards */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 dark:bg-slate-950/70 border border-white/20 backdrop-blur-md">
                <div className="text-base sm:text-xl font-black text-cyan-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse shrink-0" />
                  <span>{currentScene.metric}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                  {currentScene.metricLabel}
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 dark:bg-slate-950/70 border border-white/20 backdrop-blur-md">
                <div className="text-base sm:text-xl font-black text-emerald-400">
                  4 Classes
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                  Histological Lesion Sorting
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls: Fast Interactive Scene Switchers */}
          <div className="relative z-20 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {HOSPITAL_SCENES.map((scene, index) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setCurrentSceneIndex(index)}
                  className={`group px-2.5 sm:px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    index === currentSceneIndex
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 border border-cyan-300 font-bold scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${index === currentSceneIndex ? 'bg-slate-950' : 'bg-slate-400 group-hover:bg-white'}`} />
                  <span>{scene.id === 'endo_suite' ? 'Endo' : scene.id === 'ai_lab' ? 'AI Lab' : 'Clinical'}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-cyan-300/90 font-mono font-medium">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>LIVE MOTION ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clinical Staff Login Form (5 cols on lg) */}
        <div className="lg:col-span-5 p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#0d1838] transition-colors">
          <div className="max-w-sm w-full mx-auto space-y-4 sm:space-y-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-[10px] sm:text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                Medical Staff Terminal
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Staff Sign In</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Access colonoscopy analysis and review workspace</p>
            </div>

            {/* Quick Demo Login Box: ONLY the 2 Staff Roles */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  1-Click Staff Demo Login
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">2 Staff Personas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {/* Researcher Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Researcher')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-left sm:text-center transition-all shadow-2xs group cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center sm:justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    <FlaskConical className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Researcher</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Prof. David Chen
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-1">
                    Inference & Reports
                  </div>
                </button>

                {/* Clinician Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Clinician')}
                  className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-left sm:text-center transition-all shadow-2xs group cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center sm:justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    <Stethoscope className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Clinician</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Dr. Elena Rostova
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 sm:mt-1">
                    Reviews & Oversight
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. researcher@coloaipoly.org"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[44px]"
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
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[44px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                  />
                  <span>Remember session</span>
                </label>
                <Link to="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline font-medium py-1">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer min-h-[44px]"
              >
                {loading ? 'Authenticating...' : 'Sign In to Staff Workspace'}
              </button>
            </form>

            {/* Direct Link to Dedicated Administrator Portal */}
            <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    System Administrator?
                  </span>
                </div>
                <Link
                  to="/admin/login"
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline py-1"
                >
                  Admin Portal →
                </Link>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              New clinician?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline py-1">
                Register account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
