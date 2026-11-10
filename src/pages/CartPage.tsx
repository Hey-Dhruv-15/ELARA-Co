import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  ShoppingBag,
  Trash2,
  Gift,
  ArrowRight,
  Sparkles,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    giftWrapFee,
    shippingFee,
    finalTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    isGiftWrap,
    setIsGiftWrap,
    giftMessage,
    setGiftMessage,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    availableCoupons,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec flex items-center justify-center text-[#8A4A52] dark:text-[#E4A9AE] mb-5 shadow-inner">
          <ShoppingBag className="w-9 h-9" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mt-2 mb-8 leading-relaxed">
          Looks like you haven't discovered your special keepsake yet. Explore our curated gift collections and handmade bracelets.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Shopping Bag' }]} />

        <div className="my-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Review Your Shopping Bag
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
            {items.length} unique {items.length === 1 ? 'item' : 'items'} ready to be lovingly wrapped.
          </p>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-elara-text-dark dark:text-elara-text-light flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#8A4A52] dark:text-elara-accent-dark" />
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more to unlock{' '}
                  <strong className="text-emerald-700 dark:text-emerald-400">FREE Express Delivery</strong>!
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  🎉 Congratulations! Your order qualifies for FREE Express Shipping!
                </span>
              )}
            </span>
            <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark font-medium">
              {freeShippingPercent}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D9A6A5] to-[#8A4A52] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Cart Items List Left */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item, idx) => {
              const variationText = item.selectedVariation
                ? Object.entries(item.selectedVariation)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ')
                : '';

              return (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs transition-colors"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-elara-border-light dark:border-elara-border-dark bg-elara-bg-light-sec/30"
                  >
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      aspectRatio="auto"
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-serif text-sm sm:text-base font-normal text-elara-text-dark dark:text-elara-text-light hover:text-[#8A4A52] transition-colors truncate block"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          aria-label={`Remove ${item.product.name}`}
                          className="p-1 text-elara-text-muted hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {variationText && (
                        <p className="text-[11px] text-[#8A4A52] dark:text-[#E4A9AE] mt-0.5">
                          {variationText}
                        </p>
                      )}

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-serif font-bold text-sm sm:text-base text-elara-text-dark dark:text-elara-text-light">
                          {formatINR(item.product.price)}
                        </span>
                        {item.product.originalPrice > item.product.price && (
                          <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark line-through">
                            {formatINR(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Line Total */}
                    <div className="pt-3 mt-2 border-t border-elara-border-light/50 dark:border-elara-border-dark flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-elara-border-light dark:border-elara-border-dark rounded-lg overflow-hidden bg-elara-bg-light dark:bg-elara-bg-dark">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-elara-text-dark dark:text-elara-text-light">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif font-semibold text-sm text-elara-text-dark dark:text-elara-text-light">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Premium Gift Wrap Add-on */}
            <div className="p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#8A4A52] rounded focus:ring-[#8A4A52] border-elara-border-light dark:border-elara-border-dark"
                />
                <div>
                  <span className="font-serif text-sm font-medium text-elara-text-dark dark:text-elara-text-light flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-[#8A4A52] dark:text-[#E4A9AE]" />
                    <span>Add Signature Rosewater Gift Packaging (+₹49)</span>
                  </span>
                  <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5 leading-relaxed">
                    Includes rigid embossed blush keepsake box, double-faced silk ribbons, and a wax-sealed handwritten message card.
                  </p>
                </div>
              </label>

              {isGiftWrap && (
                <div className="pt-2 pl-7 animate-fade-in">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark block mb-1">
                    Your Personalized Calligraphy Message Note:
                  </label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="e.g. Happy 25th Birthday Rhea! May this year be as radiant as you are. With love, Ananya."
                    className="w-full p-3 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-[#8A4A52] dark:text-[#E4A9AE] hover:underline flex items-center gap-1.5"
              >
                <span>← Continue Discovering More Gifts</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Right */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="p-6 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-5">
              <h3 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark block mb-1.5">
                  Promotional Coupon
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                      <Tag className="w-4 h-4" />
                      <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercentage}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-emerald-800 dark:text-emerald-300 hover:text-rose-500 font-semibold"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => {
                          setCouponCodeInput(e.target.value.toUpperCase());
                          if (couponError) setCouponError('');
                        }}
                        placeholder="e.g. FIRST10, ELARA20"
                        className="flex-1 px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52] uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec hover:bg-[#8A4A52] hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-500 pl-1">{couponError}</p>
                    )}
                    <div className="pt-1 flex gap-2 flex-wrap text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark">
                      <span>Available:</span>
                      {availableCoupons.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => applyCoupon(c.code)}
                          className="underline hover:text-[#8A4A52] font-mono"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-elara-text-muted dark:text-elara-text-muted-dark">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                    {formatINR(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}

                {giftWrapFee > 0 && (
                  <div className="flex justify-between text-elara-text-muted dark:text-elara-text-muted-dark">
                    <span>Signature Gift Packaging</span>
                    <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                      +{formatINR(giftWrapFee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-elara-text-muted dark:text-elara-text-muted-dark">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                        Free
                      </span>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>

                <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-3 flex justify-between items-baseline text-sm font-serif">
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                    Total Amount
                  </span>
                  <span className="font-bold text-xl text-elara-text-dark dark:text-elara-text-light">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark pt-2">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Insured Delivery</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Artisanal Quality</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

