import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { PRODUCTS } from '../data/products';

interface WishlistContextType {
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  moveToCart: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'elara_co_wishlist_v1';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistProductIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistProductIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistProductIds.includes(productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlistProductIds((prev) => prev.filter((id) => id !== product.id));
      showToast(`Removed "${product.name}" from your wishlist`, 'info');
    } else {
      setWishlistProductIds((prev) => [...prev, product.id]);
      showToast(`Saved "${product.name}" to your wishlist`, 'success', 'Wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const moveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const clearWishlist = () => {
    setWishlistProductIds([]);
  };

  // Hydrate full products from IDs
  const wishlistProducts = wishlistProductIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <WishlistContext.Provider
      value={{
        wishlistProductIds,
        wishlistProducts,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
        wishlistCount: wishlistProductIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

