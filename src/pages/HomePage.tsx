import React, { useState } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { TrendingCarousel } from '../components/home/TrendingCarousel';
import { BestsellersGrid } from '../components/home/BestsellersGrid';
import { CuratedCollections } from '../components/home/CuratedCollections';
import { BrandStorySection } from '../components/home/BrandStorySection';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen">
      {/* A. Hero Banner */}
      <HeroBanner />

      {/* B. Shop by Category */}
      <CategoryGrid />

      {/* C. Trending Now Horizontal Carousel */}
      <TrendingCarousel onQuickView={(p) => setQuickViewProduct(p)} />

      {/* D. Bestsellers Grid */}
      <BestsellersGrid onQuickView={(p) => setQuickViewProduct(p)} />

      {/* E. Gift Collections (Under 299, 499, 999, For Her, For Him, etc.) */}
      <CuratedCollections />

      {/* F. Brand Story */}
      <BrandStorySection />

      {/* G. Instagram-Style Gallery */}
      <InstagramFeed />

      {/* H. Newsletter Section */}
      <NewsletterSection />

      {/* Shared Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

