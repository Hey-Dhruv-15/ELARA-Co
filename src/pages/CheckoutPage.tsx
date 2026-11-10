import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckoutFormData, OrderConfirmation } from '../types';
import { formatINR } from '../utils/formatters';
import { generateWhatsAppOrderUrl, BUSINESS_WHATSAPP_CONFIG } from '../utils/whatsapp';
import { Breadcrumb } from '../components/common/Breadcrumb';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Truck,
  Gift,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Printer,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    discount,
    giftWrapFee,
    shippingFee,
    finalTotal,
    isGiftWrap,
    giftMessage,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    giftMessage: giftMessage || '',
    isGiftWrap: isGiftWrap,
    paymentMethod: 'upi',
  });

  const [orderConfirmed, setOrderConfirmed] = useState<OrderConfirmation | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If bag is empty and no order has just been confirmed, redirect prompt
  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark max-w-sm mb-6">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore Boutique
        </Link>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Please provide a valid email';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = 'Please enter a valid 10-digit phone number';
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Delivery address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6)
      errors.pincode = 'Valid 6-digit PIN code required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Generate simulated order confirmation
    const orderId = `ELR-${Date.now().toString().slice(-6)}`;
    const confirmation: OrderConfirmation = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: [...items],
      customer: { ...formData },
      subtotal,
      discount,
      giftWrapFee,
      shippingFee,
      total: finalTotal,
      paymentMethod:
        formData.paymentMethod === 'card'
          ? 'Debit / Credit Card (Demo)'
          : formData.paymentMethod === 'upi'
          ? 'UPI / Instant QR (Demo)'
          : 'Cash on Delivery (Demo)',
    };

    setTimeout(() => {
      setOrderConfirmed(confirmation);
      clearCart();
      setIsSubmitting(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D9A6A5', '#E8D5B7', '#8A4A52', '#F4DEE0'],
      });
    }, 600);
  };

  // WhatsApp Order Handler
  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl(
      items,
      formData,
      subtotal,
      discount,
      giftWrapFee,
      shippingFee,
      finalTotal
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Order Confirmed Celebration View
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-elara-card-dark rounded-3xl border border-elara-border-light dark:border-elara-border-dark p-6 sm:p-10 shadow-soft text-center animate-slide-up space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
                Order Confirmed
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
                Thank You, {orderConfirmed.customer.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-2 leading-relaxed">
                Your order <strong className="font-mono text-elara-text-dark dark:text-elara-text-light">#{orderConfirmed.orderId}</strong> has been received by our studio. We are preparing your keepsakes with love and care.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="text-left p-5 rounded-2xl bg-elara-bg-light-sec/30 dark:bg-elara-bg-dark-sec/40 border border-elara-border-light dark:border-elara-border-dark space-y-4 text-xs">
              <div className="flex justify-between border-b border-elara-border-light/60 dark:border-elara-border-dark pb-3">
                <span className="text-elara-text-muted">Order Date:</span>
                <span className="font-semibold">{orderConfirmed.date}</span>
              </div>
              <div className="flex justify-between border-b border-elara-border-light/60 dark:border-elara-border-dark pb-3">
                <span className="text-elara-text-muted">Delivery Address:</span>
                <span className="font-medium text-right max-w-xs">
                  {orderConfirmed.customer.addressLine1}, {orderConfirmed.customer.city},{' '}
                  {orderConfirmed.customer.state} - {orderConfirmed.customer.pincode}
                </span>
              </div>
              <div className="flex justify-between border-b border-elara-border-light/60 dark:border-elara-border-dark pb-3">
                <span className="text-elara-text-muted">Payment Preference:</span>
                <span className="font-medium">{orderConfirmed.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-serif text-sm font-semibold">Total Amount:</span>
                <span className="font-serif font-bold text-base text-[#8A4A52] dark:text-elara-accent-dark">
                  {formatINR(orderConfirmed.total)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl border border-elara-border-light dark:border-elara-border-dark hover:bg-elara-bg-light-sec text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <Link
                to="/shop"
                className="flex-1 py-3 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />

        <div className="my-6">
          <h1 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Checkout &amp; Delivery Details
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
            Complete your shipping address or place your order directly via WhatsApp.
          </p>
        </div>

        {/* WhatsApp Direct Ordering Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-emerald-950 dark:text-emerald-200">
                Prefer Ordering via WhatsApp?
              </h3>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Chat directly with our boutique concierge at{' '}
                <strong className="font-mono">{BUSINESS_WHATSAPP_CONFIG.displayNumber}</strong>. We'll confirm your items &amp; personalize your card in real-time.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm shrink-0 flex items-center justify-center gap-2"
          >
            <span>Order on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Checkout Form & Order Summary */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Shipping Form Left */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-4">
              <h3 className="font-serif text-base font-medium text-elara-text-dark dark:text-elara-text-light flex items-center gap-2">
                <span>1. Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Shalini Sharma"
                    className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. shalini@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Phone Number (for Courier Tracking SMS) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address Box */}
            <div className="p-6 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-4">
              <h3 className="font-serif text-base font-medium text-elara-text-dark dark:text-elara-text-light">
                2. Shipping Address
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    House / Flat No., Apartment, Street *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="e.g. 402, Rosewood Villa, 4th Cross"
                    className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                  {formErrors.addressLine1 && (
                    <p className="text-[11px] text-rose-500 mt-1">{formErrors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Apartment / Landmark / Locality (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Near Central Park"
                    className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                    {formErrors.state && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 400001"
                      className="w-full px-3.5 py-2.5 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                    />
                    {formErrors.pincode && (
                      <p className="text-[11px] text-rose-500 mt-1">{formErrors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Preferences (Demo Frontend) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-medium text-elara-text-dark dark:text-elara-text-light">
                  3. Payment Method (Demonstration Mode)
                </h3>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-semibold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  Demo Store
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark cursor-pointer hover:bg-elara-bg-light-sec/30">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'upi' }))}
                    className="w-4 h-4 text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <div>
                    <strong className="block text-elara-text-dark dark:text-elara-text-light">
                      UPI / QR Code / NetBanking
                    </strong>
                    <span className="text-[11px] text-elara-text-muted">
                      Google Pay, PhonePe, Paytm, BHIM &amp; major Indian banks
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark cursor-pointer hover:bg-elara-bg-light-sec/30">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'card' }))}
                    className="w-4 h-4 text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <div>
                    <strong className="block text-elara-text-dark dark:text-elara-text-light">
                      Debit / Credit Card
                    </strong>
                    <span className="text-[11px] text-elara-text-muted">
                      Visa, MasterCard, RuPay, American Express
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark cursor-pointer hover:bg-elara-bg-light-sec/30">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData((p) => ({ ...p, paymentMethod: 'cod' }))}
                    className="w-4 h-4 text-[#8A4A52] focus:ring-[#8A4A52]"
                  />
                  <div>
                    <strong className="block text-elara-text-dark dark:text-elara-text-light">
                      Cash on Delivery
                    </strong>
                    <span className="text-[11px] text-elara-text-muted">
                      Pay cash/UPI directly upon doorstep courier arrival
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Order Summary & Confirmation CTA */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="p-6 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-5">
              <h3 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
                Order Review ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-elara-text-dark dark:text-elara-text-light truncate">
                        {item.product.name}
                      </p>
                      <span className="text-[11px] text-elara-text-muted">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-serif font-semibold text-elara-text-dark dark:text-elara-text-light shrink-0">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-elara-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                    {formatINR(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                {giftWrapFee > 0 && (
                  <div className="flex justify-between text-elara-text-muted">
                    <span>Signature Gift Packaging</span>
                    <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                      +{formatINR(giftWrapFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-elara-text-muted">
                  <span>Shipping</span>
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light">
                    {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-3 flex justify-between items-baseline text-sm font-serif">
                  <span className="font-semibold">Total Payable</span>
                  <span className="font-bold text-xl text-[#8A4A52] dark:text-elara-accent-dark">
                    {formatINR(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Keepsake Order...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Place Order ({formatINR(finalTotal)})</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-elara-text-muted dark:text-elara-text-muted-dark leading-tight">
                🔒 Safe &amp; Secure Checkout Demonstration. No live payment gateway will be charged.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

