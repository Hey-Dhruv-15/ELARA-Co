import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { formatINR } from '../utils/formatters';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec flex items-center justify-center text-rose-400 mb-5 shadow-inner">
          <Heart className="w-9 h-9" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-md mt-2 mb-8 leading-relaxed">
          Save your favourite aesthetic treasures, floral arrangements, and personalized gifts here to cherish later.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center gap-2"
        >
          <span>Explore Boutique</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Saved Wishlist' }]} />

        <div className="my-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-elara-border-light dark:border-elara-border-dark pb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
              Curated Favorites
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
              Your Saved Keepsakes ({wishlistProducts.length})
            </h1>
            <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
              Move items straight to your bag whenever you're ready to treat yourself or loved ones.
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="text-xs text-elara-text-muted hover:text-rose-500 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="relative group bg-white dark:bg-elara-card-dark rounded-2xl border border-elara-border-light dark:border-elara-border-dark overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-soft-hover transition-all"
            >
              {/* Product Card Top */}
              <ProductCard product={product} />

              {/* Move to Bag Button */}
              <div className="p-3 bg-elara-bg-light-sec/30 dark:bg-elara-bg-dark-sec/30 border-t border-elara-border-light/60 dark:border-elara-border-dark">
                <button
                  type="button"
                  onClick={() => moveToCart(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

