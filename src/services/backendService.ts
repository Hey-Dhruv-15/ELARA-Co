import { UserProfile, UserAddress, UserOrder, CartItem, OrderConfirmation } from '../types';

const USERS_STORAGE_KEY = 'elara_users_db_v1';
const OTP_STORE_KEY = 'elara_otp_store_v1';
const ACTIVE_SESSION_KEY = 'elara_active_session_v1';

// Seed demo user accounts if database is empty
const getStoredUsers = (): Record<string, UserProfile> => {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveUsers = (users: Record<string, UserProfile>) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users database', e);
  }
};

export class BackendService {
  /**
   * Request OTP for manual email or Gmail login
   */
  static async requestOtp(email: string): Promise<{ success: boolean; message: string; otpCode: string }> {
    const cleanEmail = email.toLowerCase().trim();
    // Deterministic demo OTP for instant ease of testing: 123456 or 6-digit random
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in session
    const otpStore = JSON.parse(sessionStorage.getItem(OTP_STORE_KEY) || '{}');
    otpStore[cleanEmail] = {
      code: otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };
    sessionStorage.setItem(OTP_STORE_KEY, JSON.stringify(otpStore));

    return {
      success: true,
      message: `Verification OTP dispatched to ${cleanEmail}`,
      otpCode: otp, // surfaced for effortless demo testing
    };
  }

  /**
   * Verify OTP and Login / Register User
   */
  static async verifyOtp(
    email: string,
    enteredOtp: string,
    fullName?: string
  ): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();
    const otpStore = JSON.parse(sessionStorage.getItem(OTP_STORE_KEY) || '{}');
    const record = otpStore[cleanEmail];

    // Accept either the generated OTP or the demo universal code '123456'
    const isValid =
      enteredOtp === '123456' ||
      (record && record.code === enteredOtp && Date.now() <= record.expiresAt);

    if (!isValid) {
      return { success: false, error: 'Invalid or expired OTP. Please enter 123456 or request a new code.' };
    }

    // Look up or create user
    const users = getStoredUsers();
    let user = Object.values(users).find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Create new user profile
      const userId = `usr_${Date.now()}`;
      user = {
        id: userId,
        name: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        provider: 'email',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || cleanEmail)}&backgroundColor=D9A6A5,E8D5B7`,
        addresses: [],
      };
      users[userId] = user;
      saveUsers(users);
    }

    // Generate session token
    const token = `elr_tok_${user.id}_${Date.now()}`;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ token, userId: user.id }));

    return { success: true, user, token };
  }

  /**
   * Google / Gmail One-Click Authentication Flow
   */
  static async authenticateWithGoogle(
    googleEmail = 'patron.elara@gmail.com',
    googleName = 'Aarav Sharma'
  ): Promise<{ success: boolean; user: UserProfile; token: string }> {
    const cleanEmail = googleEmail.toLowerCase().trim();
    const users = getStoredUsers();

    let user = Object.values(users).find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      const userId = `usr_g_${Date.now()}`;
      user = {
        id: userId,
        name: googleName,
        email: cleanEmail,
        provider: 'google',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleName)}&backgroundColor=D9A6A5`,
        addresses: [
          {
            id: 'addr_1',
            fullName: googleName,
            phone: '+91 98765 43210',
            addressLine1: '402, Rosewood Villa, 4th Cross',
            addressLine2: 'Near Central Park, Indiranagar',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            isDefault: true,
          },
        ],
      };
      users[userId] = user;
      saveUsers(users);
    }

    const token = `elr_g_tok_${user.id}_${Date.now()}`;
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ token, userId: user.id }));

    return { success: true, user, token };
  }

  /**
   * Retrieve active authenticated session
   */
  static getActiveSession(): { user: UserProfile | null; token: string | null } {
    try {
      const sessionStr = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!sessionStr) return { user: null, token: null };

      const { token, userId } = JSON.parse(sessionStr);
      const users = getStoredUsers();
      const user = users[userId] || null;

      return { user, token };
    } catch {
      return { user: null, token: null };
    }
  }

  /**
   * Set active session directly (e.g. for unified Admin & Patron sign-in)
   */
  static setDirectSession(user: UserProfile, token: string): void {
    const users = getStoredUsers();
    users[user.id] = user;
    saveUsers(users);
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ token, userId: user.id }));
  }

  /**
   * Terminate active session
   */
  static logout(): void {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  /**
   * User-Specific Cart Backend Management
   */
  static getUserCart(userId: string): CartItem[] {
    try {
      const data = localStorage.getItem(`elara_cart_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUserCart(userId: string, items: CartItem[]): void {
    try {
      localStorage.setItem(`elara_cart_${userId}`, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync user cart', e);
    }
  }

  /**
   * User-Specific Wishlist Backend Management
   */
  static getUserWishlist(userId: string): string[] {
    try {
      const data = localStorage.getItem(`elara_wishlist_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveUserWishlist(userId: string, productIds: string[]): void {
    try {
      localStorage.setItem(`elara_wishlist_${userId}`, JSON.stringify(productIds));
    } catch (e) {
      console.error('Failed to sync user wishlist', e);
    }
  }

  /**
   * User Orders History
   */
  static getUserOrders(userId: string): UserOrder[] {
    try {
      const data = localStorage.getItem(`elara_orders_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addUserOrder(userId: string, order: OrderConfirmation): UserOrder {
    const orders = this.getUserOrders(userId);
    const userOrder: UserOrder = {
      ...order,
      status: 'Pending',
      trackingNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };
    orders.unshift(userOrder);
    localStorage.setItem(`elara_orders_${userId}`, JSON.stringify(orders));
    return userOrder;
  }

  /**
   * Profile Management
   */
  static updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const users = getStoredUsers();
    if (!users[userId]) return null;

    users[userId] = { ...users[userId], ...updates };
    saveUsers(users);
    return users[userId];
  }

  static addAddress(userId: string, address: Omit<UserAddress, 'id'>): UserAddress {
    const users = getStoredUsers();
    const user = users[userId];
    const newAddress: UserAddress = {
      id: `addr_${Date.now()}`,
      ...address,
    };

    if (newAddress.isDefault && user) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    if (user) {
      user.addresses.push(newAddress);
      saveUsers(users);
    }
    return newAddress;
  }
}
