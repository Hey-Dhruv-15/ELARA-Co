import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { BackendService } from '../services/backendService';
import { UserOrder, UserAddress } from '../types';
import { formatINR } from '../utils/formatters';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck,
  Edit3,
  Save,
  ArrowRight,
  Truck,
  Calendar,
  Gift,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile, addAddress, openAuthModal } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: 'orders' | 'profile' | 'addresses'
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  // Edit profile form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add address modal / form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<UserAddress, 'id'>>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Orders list
  const [orders, setOrders] = useState<UserOrder[]>([]);

  // Hash check on load (e.g. #orders, #addresses, #profile)
  useEffect(() => {
    if (location.hash === '#orders') setActiveTab('orders');
    else if (location.hash === '#addresses') setActiveTab('addresses');
    else if (location.hash === '#profile') setActiveTab('profile');
  }, [location.hash]);

  // Sync profile data and orders
  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      const userOrders = BackendService.getUserOrders(user.id);
      setOrders(userOrders);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ name: name.trim(), phone: phone.trim() });
    setIsUpdating(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.addressLine1 || !newAddress.city || !newAddress.pincode) {
      return;
    }
    await addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      fullName: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
  };

  // If user is not logged in, show an inviting login landing prompt
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Account' }]} />
        <div className="max-w-xl mx-auto my-12 bg-white dark:bg-elara-card-dark rounded-3xl p-8 sm:p-12 text-center border border-elara-border-light dark:border-elara-border-dark shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark shadow-inner">
            <User className="w-10 h-10" />
          </div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-elara-accent-light dark:text-elara-accent-dark">
            ELARA & CO. Patron Atelier
          </span>
          <h1 className="font-serif text-3xl font-normal text-elara-text-dark dark:text-elara-text-light mt-2 mb-3">
            Sign In to Your Account
          </h1>
          <p className="text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed mb-8 max-w-md mx-auto">
            Access your personalized shopping bag, track artisanal orders in real-time, view your preserved wishlist, and manage boutique delivery addresses.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal()}
              className="px-8 py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-elara-champagne" />
              <span>Sign In / Create Account</span>
            </button>
            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
            >
              Explore Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors duration-300 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My Account', to: '/profile' }]} />

        {/* 1. Patron Banner & Header Card */}
        <div className="mt-6 bg-gradient-to-br from-[#FFF9F7] via-white to-[#F7E9E7]/60 dark:from-[#252021] dark:via-[#191516] dark:to-[#302729] rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-elara-accent-light/10 dark:bg-elara-accent-dark/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=D9A6A5`}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[#8A4A52]/20 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#8A4A52] text-white text-[10px] font-semibold tracking-wider uppercase shadow-sm">
                  {user.role === 'admin' ? '👑 Admin' : user.provider === 'google' ? 'Google' : 'Verified'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-accent-light dark:text-elara-accent-dark flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    ELARA Rosewater Member
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mt-1">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2 justify-center sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-elara-accent-light" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-elara-accent-light" />
                      {user.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-elara-accent-light" />
                    Member since {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold uppercase tracking-wider hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-elara-border-light/70 dark:border-elara-border-dark/60">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#252021]/70 border border-elara-border-light/60 dark:border-elara-border-dark flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-elara-text-dark dark:text-elara-text-light">
                  {orders.length}
                </span>
                <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark uppercase tracking-wider">
                  Total Orders
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#252021]/70 border border-elara-border-light/60 dark:border-elara-border-dark flex items-center gap-3 hover:border-elara-accent-light transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-elara-text-dark dark:text-elara-text-light">
                  {totalItemsCount}
                </span>
                <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark uppercase tracking-wider">
                  In Bag
                </span>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#252021]/70 border border-elara-border-light/60 dark:border-elara-border-dark flex items-center gap-3 hover:border-elara-accent-light transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-elara-text-dark dark:text-elara-text-light">
                  {wishlistCount}
                </span>
                <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark uppercase tracking-wider">
                  Saved Gifts
                </span>
              </div>
            </Link>

            <button
              onClick={() => setActiveTab('addresses')}
              className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#252021]/70 border border-elara-border-light/60 dark:border-elara-border-dark flex items-center gap-3 text-left hover:border-elara-accent-light transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-elara-text-dark dark:text-elara-text-light">
                  {user.addresses?.length || 0}
                </span>
                <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark uppercase tracking-wider">
                  Addresses
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Administrator Atelier Quick Access Banner */}
        {user.role === 'admin' && (
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 dark:from-[#2e191b] dark:via-[#261f18] dark:to-[#2e191b] border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A4A52] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                  Authorized Administrator Session Active
                </h4>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
                  You have full privileges to manage products, categories, orders, and homepage content.
                </p>
              </div>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-5 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#72383f] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs hover:shadow-md transition-all shrink-0"
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 2. Navigation Tabs */}
        <div className="mt-8 flex items-center space-x-2 border-b border-elara-border-light dark:border-elara-border-dark pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'orders'
              ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
              : 'border-transparent text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark dark:hover:text-elara-text-light'
              }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'profile'
              ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
              : 'border-transparent text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark dark:hover:text-elara-text-light'
              }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 py-3 px-5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${activeTab === 'addresses'
              ? 'border-[#8A4A52] text-[#8A4A52] dark:text-elara-accent-dark dark:border-elara-accent-dark'
              : 'border-transparent text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark dark:hover:text-elara-text-light'
              }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses ({user.addresses?.length || 0})</span>
          </button>
        </div>

        {/* 3. Tab Contents */}
        <div className="mt-8">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="bg-white dark:bg-elara-card-dark rounded-3xl p-12 text-center border border-elara-border-light dark:border-elara-border-dark">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F7E9E7] dark:bg-[#302729] flex items-center justify-center text-[#8A4A52] dark:text-elara-accent-dark">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl text-elara-text-dark dark:text-elara-text-light mb-2">
                    No Orders Placed Yet
                  </h3>
                  <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mx-auto mb-6">
                    When you order handcrafted treasures, preserved bouquets, or custom hampers, your live studio tracking will appear here.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-all"
                  >
                    <span>Browse Boutique Collections</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white dark:bg-elara-card-dark rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-elara-border-light/70 dark:border-elara-border-dark/70">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-base text-elara-text-dark dark:text-elara-text-light">
                            Order {order.orderId}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.status || 'In Studio'}
                          </span>
                        </div>
                        <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1 block">
                          Placed on {order.date} • {order.paymentMethod}
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark block">
                          Tracking: <strong className="font-mono text-elara-text-dark dark:text-elara-text-light">{order.trackingNumber}</strong>
                        </span>
                        <span className="font-serif text-lg font-bold text-[#8A4A52] dark:text-elara-accent-dark">
                          {formatINR(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="mt-4 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 py-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-elara-border-light dark:border-elara-border-dark"
                            />
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium text-elara-text-dark dark:text-elara-text-light">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
                                Qty: {item.quantity} • {formatINR(item.product.price)} each
                              </p>
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                            {formatINR(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="mt-4 pt-4 border-t border-elara-border-light/60 dark:border-elara-border-dark/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-elara-text-muted dark:text-elara-text-muted-dark">
                        Delivering to: <strong className="text-elara-text-dark dark:text-elara-text-light">{order.customer.fullName}</strong> ({order.customer.city}, {order.customer.pincode})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Handmade with care & insured transit
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: PERSONAL DETAILS */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white dark:bg-elara-card-dark rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-sm">
              <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light mb-6">
                Personal Atelier Information
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-2 focus:ring-[#8A4A52]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark mb-1.5">
                    Email Address (Verified)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-elara-bg-light/60 dark:bg-elara-bg-dark/60 border border-elara-border-light dark:border-elara-border-dark text-sm text-elara-text-muted cursor-not-allowed"
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-4 top-3.5" />
                  </div>
                  <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-1 block">
                    Account verified via {user.provider === 'google' ? 'Google OAuth' : 'OTP verification'}.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-2 focus:ring-[#8A4A52]"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-3 rounded-xl bg-[#8A4A52] hover:bg-[#723c43] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isUpdating ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light">
                  Saved Delivery Addresses
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#723c43] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Add Address Form Accordion */}
              {showAddressForm && (
                <div className="bg-white dark:bg-elara-card-dark rounded-3xl p-6 sm:p-8 border border-elara-border-light dark:border-elara-border-dark shadow-md animate-fade-in">
                  <h4 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light mb-4">
                    Add Delivery Address
                  </h4>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                          Recipient Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                        Street Address / Flat / Villa *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-elara-text-muted mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-6 py-2.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark text-xs font-semibold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white dark:bg-elara-card-dark rounded-3xl p-6 border border-elara-border-light dark:border-elara-border-dark shadow-sm relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-serif font-bold text-sm text-elara-text-dark dark:text-elara-text-light">
                            {addr.fullName}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/40">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
                          {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                          <br />
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-xs text-elara-text-dark dark:text-elara-text-light mt-2 font-medium flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-elara-accent-light" />
                          {addr.phone}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark col-span-2 py-4">
                    No delivery addresses saved yet. Click "Add New Address" above.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
