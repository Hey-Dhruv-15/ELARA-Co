import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Heart, Sparkles, Feather, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BrandStorySection: React.FC = () => {
  const { homepage } = useStore();
  const story = homepage?.brandStory || {
    headline: 'A Little More Thought, A Little More Love.',
    subheading: 'Our Artisanal Philosophy',
    paragraph1:
      'At ELARA & CO., we believe that modern gifting had lost its emotional heartbeat in an ocean of mass-produced plastic and hurried gestures. We set out to change that—one handcrafted treasure at a time.',
    paragraph2:
      'Every freshwater pearl bracelet is patiently hand-knotted by women artisans. Every everlasting bouquet is composed petal by petal from organic preserved blooms. And every gift hamper is packed with fragrant crinkle paper, handwritten calligraphy, and raw-edge ribbons.',
    signatureTitle: 'Curated with Grace & Devotion',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <section className="py-20 sm:py-24 bg-elara-bg-light dark:bg-elara-bg-dark transition-colors overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Mosaic Left */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md border-2 border-white dark:border-elara-border-dark">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80"
                    alt="Handcrafting soy candles with dried petals"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 rounded-2xl bg-[#8A4A52]/10 dark:bg-[#8A4A52]/20 border border-[#8A4A52]/20 text-center">
                  <span className="font-serif italic text-base sm:text-lg text-[#8A4A52] dark:text-[#E4A9AE] block">
                    "Made with patience, received with joy."
                  </span>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-md border-2 border-white dark:border-elara-border-dark">
                  <img
                    src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80"
                    alt="Handmade freshwater pearl bracelet stringing"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md border-2 border-white dark:border-elara-border-dark">
                  <img
                    src={story.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80'}
                    alt="Bespoke luxury gift packaging and wax seals"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Brand Stamp */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 dark:bg-elara-card-dark/95 backdrop-blur-md p-4 rounded-full shadow-2xl border border-elara-border-light dark:border-elara-border-dark hidden sm:block">
              <Logo variant="mark" size="sm" />
            </div>
          </div>

          {/* Narrative Text Right */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
              <Feather className="w-3.5 h-3.5" />
              <span>{story.subheading || 'Our Artisanal Philosophy'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-elara-text-dark dark:text-elara-text-light leading-[1.2]">
              {story.headline}
            </h2>

            <p className="text-sm leading-relaxed text-elara-text-muted dark:text-elara-text-muted-dark">
              {story.paragraph1}
            </p>

            <p className="text-sm leading-relaxed text-elara-text-muted dark:text-elara-text-muted-dark">
              {story.paragraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-elara-border-light/70 dark:border-elara-border-dark">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-[#E4A9AE]">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                    Pure Emotion First
                  </h4>
                  <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                    Designed to spark genuine nostalgia and heartfelt tears of joy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-[#E4A9AE]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                    Conscious Packaging
                  </h4>
                  <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                    100% recyclable boxes, cotton ribbons, and zero synthetic plastics.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8A4A52] dark:text-[#E4A9AE] hover:underline group"
              >
                <span>Read Full Brand Memoir</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
