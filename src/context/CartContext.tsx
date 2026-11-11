import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, AppliedCoupon } from '../types';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { BackendService } from '../services/backendService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariation?: Record<string, string>) => void;
  removeFromCart: (productId: string, variationKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variationKey?: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  giftWrapFee: number;
  shippingFee: number;
  finalTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isGiftWrap: boolean;
  setIsGiftWrap: (enabled: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  availableCoupons: AppliedCoupon[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 79;
const GIFT_WRAP_PRICE = 49;

export const AVAILABLE_COUPONS: AppliedCoupon[] = [
  {
    code: 'FIRST10',
    discountPercentage: 10,
    description: '10% off your first boutique purchase',
  },
  {
    code: 'ELARA20',
    discountPercentage: 20,
    minAmount: 999,
    description: '20% off on premium orders above ₹999',
  },
  {
    code: 'BOUTIQUE15',
    discountPercentage: 15,
    minAmount: 499,
    description: '15% off on orders above ₹499',
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    if (user?.id) {
      return BackendService.getUserCart(user.id);
    }
    return [];
  });

  const [isGiftWrap, setIsGiftWrap] = useState<boolean>(false);
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Sync cart when user logs in, switches, or logs out
  useEffect(() => {
    if (user?.id) {
      const userItems = BackendService.getUserCart(user.id);
      setItems(userItems);
    } else {
      setItems([]);
    }
  }, [user?.id]);

  // Sync cart changes to backend storage for current user
  useEffect(() => {
    if (user?.id) {
      BackendService.saveUserCart(user.id, items);
    }
  }, [items, user?.id]);

  const getVariationKey = (variation?: Record<string, string>): string => {
    if (!variation || Object.keys(variation).length === 0) return '';
    return Object.entries(variation)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariation?: Record<string, string>
  ) => {
    // Require authentication before adding to cart
    if (!isAuthenticated || !user) {
      openAuthModal({
        message: 'Please sign in to add gifts to your shopping bag',
        onSuccess: () => {
          addToCart(product, quantity, selectedVariation);
        },
      });
      return;
    }

    setItems((prevItems) => {
      const targetVarKey = getVariationKey(selectedVariation);
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          getVariationKey(item.selectedVariation) === targetVarKey
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = Math.min(newQty, product.stockCount || 99);
      } else {
        updated = [
          ...prevItems,
          {
            product,
            quantity: Math.min(quantity, product.stockCount || 99),
            selectedVariation,
          },
        ];
      }

      BackendService.saveUserCart(user.id, updated);
      return updated;
    });

    showToast(`Added "${product.name}" to your shopping bag`, 'success', 'Shopping Bag');
  };

  const removeFromCart = (productId: string, variationKey?: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) =>
          item.product.id === productId &&
          (!variationKey || getVariationKey(item.selectedVariation) === variationKey)
      );
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.name}" from bag`, 'info');
      }
      const updated = prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!variationKey || getVariationKey(item.selectedVariation) === variationKey)
          )
      );
      if (user?.id) {
        BackendService.saveUserCart(user.id, updated);
      }
      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number, variationKey?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationKey);
      return;
    }

    setItems((prevItems) => {
      const updated = prevItems.map((item) => {
        if (
          item.product.id === productId &&
          (!variationKey || getVariationKey(item.selectedVariation) === variationKey)
        ) {
          const validQty = Math.min(quantity, item.product.stockCount || 99);
          return { ...item, quantity: validQty };
        }
        return item;
      });
      if (user?.id) {
        BackendService.saveUserCart(user.id, updated);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user?.id) {
      BackendService.saveUserCart(user.id, []);
    }
    setAppliedCoupon(null);
    setIsGiftWrap(false);
    setGiftMessage('');
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.minAmount && subtotal < appliedCoupon.minAmount) {
      // Coupon threshold not met anymore
      setAppliedCoupon(null);
    } else {
      discount = Math.round((subtotal * appliedCoupon.discountPercentage) / 100);
    }
  }

  const giftWrapFee = isGiftWrap ? GIFT_WRAP_PRICE : 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const finalTotal = Math.max(0, subtotal - discount + giftWrapFee + shippingFee);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Invalid promo code. Try FIRST10 or ELARA20' };
    }

    if (found.minAmount && subtotal < found.minAmount) {
      return {
        success: false,
        message: `Code ${found.code} requires a minimum order of ₹${found.minAmount}`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Code "${found.code}" applied! You saved ${found.discountPercentage}%`, 'success', 'Promo Applied');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        discount,
        giftWrapFee,
        shippingFee,
        finalTotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        isGiftWrap,
        setIsGiftWrap,
        giftMessage,
        setGiftMessage,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        availableCoupons: AVAILABLE_COUPONS,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
