import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, UserAddress } from '../types';
import { BackendService } from '../services/backendService';
import { AdminService } from '../services/adminService';
import { useToast } from './ToastContext';

interface AuthModalOptions {
  message?: string;
  onSuccess?: () => void;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string; otpCode?: string }>;
  verifyOtp: (email: string, otp: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  setSessionUser: (user: UserProfile, token?: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<UserAddress>;
  isAuthModalOpen: boolean;
  authModalMessage: string | null;
  openAuthModal: (options?: AuthModalOptions) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState<UserProfile | null>(() => {
    return BackendService.getActiveSession().user;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  // Sync session on mount
  useEffect(() => {
    const session = BackendService.getActiveSession();
    if (session.user) {
      setUser(session.user);
    }
  }, []);

  const openAuthModal = useCallback((options?: AuthModalOptions) => {
    setAuthModalMessage(options?.message || null);
    if (options?.onSuccess) {
      setPendingCallback(() => options.onSuccess);
    } else {
      setPendingCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalMessage(null);
    setPendingCallback(null);
  }, []);

  const executePendingAction = () => {
    if (pendingCallback) {
      const cb = pendingCallback;
      setPendingCallback(null);
      setTimeout(() => cb(), 150);
    }
  };

  const loginWithGoogle = async (
    email = 'patron.elara@gmail.com',
    name = 'Aarav Sharma'
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await BackendService.authenticateWithGoogle(email, name);
      if (res.success) {
        setUser(res.user);
        closeAuthModal();
        showToast(`Welcome back, ${res.user.name}! Authenticated with Google.`, 'success', 'Google Sign-in');
        executePendingAction();
        return true;
      }
      return false;
    } catch (err) {
      showToast('Google authentication failed. Please try manual email.', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await BackendService.requestOtp(email);
      showToast(`Verification code sent! Demo OTP: ${res.otpCode}`, 'info', 'OTP Dispatched');
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const res = await BackendService.verifyOtp(email, otp, fullName);
      if (res.success && res.user) {
        setUser(res.user);
        closeAuthModal();
        showToast(`Welcome to ELARA & CO., ${res.user.name}!`, 'success', 'Authenticated');
        executePendingAction();
        return { success: true };
      }
      return { success: false, error: res.error || 'Verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const setSessionUser = useCallback((userProfile: UserProfile, sessionToken = `tok_${userProfile.id}_${Date.now()}`) => {
    BackendService.setDirectSession(userProfile, sessionToken);
    setUser(userProfile);
  }, []);

  const logout = () => {
    BackendService.logout();
    AdminService.clearSession();
    setUser(null);
    showToast('You have been signed out safely. Come back soon!', 'info', 'Signed Out');
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = BackendService.updateProfile(user.id, updates);
    if (updated) {
      setUser({ ...updated });
      showToast('Profile information updated successfully!', 'success');
      return true;
    }
    return false;
  };

  const addAddress = async (address: Omit<UserAddress, 'id'>): Promise<UserAddress> => {
    if (!user) throw new Error('User not authenticated');
    const newAddr = BackendService.addAddress(user.id, address);
    setUser((prev) => (prev ? { ...prev, addresses: [...prev.addresses, newAddr] } : null));
    showToast('New shipping address saved!', 'success');
    return newAddr;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginWithGoogle,
        requestOtp,
        verifyOtp,
        setSessionUser,
        logout,
        updateProfile,
        addAddress,
        isAuthModalOpen,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

