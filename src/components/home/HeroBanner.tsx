import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { homepage } = useStore();
  const hero = homepage?.hero || {
    headline: 'Little Things. Lasting Feelings.',
    subtitle:
      'Discover thoughtful gifts, handmade treasures and beautiful little things that make every moment unforgettable. Artisanal jewelry, everlasting botanicals, and bespoke curations delivered with pure love.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85',
    primaryButtonText: 'Explore Collection',
    primaryButtonLink: '/shop',
    secondaryButtonText: 'Shop Bestsellers',
    secondaryButtonLink: '/shop?filter=bestseller',
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-elara-bg-light-sec/60 via-elara-bg-light to-transparent dark:from-elara-bg-dark-sec dark:via-elara-bg-dark dark:to-elara-bg-dark pt-8 pb-16 sm:py-20 lg:py-24">
      {/* Subtle background ambient blur decorative elements */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#D9A6A5]/20 dark:bg-[#C99598]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#E8D5B7]/25 dark:bg-[#C8AD89]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Text Left Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-elara-card-dark/80 border border-elara-border-light dark:border-elara-border-dark backdrop-blur-sm shadow-xs text-xs font-medium text-[#8A4A52] dark:text-[#E4A9AE]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase text-[10px] sm:text-xs">
                Handcrafted Boutique Gifting
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-elara-text-dark dark:text-elara-text-light leading-[1.15]">
              {hero.headline.includes('.') ? (
                <>
                  {hero.headline.split('.')[0]}.{' '}
                  <span className="italic block font-normal text-[#8A4A52] dark:text-[#E4A9AE]">
                    {hero.headline.split('.').slice(1).join('.').trim()}
                  </span>
                </>
              ) : (
                hero.headline
              )}
            </h1>

            <p className="text-sm sm:text-base text-elara-text-muted dark:text-elara-text-muted-dark max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                to={hero.primaryButtonLink || '/shop'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>{hero.primaryButtonText || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={hero.secondaryButtonLink || '/shop?filter=bestseller'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark hover:border-[#8A4A52] text-elara-text-dark dark:text-elara-text-light text-xs uppercase tracking-widest font-semibold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4 text-elara-accent-light" />
                <span>{hero.secondaryButtonText || 'Shop Bestsellers'}</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-elara-border-light/60 dark:border-elara-border-dark/60 flex items-center justify-center lg:justify-start gap-6 text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
              <div>
                <strong className="block text-sm font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                  5,000+
                </strong>
                <span>Happy Givers</span>
              </div>
              <div className="h-7 w-[1px] bg-elara-border-light dark:bg-elara-border-dark" />
              <div>
                <strong className="block text-sm font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                  4.9 / 5.0
                </strong>
                <span>Artisan Rating</span>
              </div>
              <div className="h-7 w-[1px] bg-elara-border-light dark:bg-elara-border-dark" />
              <div>
                <strong className="block text-sm font-serif font-bold text-elara-text-dark dark:text-elara-text-light">
                  100%
                </strong>
                <span>Handmade Care</span>
              </div>
            </div>
          </div>

          {/* Editorial Hero Visual Right Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Primary Large Editorial Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 dark:border-elara-card-dark/60 aspect-[4/5] sm:aspect-[5/6]">
                <img
                  src={hero.image}
                  alt="Aesthetic luxury gifts, ribbons, flowers, and packaging by ELARA & CO."
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating caption on image */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 dark:bg-elara-card-dark/90 backdrop-blur-md border border-white/40 dark:border-elara-border-dark shadow-lg">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-elara-accent-light block">
                    Curated Hampers &amp; Keepsakes
                  </span>
                  <p className="font-serif text-sm font-medium text-elara-text-dark dark:text-elara-text-light mt-0.5">
                    "Every box wrapped with raw-edge chiffon, dried florals, and pure intention."
                  </p>
                </div>
              </div>

              {/* Floating Top Badge */}
              <div className="absolute -top-4 -right-4 bg-elara-champagne text-elara-text-dark text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-full shadow-lg border border-white dark:border-elara-card-dark">
                ✨ Pan-India Express Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
