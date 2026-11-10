import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatINR, formatDate } from '../utils/formatters';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
  ChevronDown,
  Gift,
  Feather,
  Clock,
  MapPin,
  MessageSquare,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = PRODUCTS.find((p) => p.id === id);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  // Pincode check state
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // Customer Reviews state
  const [reviewsList, setReviewsList] = useState<Review[]>(product?.reviews || []);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-3xl font-medium text-elara-text-dark dark:text-elara-text-light mb-3">
          Gift Not Found
        </h2>
        <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark max-w-sm mb-6">
          The artisanal treasure you are seeking may have retired or the link might be mistyped.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Explore All Boutique Gifts
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleVariationSelect = (name: string, value: string) => {
    setSelectedVariations((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariations);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus(`Available! Standard dispatch in 24 hrs. Delivery to ${pincode} in 2-4 days.`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please provide your name and review text', 'warning');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      title: newReviewTitle.trim() || 'Aesthetic delight!',
      comment: newReviewComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsWriteReviewOpen(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Thank you! Your verified review has been published.', 'success', 'Review Submitted');
  };

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.categoryName, to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />

        {/* Top Product Section: Left Gallery, Right Details */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Gallery: Vertical Thumbnails + Large Main Image */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0 sm:max-h-[580px]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#8A4A52] ring-2 ring-[#8A4A52]/20'
                        : 'border-elara-border-light dark:border-elara-border-dark opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Stage */}
            <div className="flex-1 relative rounded-3xl overflow-hidden bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-sm aspect-[4/5] sm:aspect-[5/6]">
              <ImageWithFallback
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                aspectRatio="auto"
                className="w-full h-full object-cover"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discountPercentage > 0 && (
                  <span className="bg-[#8A4A52] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md tracking-wider">
                    {product.discountPercentage}% OFF
                  </span>
                )}
                {product.details.handmade && (
                  <span className="bg-elara-champagne text-elara-text-dark text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Artisanal Handmade
                  </span>
                )}
              </div>

              {/* Share & Wishlist overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="p-2.5 rounded-full bg-white/80 dark:bg-elara-card-dark/80 backdrop-blur-md text-elara-text-dark dark:text-elara-text-light hover:scale-105 transition-all shadow-xs border border-elara-border-light dark:border-elara-border-dark"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs border border-elara-border-light dark:border-elara-border-dark ${
                    inWishlist
                      ? 'bg-white/90 text-rose-500'
                      : 'bg-white/80 dark:bg-elara-card-dark/80 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light hover:scale-105'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Details & Buy Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8A4A52] dark:text-[#E4A9AE]">
                <span>{product.categoryName}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-2 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark italic mt-1 font-serif">
                "{product.tagline}"
              </p>

              {/* Rating pill */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <a
                  href="#reviews"
                  className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark hover:underline"
                >
                  {reviewsList.length} Verified Reviews
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-elara-text-dark dark:text-elara-text-light">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-elara-text-muted dark:text-elara-text-muted-dark line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
                Inclusive of all taxes. Free shipping on orders above ₹999.
              </p>
            </div>

            {/* Variations (if any) */}
            {product.variations &&
              product.variations.map((v) => (
                <div key={v.name} className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block">
                    {v.name}:{' '}
                    <span className="font-normal text-[#8A4A52] dark:text-[#E4A9AE]">
                      {selectedVariations[v.name] || v.options[0]}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => {
                      const isSelected = (selectedVariations[v.name] || v.options[0]) === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleVariationSelect(v.name, opt)}
                          className={`px-4 py-2 text-xs rounded-xl border transition-all ${
                            isSelected
                              ? 'border-[#8A4A52] bg-[#8A4A52]/10 text-[#8A4A52] dark:text-[#E4A9AE] font-semibold'
                              : 'border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:border-[#8A4A52]/40'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                Quantity:
              </span>
              <div className="flex items-center border border-elara-border-light dark:border-elara-border-dark rounded-xl overflow-hidden bg-white dark:bg-elara-card-dark">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold text-elara-text-dark dark:text-elara-text-light">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                  className="px-3.5 py-2 text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                ● In Stock ({product.stockCount} left)
              </span>
            </div>

            {/* Add to Bag & Buy Now Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-xl bg-white dark:bg-elara-card-dark border-2 border-[#8A4A52] text-[#8A4A52] dark:text-[#E4A9AE] hover:bg-[#8A4A52]/5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3.5 px-6 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-elara-champagne" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                <MapPin className="w-3.5 h-3.5 text-[#8A4A52] dark:text-elara-accent-dark" />
                <span>Check Delivery &amp; Services</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN code"
                  className="flex-1 px-3.5 py-2 text-xs bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec hover:bg-[#8A4A52] hover:text-white text-xs font-medium rounded-xl transition-colors shrink-0"
                >
                  Verify
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {pincodeStatus}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark pt-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8A4A52]" />
                  <span>{product.details.dispatchTime || 'Dispatches in 24 hrs'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#8A4A52]" />
                  <span>7-day easy return policy</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications, Care & Story */}
        <div className="mt-16 border-t border-elara-border-light dark:border-elara-border-dark pt-10">
          <div className="flex border-b border-elara-border-light dark:border-elara-border-dark gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'details'
                  ? 'text-[#8A4A52] dark:text-elara-accent-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8A4A52]'
                  : 'text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark'
              }`}
            >
              Artisan Craft &amp; Details
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'care'
                  ? 'text-[#8A4A52] dark:text-elara-accent-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8A4A52]'
                  : 'text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark'
              }`}
            >
              Care &amp; Longevity Guide
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative ${
                activeTab === 'shipping'
                  ? 'text-[#8A4A52] dark:text-elara-accent-dark after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8A4A52]'
                  : 'text-elara-text-muted dark:text-elara-text-muted-dark hover:text-elara-text-dark'
              }`}
            >
              Boutique Packaging &amp; Shipping
            </button>
          </div>

          <div className="py-6 max-w-3xl text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {product.details.material && (
                    <div className="p-3 bg-white dark:bg-elara-card-dark rounded-xl border border-elara-border-light dark:border-elara-border-dark">
                      <span className="text-[11px] font-semibold uppercase text-elara-text-dark dark:text-elara-text-light block">
                        Material
                      </span>
                      <span className="mt-0.5 block">{product.details.material}</span>
                    </div>
                  )}
                  {product.details.dimensions && (
                    <div className="p-3 bg-white dark:bg-elara-card-dark rounded-xl border border-elara-border-light dark:border-elara-border-dark">
                      <span className="text-[11px] font-semibold uppercase text-elara-text-dark dark:text-elara-text-light block">
                        Dimensions
                      </span>
                      <span className="mt-0.5 block">{product.details.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-3">
                <p>
                  {product.details.care ||
                    'Handle with gentle care. Keep away from harsh moisture, perfumes, and direct abrasive surfaces to ensure eternal longevity.'}
                </p>
                <p>
                  Each piece includes our printed Artisan Care Card tucked neatly inside the keepsake box.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3">
                <p>
                  {product.details.packaging ||
                    'Wrapped in our signature rosewater blush embossed gift box with double-satin ribbon and wax seal greeting note.'}
                </p>
                <p>
                  Shipped via express surface couriers (Bluedart / Delhivery) with live real-time SMS tracking updates.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-16 border-t border-elara-border-light dark:border-elara-border-dark pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-serif text-2xl font-medium text-elara-text-dark dark:text-elara-text-light">
                Customer Thoughts &amp; Reviews
              </h3>
              <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
                Real feedback from patrons across India who experienced our gifts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsWriteReviewOpen(!isWriteReviewOpen)}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-elara-card-dark border border-[#8A4A52] text-[#8A4A52] dark:text-[#E4A9AE] hover:bg-[#8A4A52] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all self-start sm:self-auto shadow-2xs"
            >
              {isWriteReviewOpen ? 'Close Review Form' : 'Write a Review'}
            </button>
          </div>

          {/* Interactive Review Form */}
          {isWriteReviewOpen && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-10 p-6 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-sm max-w-2xl space-y-4 animate-slide-up"
            >
              <h4 className="font-serif text-base font-medium text-elara-text-dark dark:text-elara-text-light">
                Share Your Experience with {product.name}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Shalini P."
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                    Rating
                  </label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                  >
                    <option value={5}>★★★★★ (5 - Outstanding)</option>
                    <option value={4}>★★★★☆ (4 - Very Good)</option>
                    <option value={3}>★★★☆☆ (3 - Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Even more breathtaking in person!"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tell others about the presentation, packaging, and craftsmanship..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#783c43] transition-colors"
              >
                Submit Verified Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
                    {formatDate(rev.date)}
                  </span>
                </div>

                <h5 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light">
                  {rev.title}
                </h5>

                <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark border-t border-elara-border-light/50 dark:border-elara-border-dark">
                  <span className="font-medium text-elara-text-dark dark:text-elara-text-light flex items-center gap-1">
                    {rev.author}
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        (Verified Buyer)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-elara-border-light dark:border-elara-border-dark pt-12">
            <div className="mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
                Pairs Beautifully With
              </span>
              <h3 className="font-serif text-2xl font-medium text-elara-text-dark dark:text-elara-text-light mt-1">
                You May Also Cherish
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

