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
