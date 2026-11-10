import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR } from '../../utils/formatters';
import { ImageWithFallback } from './ImageWithFallback';
import { X, Star, Heart, ShoppingBag, Check, ShieldCheck, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  // Initialize variation defaults
  const handleVariationChange = (name: string, value: string) => {
    setSelectedVariations((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-elara-card-dark rounded-2xl shadow-2xl border border-elara-border-light dark:border-elara-border-dark overflow-hidden max-h-[90vh] flex flex-col md:flex-row animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-elara-card-dark/80 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light backdrop-blur-sm transition-colors border border-elara-border-light dark:border-elara-border-dark"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Gallery Left Column */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-elara-bg-light/50 dark:bg-elara-bg-dark-sec/40">
          <div className="relative rounded-xl overflow-hidden aspect-[4/5] shadow-sm">
            <ImageWithFallback
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              aspectRatio="auto"
              className="w-full h-full object-cover"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-elara-accent-light text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-elara-accent-light ring-2 ring-elara-accent-light/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Right Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs tracking-wider uppercase text-elara-text-muted dark:text-elara-text-muted-dark mb-1.5">
              <span>{product.categoryName}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">In Stock</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl text-elara-text-dark dark:text-elara-text-light font-medium leading-snug">
              {product.name}
            </h2>

            <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark italic mt-1">
              "{product.tagline}"
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
                ({product.reviewCount} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-elara-text-muted dark:text-elara-text-muted-dark line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-4 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Variations */}
            {product.variations &&
              product.variations.map((v) => (
                <div key={v.name} className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light block mb-2">
                    {v.name}: <span className="font-normal text-elara-accent-light">{selectedVariations[v.name] || v.options[0]}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => {
                      const isSelected = (selectedVariations[v.name] || v.options[0]) === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleVariationChange(v.name, opt)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            isSelected
                              ? 'border-elara-accent-light bg-elara-accent-light/10 text-elara-accent-light font-semibold shadow-xs'
                              : 'border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:border-elara-accent-light/50'
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
            <div className="mt-5 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                Quantity:
              </span>
              <div className="flex items-center border border-elara-border-light dark:border-elara-border-dark rounded-lg overflow-hidden bg-elara-bg-light dark:bg-elara-bg-dark">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-sm font-medium text-elara-text-dark dark:text-elara-text-light">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                  className="px-3 py-1.5 text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 mt-6 border-t border-elara-border-light dark:border-elara-border-dark space-y-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 rounded-xl bg-elara-accent-light hover:bg-elara-rosewater-hover text-white font-medium text-sm transition-all shadow-soft flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Add to Shopping Bag</span>
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-center ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                    : 'border-elara-border-light dark:border-elara-border-dark text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="w-full text-center py-2 text-xs font-medium text-elara-accent-light hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Product Details &amp; Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

