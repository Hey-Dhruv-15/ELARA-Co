import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Logo } from '../../components/common/Logo';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

const AUTHORIZED_ADMINS = [
  { email: 'supreethr101105@gmail.com', name: 'Supreeth R' },
  { email: 'laasyaarun18@gmail.com', name: 'Laasya Arun' },
  { email: 'akankssha.mgr@gmail.com', name: 'Akankssha M' },
  { email: 'hey.dhruva20@gmail.com', name: 'Dhruva' },
];

export const AdminLoginPage: React.FC = () => {
  const { login, changePassword, isAuthenticated, mustChangePassword } = useAdminAuth();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // First-time password change state
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // If already logged in and doesn't need to change password, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated && !mustChangePassword) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isAuthenticated && mustChangePassword) {
      setShowChangeModal(true);
    }
  }, [isAuthenticated, mustChangePassword, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (res.mustChangePassword) {
        setCurrentPassword(password);
        setShowChangeModal(true);
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } else {
      setErrorMessage(res.error || 'Invalid credentials or unauthorized account.');
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');

    if (newPassword.length < 8) {
      setChangeError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword === 'Elara@2026') {
      setChangeError('You cannot reuse the initial default password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setShowChangeModal(false);
      navigate('/admin/dashboard', { replace: true });
    } else {
      setChangeError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F7] dark:bg-[#191516] flex flex-col justify-between text-elara-text-dark dark:text-elara-text-light font-sans selection:bg-[#D9A6A5] selection:text-white transition-colors duration-300">
      {/* Top Bar */}
      <header className="w-full py-4 px-6 sm:px-12 flex items-center justify-between border-b border-elara-border-light/60 dark:border-elara-border-dark/60 bg-white/70 dark:bg-[#252021]/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Logo variant="compact" size="sm" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#8A4A52]/10 dark:bg-elara-accent-dark/20 text-[#8A4A52] dark:text-elara-accent-dark text-[11px] font-semibold uppercase tracking-widest border border-[#8A4A52]/20">
            Control Atelier
          </span>
        </div>
        <Link
          to="/"
          className="text-xs uppercase tracking-wider font-semibold text-elara-text-muted hover:text-[#8A4A52] dark:hover:text-elara-accent-dark transition-colors flex items-center gap-1.5"
        >
          <span>Return to Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-lg bg-white dark:bg-[#252021] rounded-3xl p-8 sm:p-10 border border-elara-border-light dark:border-elara-border-dark shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9A6A5]/15 dark:bg-[#C99598]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-8 relative z-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-elara-accent-light dark:text-elara-accent-dark block">
              Restricted Access
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-1 mb-2">
              Administrator Portal
            </h1>
            <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed max-w-sm mx-auto">
              Sign in to manage catalog items, live inventory, homepage hero elements, collections, and customer orders.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Admin Selector for Authorized Accounts */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/70 dark:border-elara-border-dark/70">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark block mb-2">
              Select Authorized Administrator Account:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {AUTHORIZED_ADMINS.map((adm) => (
                <button
                  key={adm.email}
                  type="button"
                  onClick={() => {
                    setEmail(adm.email);
                    setPassword('Elara@2026');
                    setErrorMessage('');
                  }}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    email.toLowerCase() === adm.email.toLowerCase()
                      ? 'border-[#8A4A52] bg-[#F7E9E7] dark:bg-[#302729] text-[#8A4A52] dark:text-elara-accent-dark font-medium shadow-sm'
                      : 'border-elara-border-light/60 dark:border-elara-border-dark bg-white dark:bg-[#252021] text-elara-text-dark dark:text-elara-text-light hover:border-elara-accent-light'
                  }`}
                >
                  <span className="font-semibold block truncate">{adm.name}</span>
                  <span className="text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark truncate block">
                    {adm.email.split('@')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@elaraandco.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-sm text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-2 focus:ring-[#8A4A52] transition-colors"
                />
                <Mail className="w-4 h-4 text-elara-text-muted absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
                  Password
                </label>
                <span className="text-[10px] text-elara-accent-light dark:text-elara-accent-dark">
                  Initial: <strong className="font-mono">Elara@2026</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark text-sm text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-2 focus:ring-[#8A4A52] transition-colors"
                />
                <Lock className="w-4 h-4 text-elara-text-muted absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-3.5 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-elara-champagne" />
                    <span>Authenticate & Access Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-elara-border-light/70 dark:border-elara-border-dark/70 text-center text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark space-y-1">
            <p className="flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Bcrypt 10-round encrypted • Rate limited • Strict route guard</span>
            </p>
            <p>Access is monitored and restricted strictly to authorized boutique staff.</p>
          </div>
        </div>
      </main>

      {/* Mandatory First-Time Password Change Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#252021] rounded-3xl p-8 border border-elara-border-light dark:border-elara-border-dark shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-elara-text-dark dark:text-elara-text-light">
                Update Initial Password
              </h2>
              <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
                For security, all administrators must set a personal custom password on their initial login before entering the control panel.
              </p>
            </div>

            {changeError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Current / Initial Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Elara@2026"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                />
                <span className="text-[10px] text-elara-text-muted block mt-1">
                  Must include uppercase, lowercase, and a number or symbol.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-3 px-6 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isChangingPass ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-elara-champagne" />
                      <span>Save New Password & Enter Atelier</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-elara-text-muted dark:text-elara-text-muted-dark border-t border-elara-border-light/40 dark:border-elara-border-dark/40">
        &copy; {new Date().getFullYear()} ELARA & CO. Boutique Management System. Strictly confidential.
      </footer>
    </div>
  );
};

