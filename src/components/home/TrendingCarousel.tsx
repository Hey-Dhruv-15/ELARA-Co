import React, { useRef } from 'react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

interface TrendingCarouselProps {
  onQuickView?: (product: Product) => void;
}

export const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ onQuickView }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const trendingProducts = PRODUCTS.filter((p) => p.isTrending);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light-sec/40 dark:bg-elara-bg-dark-sec/40 border-y border-elara-border-light/60 dark:border-elara-border-dark transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right Scroll Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8A4A52] dark:text-[#E4A9AE] mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Beloved by Givers</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium">
              Trending Now
            </h2>
            <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-1">
              Handpicked customer favorites making rounds across social feeds this week.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="p-2.5 rounded-full bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:bg-[#8A4A52] hover:text-white dark:hover:bg-elara-accent-dark transition-colors shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="p-2.5 rounded-full bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:bg-[#8A4A52] hover:text-white dark:hover:bg-elara-accent-dark transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] shrink-0 snap-start"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

