import {
  AdminUser,
  DashboardMetrics,
  Product,
  Category,
  GiftCollection,
  HomepageContent,
  PageContent,
  UserOrder,
  OrderStatus,
} from '../types';

const ADMIN_TOKEN_KEY = 'elara_admin_token_v1';
const ADMIN_USER_KEY = 'elara_admin_user_v1';

export class AdminService {
  private static getToken(): string | null {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY);
  }

  private static setSession(token: string, admin: AdminUser, remember = true): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(ADMIN_TOKEN_KEY, token);
    storage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
  }

  public static clearSession(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_USER_KEY);
  }

  public static getStoredAdmin(): { admin: AdminUser | null; token: string | null } {
    try {
      const token = this.getToken();
      const userStr = localStorage.getItem(ADMIN_USER_KEY) || sessionStorage.getItem(ADMIN_USER_KEY);
      const admin = userStr ? (JSON.parse(userStr) as AdminUser) : null;
      return { admin, token };
    } catch {
      return { admin: null, token: null };
    }
  }

  private static async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    requiresAuth = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        this.clearSession();
      }
      throw new Error(data.error || `HTTP error ${response.status}`);
    }

    return data;
  }

  // ---------------- AUTHENTICATION ----------------

  public static async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; token: string; admin: AdminUser; mustChangePassword: boolean }> {
    const res = await this.request<{
      success: boolean;
      token: string;
      admin: AdminUser;
    }>('/api/admin/login', 'POST', { email, password }, false);

    this.setSession(res.token, res.admin, true);
    return {
      success: true,
      token: res.token,
      admin: res.admin,
      mustChangePassword: Boolean(res.admin.mustChangePassword),
    };
  }

  public static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    const res = await this.request<{
      success: boolean;
      token: string;
      admin: AdminUser;
      message: string;
    }>('/api/admin/change-password', 'POST', { currentPassword, newPassword }, true);

    this.setSession(res.token, res.admin, true);
    return res;
  }

  public static async getMe(): Promise<AdminUser | null> {
    try {
      const res = await this.request<{ success: boolean; admin: AdminUser }>('/api/admin/me', 'GET', undefined, true);
      return res.admin;
    } catch {
      return null;
    }
  }

  public static async logout(): Promise<void> {
    try {
      await this.request('/api/admin/logout', 'POST', undefined, true);
    } catch {
      // ignore
    } finally {
      this.clearSession();
    }
  }

  // ---------------- DASHBOARD ----------------

  public static async getDashboard(): Promise<DashboardMetrics> {
    const res = await this.request<{ success: boolean; metrics: DashboardMetrics }>(
      '/api/admin/dashboard',
      'GET',
      undefined,
      true
    );
    return res.metrics;
  }

  // ---------------- PRODUCTS ----------------

  public static async getProducts(): Promise<Product[]> {
    const res = await this.request<{ success: boolean; products: Product[] }>(
      '/api/admin/products',
      'GET',
      undefined,
      true
    );
    return res.products;
  }

  public static async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await this.request<{ success: boolean; product: Product }>(
      '/api/admin/products',
      'POST',
      product,
      true
    );
    return res.product;
  }

  public static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await this.request<{ success: boolean; product: Product }>(
      `/api/admin/products/${id}`,
      'PUT',
      updates,
      true
    );
    return res.product;
  }

  public static async deleteProduct(id: string): Promise<void> {
    await this.request(`/api/admin/products/${id}`, 'DELETE', undefined, true);
  }

  // ---------------- IMAGE UPLOAD ----------------

  public static async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await this.request<{ success: boolean; url: string }>(
            '/api/admin/upload',
            'POST',
            {
              filename: file.name,
              mimeType: file.type,
              data: base64Data,
            },
            true
          );
          resolve(res.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // ---------------- CATEGORIES ----------------

  public static async getCategories(): Promise<Category[]> {
    const res = await this.request<{ success: boolean; categories: Category[] }>('/api/categories', 'GET', undefined, false);
    return res.categories;
  }

  public static async createCategory(category: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; category: Category }>(
      '/api/admin/categories',
      'POST',
      category,
      true
    );
    return res.category;
  }

  public static async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await this.request<{ success: boolean; category: Category }>(
      `/api/admin/categories/${id}`,
      'PUT',
      updates,
      true
    );
    return res.category;
  }

  public static async deleteCategory(id: string): Promise<void> {
    await this.request(`/api/admin/categories/${id}`, 'DELETE', undefined, true);
  }

  // ---------------- COLLECTIONS ----------------

  public static async getCollections(): Promise<GiftCollection[]> {
    const res = await this.request<{ success: boolean; collections: GiftCollection[] }>(
      '/api/collections',
      'GET',
      undefined,
      false
    );
    return res.collections;
  }

  public static async createCollection(collection: Partial<GiftCollection>): Promise<GiftCollection> {
    const res = await this.request<{ success: boolean; collection: GiftCollection }>(
      '/api/admin/collections',
      'POST',
      collection,
      true
    );
    return res.collection;
  }

  public static async updateCollection(id: string, updates: Partial<GiftCollection>): Promise<GiftCollection> {
    const res = await this.request<{ success: boolean; collection: GiftCollection }>(
      `/api/admin/collections/${id}`,
      'PUT',
      updates,
      true
    );
    return res.collection;
  }

  public static async deleteCollection(id: string): Promise<void> {
    await this.request(`/api/admin/collections/${id}`, 'DELETE', undefined, true);
  }

  // ---------------- HOMEPAGE CONTENT ----------------

  public static async getHomepageContent(): Promise<HomepageContent> {
    const res = await this.request<{ success: boolean; homepage: HomepageContent }>(
      '/api/content/homepage',
      'GET',
      undefined,
      false
    );
    return res.homepage;
  }

  public static async updateHomepageContent(content: Partial<HomepageContent>): Promise<HomepageContent> {
    const res = await this.request<{ success: boolean; homepage: HomepageContent }>(
      '/api/admin/content/homepage',
      'PUT',
      content,
      true
    );
    return res.homepage;
  }

  // ---------------- WEBSITE PAGES ----------------

  public static async getPages(): Promise<Record<string, PageContent>> {
    const res = await this.request<{ success: boolean; pages: Record<string, PageContent> }>(
      '/api/admin/pages',
      'GET',
      undefined,
      true
    );
    return res.pages;
  }

  public static async getPage(slug: string): Promise<PageContent> {
    const res = await this.request<{ success: boolean; page: PageContent }>(
      `/api/content/pages/${slug}`,
      'GET',
      undefined,
      false
    );
    return res.page;
  }

  public static async updatePage(slug: string, content: Partial<PageContent>): Promise<PageContent> {
    const res = await this.request<{ success: boolean; page: PageContent }>(
      `/api/admin/content/pages/${slug}`,
      'PUT',
      content,
      true
    );
    return res.page;
  }

  // ---------------- ORDERS ----------------

  public static async getOrders(search?: string, status?: string): Promise<UserOrder[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ success: boolean; orders: UserOrder[] }>(
      `/api/admin/orders${query}`,
      'GET',
      undefined,
      true
    );
    return res.orders;
  }

  public static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<UserOrder> {
    const res = await this.request<{ success: boolean; order: UserOrder }>(
      `/api/admin/orders/${orderId}/status`,
      'PUT',
      { status },
      true
    );
    return res.order;
  }
}

