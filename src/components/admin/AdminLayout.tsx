import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  FileText,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  User,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, mustChangePassword, logout, changePassword } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Mandatory change password modal state if flag is on
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Close mobile nav on route change
  React.useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Route protection
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F7] dark:bg-[#191516]">
        <div className="w-8 h-8 border-2 border-[#8A4A52] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleMandatoryPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');

    if (newPassword.length < 8) {
      setChangeError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword === 'Elara@2026') {
      setChangeError('You cannot reuse the default temporary password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (!res.success) {
      setChangeError(res.error || 'Failed to update password.');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories & Collections', path: '/admin/categories', icon: Layers },
    { name: 'Homepage Editor', path: '/admin/homepage', icon: Sparkles },
    { name: 'Website Pages', path: '/admin/pages', icon: FileText },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F7] dark:bg-[#191516] text-[#49383B] dark:text-[#F7EBE8] font-sans flex flex-col transition-colors duration-300">
      {/* 1. Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#252021]/90 backdrop-blur-md border-b border-elara-border-light dark:border-elara-border-dark py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-lg text-elara-text-dark dark:text-elara-text-light hover:bg-[#F7E9E7] dark:hover:bg-[#302729] transition-colors"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Admin Brand Logo */}
            <div className="flex items-center gap-3">
              <Logo variant="compact" size="sm" />
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8A4A52] dark:text-elara-accent-dark">
                  Atelier Control System
                </span>
                <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
                  Boutique Operations
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Storefront */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
              title="Open customer storefront in a new tab"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-elara-text-dark dark:text-elara-text-light hover:bg-[#F7E9E7] dark:hover:bg-[#302729] transition-colors"
              aria-label="Toggle Light/Dark Theme"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Admin Profile Badge */}
            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-elara-border-light/80 dark:border-elara-border-dark">
              <div className="w-8 h-8 rounded-full bg-[#8A4A52] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {admin.name.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold block truncate max-w-[130px] leading-tight">
                  {admin.name}
                </span>
                <span className="text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark truncate block max-w-[130px]">
                  {admin.email}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content with Sidebar */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#252021] border-r border-elara-border-light dark:border-elara-border-dark p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="px-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-elara-text-muted dark:text-elara-text-muted-dark">
                Administration
              </span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                        isActive
                          ? 'bg-[#8A4A52] text-white shadow-sm'
                          : 'text-elara-text-dark dark:text-elara-text-light hover:bg-[#F7E9E7] dark:hover:bg-[#302729]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/70 dark:border-elara-border-dark/70 text-[11px] space-y-1">
            <span className="font-semibold block text-[#8A4A52] dark:text-elara-accent-dark">
              ELARA & CO. Atelier
            </span>
            <p className="text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark">
              Secure v2.4 Admin Engine
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="w-4/5 max-w-xs h-full bg-white dark:bg-[#252021] border-r border-elara-border-light dark:border-elara-border-dark p-6 flex flex-col justify-between overflow-y-auto animate-slide-up">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-elara-border-light dark:border-elara-border-dark">
                  <Logo variant="compact" size="sm" />
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 rounded-lg text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileNavOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                            isActive
                              ? 'bg-[#8A4A52] text-white shadow-sm'
                              : 'text-elara-text-dark dark:text-elara-text-light hover:bg-[#F7E9E7] dark:hover:bg-[#302729]'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-elara-border-light dark:border-elara-border-dark">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/admin/login');
                  }}
                  className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mandatory Password Change Modal Guard */}
      {mustChangePassword && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#252021] rounded-3xl p-8 border border-elara-border-light dark:border-elara-border-dark shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-elara-text-dark dark:text-elara-text-light">
                Password Change Required
              </h2>
              <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
                Security requirement: You must change your initial password before accessing administrative features.
              </p>
            </div>

            {changeError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}

            <form onSubmit={handleMandatoryPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                  Current Password
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
                      <span>Update Password & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

