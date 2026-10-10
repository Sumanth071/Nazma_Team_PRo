import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Sun,
  Moon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../../components/BrandLogo';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [requestedRole, setRequestedRole] = useState<'Researcher' | 'Clinician'>('Researcher');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Email format validation regex
  const isEmailValid = useMemo(() => {
    if (!email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  // Password length & strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  // Password matching check
  const passwordsMatch = useMemo(() => {
    if (!confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Mark all touched
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    // Client-side validations
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter a valid user name (minimum 2 characters).');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email address (e.g. yourname@domain.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setLoading(true);
    try {
      // Sync directly with MongoDB database via authController
      await register(name.trim(), email.trim().toLowerCase(), password, requestedRole);
      setSuccess('Account created and synchronized with database! Redirecting...');

      // Dynamic workspace routing based on registered role
      setTimeout(() => {
        if (requestedRole === 'Clinician') {
          navigate('/clinician/dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 700);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070f26] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans transition-colors">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Theme Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-2xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      <div className="w-full max-w-lg space-y-5 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <BrandLogo
            size="md"
            subtitle="Cancer Classification"
            textClassName="text-slate-900 dark:text-white"
            subtitleClassName="text-blue-600 dark:text-cyan-400 font-bold"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-2">
            Create User Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Register your profile to access diagnostic AI models & clinical reviews
          </p>
        </div>

        {/* Registration Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Global Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Global Success Banner */}
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* 1. User Name Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  User Name
                </label>
                {touched.name && name.trim().length >= 2 && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Dr. Jane Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>
              {touched.name && name.trim().length > 0 && name.trim().length < 2 && (
                <p className="text-[11px] text-rose-500 mt-1">Name must be at least 2 characters.</p>
              )}
            </div>

            {/* 2. Email Address Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                {touched.email && email && isEmailValid && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid format
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="name@hospital.org"
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${touched.email && email && !isEmailValid
                      ? 'border-rose-500'
                      : 'border-slate-300 dark:border-slate-700'
                    } text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors`}
                />
              </div>
              {touched.email && email && !isEmailValid && (
                <p className="text-[11px] text-rose-500 mt-1">Please enter a valid email format (e.g. user@domain.com).</p>
              )}
            </div>

            {/* 3. Requested Role Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Requested Clinical Role
              </label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors cursor-pointer"
              >
                <option value="Researcher">AI Researcher (Inference, Explainability & Datasets)</option>
                <option value="Clinician">Clinical Reviewer (Validation, Review Notes & PDF Reports)</option>
              </select>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Role determines dashboard access permissions in accordance with HIPAA access policy.
              </p>
            </div>

            {/* 4. Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border ${confirmPassword && !passwordsMatch
                        ? 'border-rose-500'
                        : 'border-slate-300 dark:border-slate-700'
                      } text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Validation & Match Indicator */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
                  <span
                    className={`font-bold ${passwordStrength <= 1
                        ? 'text-rose-500'
                        : passwordStrength === 2
                          ? 'text-amber-500'
                          : passwordStrength === 3
                            ? 'text-blue-500'
                            : 'text-emerald-500'
                      }`}
                  >
                    {passwordStrength <= 1
                      ? 'Weak (min 6 chars)'
                      : passwordStrength === 2
                        ? 'Fair'
                        : passwordStrength === 3
                          ? 'Good'
                          : 'Strong'}
                  </span>
                </div>
                {/* Strength Meter Bar */}
                <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${passwordStrength >= 1 ? 'bg-rose-500' : 'bg-transparent'
                      }`}
                  />
                  <div
                    className={`h-full rounded-full ${passwordStrength >= 2 ? 'bg-amber-500' : 'bg-transparent'
                      }`}
                  />
                  <div
                    className={`h-full rounded-full ${passwordStrength >= 3 ? 'bg-blue-500' : 'bg-transparent'
                      }`}
                  />
                  <div
                    className={`h-full rounded-full ${passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                      }`}
                  />
                </div>

                {/* Password Match Status */}
                {confirmPassword && (
                  <div className="flex items-center gap-1.5 text-[11px] pt-1">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (confirmPassword !== '' && !passwordsMatch)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synchronizing with Database...</span>
                </>
              ) : (
                <>
                  <span>Register Account & Sync</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Database Sync & Security Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted with bcrypt (10 rounds) & synced to MongoDB database</span>
          </div>

          {/* Sign In Link */}
          <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline py-1">
              Sign in to platform
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
