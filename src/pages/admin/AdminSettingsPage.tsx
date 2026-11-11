import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Lock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { admin, changePassword } = useAdminAuth();
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword === 'Elara@2026') {
      setErrorMessage('You cannot reuse the default temporary password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPass(false);

    if (res.success) {
      setSuccessMessage('Your administrator password has been updated securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-elara-border-light dark:border-elara-border-dark">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark">
          Access & Credentials
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
          Administrator Settings & Security
        </h1>
      </div>

      {/* 1. Admin Profile Overview Card */}
      <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm">
        <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light pb-3 border-b border-elara-border-light dark:border-elara-border-dark mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-[#8A4A52]" />
          <span>Active Administrator Identity</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/60 dark:border-elara-border-dark">
            <span className="text-elara-text-muted block text-[10px] uppercase font-bold tracking-wider">
              Administrator Name
            </span>
            <span className="font-semibold text-sm text-elara-text-dark dark:text-elara-text-light mt-1 block">
              {admin?.name}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/60 dark:border-elara-border-dark">
            <span className="text-elara-text-muted block text-[10px] uppercase font-bold tracking-wider">
              Authorized Email Address
            </span>
            <span className="font-semibold text-sm text-elara-text-dark dark:text-elara-text-light mt-1 block">
              {admin?.email}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/60 dark:border-elara-border-dark">
            <span className="text-elara-text-muted block text-[10px] uppercase font-bold tracking-wider">
              Access Role
            </span>
            <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 mt-1 block">
              Super Administrator (Full Privileges)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light/60 dark:border-elara-border-dark">
            <span className="text-elara-text-muted block text-[10px] uppercase font-bold tracking-wider">
              Session Status
            </span>
            <span className="font-semibold text-sm text-elara-text-dark dark:text-elara-text-light mt-1 block">
              Cryptographically Signed & Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Change Password Form Card */}
      <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm">
        <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light pb-3 border-b border-elara-border-light dark:border-elara-border-dark mb-5 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#8A4A52]" />
          <span>Change Administrator Password</span>
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
          <div>
            <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
              New Password (Min 8 Characters) *
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
            />
          </div>

          <div>
            <label className="block font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F7] dark:bg-[#191516] border border-elara-border-light dark:border-elara-border-dark"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white font-semibold uppercase tracking-wider transition-all disabled:opacity-60 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security Overview */}
      <div className="bg-white dark:bg-[#252021] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm space-y-4">
        <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light pb-3 border-b border-elara-border-light dark:border-elara-border-dark flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security Architecture & Authorized Staff</span>
        </h2>

        <div className="text-xs text-elara-text-muted leading-relaxed space-y-2">
          <p>
            The ELARA & CO. administrative system operates under zero-trust authorization protocols:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Only 4 pre-authorized staff emails can initiate administrative sessions.</li>
            <li>Passwords are hashed with 10-round bcrypt salted derivations.</li>
            <li>Automatic rate limiting locks accounts for 15 minutes after 5 consecutive failed attempts.</li>
            <li>Tokens expire automatically after 24 hours of inactivity.</li>
            <li>Direct database persistence ensures all product and content modifications remain durable across server reboots.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

