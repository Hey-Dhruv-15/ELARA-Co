import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface BestsellersGridProps {
  onQuickView?: (product: Product) => void;
}

export const BestsellersGrid: React.FC<BestsellersGridProps> = ({ onQuickView }) => {
  const { products } = useStore();
  const bestsellers = products.filter((p) => p.isBestseller && p.isPublished !== false).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light dark:bg-elara-bg-dark transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A4A52] dark:text-[#E4A9AE] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Timeless Icons</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
              Most Cherished Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-1 max-w-xl">
              From signature rose quartz bracelets to eternal floral bouquets, these are the tokens our customers adore the most.
            </p>
          </div>

          <Link
            to="/shop?filter=bestseller"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A4A52] dark:text-[#E4A9AE] hover:underline group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
          ))}
        </div>
      </div>
    </section>
  );
};
