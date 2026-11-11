import React from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ArrowRight, Gift } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CuratedCollections: React.FC = () => {
  const { collections } = useStore();
  const visibleCollections = collections.filter((c) => c.isVisible !== false);

  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light-sec/30 dark:bg-elara-bg-dark-sec/30 border-t border-elara-border-light/60 dark:border-elara-border-dark transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE] mb-1">
            <Gift className="w-3.5 h-3.5" />
            <span>Curated For Every Occasion &amp; Budget</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Curated Gift Collections
          </h2>
          <div className="flex items-center justify-center w-24 mx-auto mt-3 space-x-2 opacity-50">
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
            <span className="text-xs text-[#8A4A52] dark:text-[#E4A9AE]">✧</span>
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
          </div>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-3">
            Whether shopping on a cozy budget or celebrating someone truly extraordinary, find the ideal hand-wrapped gesture.
          </p>
        </div>

        {/* Curated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visibleCollections.map((col) => (
            <Link
              key={col.id}
              to={`/shop?collection=${col.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-xs hover:shadow-soft-hover dark:hover:shadow-dark-hover transition-all duration-300 flex flex-col justify-end min-h-[260px] p-6 hover:-translate-y-1"
            >
              {/* Background Photography */}
              <div className="absolute inset-0 z-0">
                <ImageWithFallback
                  src={col.image}
                  alt={col.title}
                  aspectRatio="auto"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 transition-opacity group-hover:from-black/90" />
              </div>

              {/* Card Content Overlay */}
              <div className="relative z-10 text-white space-y-1.5">
                {col.badge && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-elara-champagne border border-white/20">
                    {col.badge}
                  </span>
                )}
                <h3 className="font-serif text-xl font-medium tracking-tight group-hover:text-elara-champagne transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {col.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-elara-champagne font-medium tracking-wide">
                  <span>Shop Curations</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
