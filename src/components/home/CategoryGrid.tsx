import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light dark:bg-elara-bg-dark transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE] block mb-2">
            Curated Boutiques
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center w-24 mx-auto mt-3 space-x-2 opacity-50">
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
            <span className="text-xs text-[#8A4A52] dark:text-[#E4A9AE]">✧</span>
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
          </div>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-3">
            Explore our ten dedicated gift worlds—each crafted to capture feelings and celebrate life's tender milestones.
          </p>
        </div>

        {/* 10 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs hover:shadow-soft-hover dark:hover:shadow-dark-hover transition-all duration-300 flex flex-col hover:-translate-y-1.5"
            >
              {/* Category Image */}
              <div className="relative aspect-square overflow-hidden bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  aspectRatio="square"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Floating Category Tag */}
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 dark:bg-elara-card-dark/90 backdrop-blur-md flex items-center justify-center text-elara-text-dark dark:text-elara-text-light opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#8A4A52] dark:text-elara-accent-dark" />
                </div>
              </div>

              {/* Title & Item Count */}
              <div className="p-3 sm:p-4 text-center flex-1 flex flex-col justify-between">
                <h3 className="font-serif text-xs sm:text-sm font-medium text-elara-text-dark dark:text-elara-text-light group-hover:text-[#8A4A52] dark:group-hover:text-elara-accent-dark transition-colors line-clamp-1">
                  {category.name}
                </h3>
                <span className="text-[10px] text-elara-text-muted dark:text-elara-text-muted-dark uppercase tracking-wider mt-1 block">
                  {category.itemCount}+ Gifts
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

