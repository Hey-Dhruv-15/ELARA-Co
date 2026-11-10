import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR } from '../../utils/formatters';
import { ImageWithFallback } from './ImageWithFallback';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  aspectRatio?: 'portrait' | 'square';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  aspectRatio = 'portrait',
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white dark:bg-elara-card-dark rounded-xl border border-elara-border-light/70 dark:border-elara-border-dark overflow-hidden transition-all duration-300 hover:shadow-soft-hover dark:hover:shadow-dark-hover hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Link Container */}
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-elara-bg-light-sec/30 dark:bg-elara-bg-dark-sec/50">
        {/* Main Image */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <ImageWithFallback
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            aspectRatio="auto"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="bg-[#8A4A52] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs tracking-wider">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-elara-champagne text-elara-text-dark text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestseller && (
            <span className="bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button (Always visible on mobile, hover slide on desktop) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            inWishlist
              ? 'bg-white/90 text-rose-500 shadow-sm'
              : 'bg-white/80 dark:bg-elara-card-dark/80 text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light hover:scale-110 shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        {onQuickView && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex justify-center">
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="px-4 py-2 bg-white/95 dark:bg-elara-card-dark/95 backdrop-blur-md text-elara-text-dark dark:text-elara-text-light rounded-lg text-xs font-medium shadow-md hover:bg-elara-accent-light hover:text-white transition-all flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark mb-1">
            <span className="truncate max-w-[120px]">{product.categoryName}</span>
            <div className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="block font-serif text-sm sm:text-base font-normal text-elara-text-dark dark:text-elara-text-light hover:text-elara-accent-light dark:hover:text-elara-accent-dark transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark line-clamp-1 mt-0.5 italic">
            {product.tagline}
          </p>
        </div>

        {/* Price and Add to Bag */}
        <div className="pt-3 mt-2 border-t border-elara-border-light/60 dark:border-elara-border-dark flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-serif font-bold text-base sm:text-lg text-elara-text-dark dark:text-elara-text-light">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec hover:bg-elara-accent-light hover:text-white dark:hover:bg-elara-accent-dark text-elara-text-dark dark:text-elara-text-light text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

