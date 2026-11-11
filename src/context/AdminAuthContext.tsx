import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../types';
import { AdminService } from '../services/adminService';
import { useToast } from './ToastContext';

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean; admin?: AdminUser; token?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string; admin?: AdminUser; token?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [admin, setAdmin] = useState<AdminUser | null>(() => AdminService.getStoredAdmin().admin);
  const [token, setToken] = useState<string | null>(() => AdminService.getStoredAdmin().token);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify session on mount
  useEffect(() => {
    const verify = async () => {
      const stored = AdminService.getStoredAdmin();
      if (stored.token) {
        const verifiedAdmin = await AdminService.getMe();
        if (verifiedAdmin) {
          setAdmin(verifiedAdmin);
          setToken(stored.token);
        } else {
          setAdmin(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    verify();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; mustChangePassword?: boolean; admin?: AdminUser; token?: string }> => {
    setIsLoading(true);
    try {
      const res = await AdminService.login(email, password);
      setAdmin(res.admin);
      setToken(res.token);

      if (res.mustChangePassword) {
        showToast('First login detected: Please update your initial password.', 'info', 'Security Notice');
      } else {
        showToast(`Welcome back, ${res.admin.name}!`, 'success', 'Admin Portal Access Granted');
      }

      return {
        success: true,
        mustChangePassword: res.mustChangePassword,
        admin: res.admin,
        token: res.token,
      };
    } catch (err: any) {
      const errorMsg = err.message || 'Authentication failed. Please verify your credentials.';
      showToast(errorMsg, 'error', 'Admin Access Denied');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; admin?: AdminUser; token?: string }> => {
    setIsLoading(true);
    try {
      const res = await AdminService.changePassword(currentPassword, newPassword);
      setAdmin(res.admin);
      setToken(res.token);
      showToast('Admin password changed successfully! Your portal is fully unlocked.', 'success', 'Security Updated');
      return { success: true, admin: res.admin, token: res.token };
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to change password.';
      showToast(errorMsg, 'error', 'Password Error');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    AdminService.logout();
    setAdmin(null);
    setToken(null);
    showToast('Admin session terminated safely.', 'info', 'Logged Out');
  }, [showToast]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(admin && token),
        isLoading,
        mustChangePassword: Boolean(admin?.mustChangePassword),
        login,
        changePassword,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

