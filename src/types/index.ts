export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  category: string; // matches Category slug/id
  categoryName: string;
  collections: string[]; // e.g. 'under-299', 'under-499', 'under-999', 'for-her', 'for-him', 'birthday', 'handmade'
  images: string[];
  description: string;
  details: {
    material?: string;
    dimensions?: string;
    care?: string;
    packaging?: string;
    handmade?: boolean;
    dispatchTime?: string;
  };
  features: string[];
  variations?: {
    name: string; // e.g. "Color", "Size", "Packaging"
    options: string[];
  }[];
  isBestseller?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  inStock: boolean;
  stockCount: number;
  sku: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
  featured?: boolean;
  displayOrder?: number;
}

export interface GiftCollection {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  image: string;
  badge?: string;
  filterKey: string;
  filterValue: string;
  productIds?: string[];
  isVisible?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariation?: Record<string, string>;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercentage: number;
  minAmount?: number;
  description: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  giftMessage?: string;
  isGiftWrap: boolean;
  paymentMethod: 'card' | 'upi' | 'cod';
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  provider: 'google' | 'email' | 'admin';
  role?: 'admin' | 'patron';
  joinedDate: string;
  addresses: UserAddress[];
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderConfirmation {
  orderId: string;
  date: string;
  items: CartItem[];
  customer: CheckoutFormData;
  subtotal: number;
  discount: number;
  giftWrapFee: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
}

export interface UserOrder extends OrderConfirmation {
  status: OrderStatus;
  trackingNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
}

// --- ADMIN SYSTEM TYPES ---

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  mustChangePassword: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
}

export interface HomepageContent {
  hero: {
    headline: string;
    subtitle: string;
    image: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    couponCode: string;
    discountText: string;
  };
  brandStory: {
    headline: string;
    subheading: string;
    paragraph1: string;
    paragraph2: string;
    signatureTitle: string;
    image: string;
  };
  newsletter: {
    headline: string;
    subtitle: string;
  };
}

export interface PageContent {
  slug: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  sections: {
    heading: string;
    body: string;
  }[];
  extraData?: Record<string, any>;
  lastUpdated?: string;
}

export interface DashboardMetrics {
  totalProducts: number;
  totalCategories: number;
  totalCollections: number;
  totalOrders: number;
  recentOrders: UserOrder[];
  lowStockProducts: Product[];
}
