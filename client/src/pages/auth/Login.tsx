import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  FlaskConical,
  Stethoscope,
  Sun,
  Moon,
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  LockKeyhole,
  Download,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../../components/BrandLogo';
import { GooglePlayIcon } from '../../components/GooglePlayBadge';
import { MobileAppDownloadModal } from '../../components/MobileAppDownloadModal';
import { usePWAInstall } from '../../hooks/usePWAInstall';

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
    title: 'Smart Endoscopy Suite',
    tag: 'Optical Video Stream • 60 FPS',
    description: 'High-definition mucosal video stream with automated real-time deep neural feature mapping.',
    image: '/hospital/hospital_endo_suite.jpg',
    metric: '94.6%',
    metricLabel: 'Diagnostic Accuracy',
    badge: 'PACS Optical Stream Active',
  },
  {
    id: 'ai_lab',
    title: 'Explainable AI Engine',
    tag: 'TreeExplainer + SHAP Pipeline',
    description: 'Real-time synthesis of SHAP morphological attributions and deep spatial attention heatmaps.',
    image: '/hospital/hospital_ai_lab.jpg',
    metric: '768-D',
    metricLabel: 'Feature Embeddings',
    badge: 'Neural Engine Online',
  },
  {
    id: 'clinical_team',
    title: 'Multidisciplinary Clinical Care',
    tag: 'Clinical Specialist Sign-off',
    description: 'Collaborative diagnostic validation by gastroenterologists, histopathologists, and endoscopists.',
    image: '/hospital/hospital_clinical_team.jpg',
    metric: '< 820ms',
    metricLabel: 'Inference Latency',
    badge: 'Clinical Board Active',
  },
];

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'android' | 'qrcode' | 'apk' | 'ios'>('apk');

  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  const handlePlayStoreClick = () => {
    setModalTab('apk');
    setDownloadModalOpen(true);
  };

  const handleInstallClick = () => {
    if (canInstall && !isInstalled) {
      promptInstall();
    } else {
      setModalTab('android');
      setDownloadModalOpen(true);
    }
  };

  // Smooth rotating hospital scenes
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Gentle 5.5-second scene transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % HOSPITAL_SCENES.length);
    }, 5500);
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
      const stored = localStorage.getItem('coloai_user');
      const user = stored ? JSON.parse(stored) : null;
      routeByRole(user?.role);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError('');
    setActiveDemoRole(role);
    setLoading(true);
    try {
      await quickDemoLogin(role);
      routeByRole(role);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to authenticate demo account.');
    } finally {
      setLoading(false);
      setActiveDemoRole(null);
    }
  };

  const currentScene = HOSPITAL_SCENES[currentSceneIndex];

  return (
    <div className="min-h-screen bg-slate-900 lg:bg-[#060c1d] flex flex-col items-center justify-center p-3 sm:p-5 md:p-8 font-sans transition-colors relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-2xl bg-white/10 dark:bg-slate-900/80 border border-white/20 dark:border-slate-800 text-slate-200 dark:text-slate-300 hover:text-white dark:hover:text-blue-400 backdrop-blur-md shadow-lg transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>
      </div>

      {/* Main Glassmorphic Container Card */}
      <div className="w-full max-w-6xl bg-white dark:bg-[#0a122c] rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/90 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors relative z-10">
        
        {/* ============================================================== */}
        {/* LEFT SIDE: Cinematic AI Endoscopy Showcase (7 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 relative p-6 sm:p-8 md:p-10 text-white flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200/20 dark:border-slate-800/80 min-h-[340px] sm:min-h-[400px] lg:min-h-[660px]">
          
          {/* Smooth Cross-Fading Background Hospital Images */}
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
                  className="w-full h-full object-cover scale-105 transition-transform duration-10000 ease-linear"
                />
                {/* Modern Cinematic Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-[#050f28]/75 to-[#04091a]/85" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#040817]/95 via-[#040817]/50 to-transparent" />
              </div>
            );
          })}

          {/* Top Header: Brand Logo & Real-Time Status Pill + Google Play Quick Badge */}
          <div className="relative z-20 flex items-center justify-between gap-3 flex-wrap">
            <BrandLogo size="md" subtitle="Cancer Classification" textClassName="text-white" subtitleClassName="text-cyan-400" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayStoreClick}
                title="Get on Google Play Store & Install Mobile App"
                className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white border border-slate-700/80 hover:border-cyan-400/60 backdrop-blur-md transition-all cursor-pointer group shadow-md active:scale-95"
              >
                <GooglePlayIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <div className="text-left leading-none">
                  <span className="block text-[7px] uppercase tracking-wider text-slate-400 font-semibold">GET IT ON</span>
                  <span className="block text-[11px] font-bold text-white tracking-tight mt-0.5">Google Play</span>
                </div>
                <span className="ml-1 text-[9px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Download className="w-2.5 h-2.5" /> Install
                </span>
              </button>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="truncate">{currentScene.badge}</span>
              </div>
            </div>
          </div>

          {/* Center: Dynamic Showcase Details Card */}
          <div className="relative z-20 my-auto py-6 sm:py-8 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentScene.tag}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {currentScene.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-lg drop-shadow">
                {currentScene.description}
              </p>
            </div>

            {/* AI Telemetry Metric Badges */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 dark:border-white/10 backdrop-blur-md">
                <div className="text-lg sm:text-xl font-black text-cyan-300 flex items-center gap-1.5 font-mono">
                  <span>{currentScene.metric}</span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                  {currentScene.metricLabel}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 dark:border-white/10 backdrop-blur-md">
                <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                  4 Classes
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                  Lesion Sorting
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-slate-950/60 border border-white/20 dark:border-white/10 backdrop-blur-md">
                <div className="text-lg sm:text-xl font-black text-blue-400 font-mono">
                  SHAP
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 truncate">
                  Explainability
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Interactive Scene Selector & Indicators */}
          <div className="relative z-20 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {HOSPITAL_SCENES.map((scene, index) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setCurrentSceneIndex(index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    index === currentSceneIndex
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 border border-cyan-300 font-bold scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentSceneIndex ? 'bg-slate-950' : 'bg-slate-400'
                    }`}
                  />
                  <span>
                    {scene.id === 'endo_suite' ? 'Endo Suite' : scene.id === 'ai_lab' ? 'AI Lab' : 'Clinical Care'}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deep Hybrid Pipeline Active</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT SIDE: Authentication Terminal with All 3 Roles (5 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-[#0a122c] transition-colors">
          <div className="max-w-md w-full mx-auto space-y-5">
            {/* Terminal Title */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                Clinical Decision Support
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Portal Sign In
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Select your persona or enter your hospital credentials
              </p>
            </div>

            {/* ========================================================== */}
            {/* 1-CLICK DEMO ACCESS: All 3 Roles Prominently Available */}
            {/* ========================================================== */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070e24] border border-slate-200 dark:border-slate-800/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  1-Click Instant Demo Login
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Ready to test
                </span>
              </div>

              {/* 3 Persona Cards: Admin, Clinician, Researcher */}
              <div className="grid grid-cols-3 gap-2">
                {/* Admin Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Admin')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0e193c] border border-slate-200 dark:border-slate-700/80 hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 text-center transition-all group cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50"
                  title="Login as Administrator (Dr. Sarah Mitchell)"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    Admin
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    System Control
                  </div>
                </button>

                {/* Clinician Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Clinician')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0e193c] border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-center transition-all group cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50"
                  title="Login as Clinician (Dr. Elena Rostova)"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    Clinician
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    Review Cases
                  </div>
                </button>

                {/* Researcher Persona */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Researcher')}
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0e193c] border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 text-center transition-all group cursor-pointer shadow-xs hover:shadow-md disabled:opacity-50"
                  title="Login as AI Researcher (Prof. David Chen)"
                >
                  <div className="w-7 h-7 mx-auto rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Researcher
                  </div>
                  <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                    Inference & AI
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <LockKeyhole className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Standard Credential Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@coloaipoly.org"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-[#0e193c] focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070e24] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:bg-white dark:focus:bg-[#0e193c] focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 bg-white dark:bg-slate-900"
                  />
                  <span>Remember session</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Google Play Store & Install Option Box */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070e24] border border-slate-200/90 dark:border-slate-800/90 flex items-center justify-between gap-3 shadow-xs">
              <button
                type="button"
                onClick={handlePlayStoreClick}
                title="Open Google Play Store & Android APK Package Options"
                aria-label="Get it on Google Play"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black hover:bg-slate-950 text-white border border-slate-700/90 hover:border-slate-600 shadow-sm transition-all cursor-pointer group active:scale-98"
              >
                <GooglePlayIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
                <div className="text-left leading-none">
                  <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 group-hover:text-slate-300 font-semibold">
                    GET IT ON
                  </span>
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">
                    Google Play
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                title="Direct 1-Tap Install on this device"
                aria-label="Install Diagnostic App"
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{canInstall && !isInstalled ? 'Install App' : isInstalled ? 'Installed' : 'Install App'}</span>
              </button>
            </div>
          </div>

          {/* Footer Security Badges & Registration */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2 mt-4 text-center">
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> HIPAA Ready
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-blue-500" /> End-to-End Encrypted
              </span>
              <span>•</span>
              <span>MLOps v1.0</span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              New clinician?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Register account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App & Google Play Download Modal */}
      <MobileAppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        initialTab={modalTab}
      />
    </div>
  );
};
