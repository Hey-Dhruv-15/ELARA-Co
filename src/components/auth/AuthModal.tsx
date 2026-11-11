import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { UserProfile } from '../../types';
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Check,
  Eye,
  EyeOff,
  Crown,
  AlertCircle,
} from 'lucide-react';

const AUTHORIZED_ADMIN_EMAILS = [
  'supreethr101105@gmail.com',
  'laasyaarun18@gmail.com',
  'akankssha.mgr@gmail.com',
  'hey.dhruva20@gmail.com',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMessage,
    loginWithGoogle,
    requestOtp,
    verifyOtp,
    setSessionUser,
    isLoading: isAuthLoading,
  } = useAuth();

  const {
    login: adminLogin,
    changePassword: adminChangePassword,
    isLoading: isAdminLoading,
  } = useAdminAuth();

  const isLoading = isAuthLoading || isAdminLoading;

  const [step, setStep] = useState<'credentials' | 'otp' | 'changePassword'>('credentials');
  const [tab, setTab] = useState<'signin' | 'register'>('signin');

  // Form fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>('123456');

  // First-time Admin Password Change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const cleanEmail = email.trim().toLowerCase();
  const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);

  const resetAllFields = () => {
    setStep('credentials');
    setEmail('');
    setPassword('');
    setOtp('');
    setFullName('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    resetAllFields();
    closeAuthModal();
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // 1. Direct Administrator Login (Using this login modal with admin password Elara@2026)
    if (tab === 'signin' && (isAdminEmail || password === 'Elara@2026')) {
      const res = await adminLogin(cleanEmail, password);
      if (res.success && res.admin) {
        // Synchronize active website session as an Administrator
        const adminProfile: UserProfile = {
          id: res.admin.id,
          name: res.admin.name,
          email: cleanEmail,
          provider: 'admin',
          role: 'admin',
          joinedDate: 'November 2026',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(res.admin.name)}&backgroundColor=8A4A52`,
          addresses: [],
        };
        setSessionUser(adminProfile, res.token);

        // If initial login requires password change, switch smoothly to password update step
        if (res.mustChangePassword) {
          setStep('changePassword');
          return;
        }

        // Successfully logged in
        handleClose();
        return;
      } else {
        setError(res.error || 'Incorrect administrator password. Use Elara@2026 or your updated password.');
        return;
      }
    }

    // 2. Prevent registering an existing administrator email
    if (tab === 'register' && isAdminEmail) {
      setError('This email is a recognized administrator. Please switch to Sign In and enter your admin password.');
      return;
    }

    // 3. Customer registration name validation
    if (tab === 'register' && !fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    // 4. Regular Patron OTP Flow
    const res = await requestOtp(cleanEmail);
    if (res.success) {
      setDemoOtpHint(res.otpCode || '123456');
      setStep('otp');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length < 6) {
      setError('Please enter the 6-digit verification OTP');
      return;
    }

    const res = await verifyOtp(cleanEmail, otp, fullName);
    if (!res.success) {
      setError(res.error || 'Verification failed. Try demo OTP 123456');
    } else {
      handleClose();
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword === 'Elara@2026') {
      setError('You cannot reuse the initial default password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    const res = await adminChangePassword(password, newPassword);
    if (res.success) {
      handleClose();
    } else {
      setError(res.error || 'Failed to update administrator password.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    const res = await requestOtp(cleanEmail);
    setDemoOtpHint(res.otpCode || '123456');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-elara-card-dark rounded-3xl shadow-2xl border border-elara-border-light dark:border-elara-border-dark overflow-hidden p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close authentication modal"
          className="absolute top-4 right-4 p-2 rounded-full text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec flex items-center justify-center text-[#8A4A52] dark:text-[#E4A9AE] mx-auto shadow-xs border border-elara-border-light dark:border-elara-border-dark">
            {step === 'changePassword' ? (
              <ShieldCheck className="w-6 h-6 text-[#8A4A52] dark:text-[#E4A9AE]" />
            ) : isAdminEmail && tab === 'signin' ? (
              <Crown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>

          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            {step === 'changePassword'
              ? 'Administrator Security Setup'
              : isAdminEmail && tab === 'signin'
              ? 'Administrator Access'
              : 'ELARA & CO. Patron Portal'}
          </span>

          <h2 className="font-serif text-2xl font-medium text-elara-text-dark dark:text-elara-text-light">
            {step === 'changePassword'
              ? 'Set Personal Password'
              : step === 'otp'
              ? 'Enter Verification Code'
              : isAdminEmail && tab === 'signin'
              ? 'Welcome Administrator'
              : tab === 'signin'
              ? 'Welcome Back'
              : 'Create Patron Account'}
          </h2>

          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed max-w-xs mx-auto">
            {step === 'changePassword'
              ? 'First login detected: please set your personal password to unlock full administrator and boutique privileges.'
              : step === 'otp'
              ? `We sent a 6-digit OTP code to ${cleanEmail}`
              : isAdminEmail && tab === 'signin'
              ? 'Enter your admin password (initial: Elara@2026) to sign in directly to the boutique & admin panel.'
              : authModalMessage ||
                'Sign in to access your personal wishlist, saved shopping bag, and order history.'}
          </p>
        </div>

        {/* STEP 1: CREDENTIALS & GOOGLE LOGIN */}
        {step === 'credentials' && (
          <div className="space-y-4">
            {/* Google One-Click Login */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => loginWithGoogle()}
              className="w-full py-3 px-4 rounded-xl border border-elara-border-light dark:border-elara-border-dark bg-white dark:bg-elara-bg-dark hover:bg-elara-bg-light-sec/50 text-xs font-semibold text-elara-text-dark dark:text-elara-text-light transition-all flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (Gmail)</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <span className="h-[0.5px] flex-1 bg-elara-border-light dark:bg-elara-border-dark" />
              <span className="text-[10px] uppercase tracking-wider text-elara-text-muted">
                or with manual email
              </span>
              <span className="h-[0.5px] flex-1 bg-elara-border-light dark:border-elara-border-dark" />
            </div>

            {/* Tab switch between Sign In & Create Account */}
            <div className="flex border-b border-elara-border-light dark:border-elara-border-dark">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                className={`flex-1 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  tab === 'signin'
                    ? 'border-b-2 border-[#8A4A52] text-[#8A4A52] dark:text-[#E4A9AE]'
                    : 'text-elara-text-muted hover:text-elara-text-dark'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`flex-1 pb-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  tab === 'register'
                    ? 'border-b-2 border-[#8A4A52] text-[#8A4A52] dark:text-[#E4A9AE]'
                    : 'text-elara-text-muted hover:text-elara-text-dark'
                }`}
              >
                New Account
              </button>
            </div>

            {/* Administrator Recognition Badge */}
            {isAdminEmail && tab === 'signin' && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200 animate-fade-in">
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold block text-[11px]">Authorized Administrator Account</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-300">
                    Sign in with initial password <strong className="font-mono font-bold">Elara@2026</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-3 pt-1">
              {tab === 'register' && (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Shalini Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. patron@example.com"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 ${
                      isAdminEmail
                        ? 'border-amber-400 dark:border-amber-600 focus:ring-amber-500'
                        : 'border-elara-border-light dark:border-elara-border-dark focus:ring-[#8A4A52]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                    Password
                  </label>
                  {isAdminEmail && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      Initial: Elara@2026
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isAdminEmail ? 'Admin password (Elara@2026)' : '••••••••'}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-2.5 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 py-3.5 rounded-xl text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 ${
                  isAdminEmail && tab === 'signin'
                    ? 'bg-[#8A4A52] hover:bg-[#72383f] ring-1 ring-amber-400/40'
                    : 'bg-[#8A4A52] hover:bg-[#72383f]'
                }`}
              >
                {isAdminEmail && tab === 'signin' ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Sign In as Administrator</span>
                  </>
                ) : (
                  <>
                    <span>{tab === 'signin' ? 'Verify & Sign In' : 'Continue to Verification'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: FIRST-TIME ADMIN PASSWORD CHANGE */}
        {step === 'changePassword' && (
          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-relaxed">
                For security compliance, authorized administrators must choose a personal password before continuing.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                New Custom Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong new password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-2.5 text-xs text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#72383f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Update Password &amp; Enter Website</span>
            </button>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {/* Demo Helper Badge */}
            {demoOtpHint && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
                <span>
                  Demo OTP code: <strong className="font-mono text-sm tracking-widest">{demoOtpHint}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtp(demoOtpHint)}
                  className="text-[10px] underline uppercase tracking-wider font-semibold hover:text-[#8A4A52]"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-2 text-center">
                Enter 6-Digit OTP Code
              </label>
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-elara-text-muted" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 text-center tracking-[0.4em] font-mono text-lg font-bold bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-2 focus:ring-[#8A4A52]"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg border border-rose-200 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#72383f] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Verify &amp; Create Session</span>
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-elara-text-muted">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="hover:underline"
              >
                ← Back to Edit Email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#8A4A52] dark:text-[#E4A9AE] hover:underline font-medium"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-elara-border-light dark:border-elara-border-dark flex items-center justify-center gap-2 text-[10px] text-elara-text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Boutique Authentication • Privacy Respected</span>
        </div>
      </div>
    </div>
  );
};
