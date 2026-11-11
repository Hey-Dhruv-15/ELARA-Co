import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { BackendService } from '../services/backendService';
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

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    if (user?.id) {
      return BackendService.getUserWishlist(user.id);
    }
    return [];
  });

  // Sync wishlist when active user changes
  useEffect(() => {
    if (user?.id) {
      const userWishlist = BackendService.getUserWishlist(user.id);
      setWishlistProductIds(userWishlist);
    } else {
      setWishlistProductIds([]);
    }
  }, [user?.id]);

  // Sync wishlist to backend storage whenever modified
  useEffect(() => {
    if (user?.id) {
      BackendService.saveUserWishlist(user.id, wishlistProductIds);
    }
  }, [wishlistProductIds, user?.id]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistProductIds.includes(productId);
  };

  const toggleWishlist = (product: Product) => {
    // Require authentication before modifying wishlist
    if (!isAuthenticated || !user) {
      openAuthModal({
        message: 'Please sign in to save gifts to your wishlist',
        onSuccess: () => {
          toggleWishlist(product);
        },
      });
      return;
    }

    if (isInWishlist(product.id)) {
      const updated = wishlistProductIds.filter((id) => id !== product.id);
      setWishlistProductIds(updated);
      BackendService.saveUserWishlist(user.id, updated);
      showToast(`Removed "${product.name}" from your wishlist`, 'info');
    } else {
      const updated = [...wishlistProductIds, product.id];
      setWishlistProductIds(updated);
      BackendService.saveUserWishlist(user.id, updated);
      showToast(`Saved "${product.name}" to your wishlist`, 'success', 'Wishlist');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistProductIds.filter((id) => id !== productId);
    setWishlistProductIds(updated);
    if (user?.id) {
      BackendService.saveUserWishlist(user.id, updated);
    }
  };

  const moveToCart = (product: Product) => {
    if (!isAuthenticated || !user) {
      openAuthModal({
        message: 'Please sign in to move gifts to your shopping bag',
        onSuccess: () => {
          moveToCart(product);
        },
      });
      return;
    }
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const clearWishlist = () => {
    setWishlistProductIds([]);
    if (user?.id) {
      BackendService.saveUserWishlist(user.id, []);
    }
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
