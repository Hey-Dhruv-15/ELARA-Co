import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Logo } from '../components/common/Logo';
import { PageContent } from '../types';
import { Heart, Sparkles, Feather, ShieldCheck, ArrowRight, Flower2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [pageData, setPageData] = useState<PageContent | null>(null);

  useEffect(() => {
    fetch('/api/content/pages/about')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.page) setPageData(data.page);
      })
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Breadcrumb items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <div className="text-center my-10 space-y-4">
          <div className="flex justify-center mb-4">
            <Logo variant="full" size="lg" showTagline={true} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8A4A52] dark:text-[#E4A9AE] block">
            The Artisanal Journey
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-elara-text-dark dark:text-elara-text-light font-medium max-w-2xl mx-auto leading-tight">
            {pageData?.title ? (
              pageData.title
            ) : (
              <>
                Little Things. <br />
                <span className="italic font-normal text-[#8A4A52] dark:text-[#E4A9AE]">
                  Lasting Feelings.
                </span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark max-w-xl mx-auto leading-relaxed">
            {pageData?.subtitle ||
              'Welcome to ELARA & CO., an artisanal boutique studio born out of a quiet rebellion against plastic, impersonal gifting. Here is why we do what we do.'}
          </p>
        </div>

        {/* Editorial Photo Banner */}
        <div className="rounded-3xl overflow-hidden shadow-soft border border-elara-border-light dark:border-elara-border-dark aspect-[16/9] sm:aspect-[21/9] my-10">
          <img
            src={pageData?.heroImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80'}
            alt="Handcrafting gifts at ELARA & CO. studio"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dynamic / Seed Story Sections */}
        <div className="space-y-12 my-12 text-xs sm:text-sm leading-relaxed text-elara-text-muted dark:text-elara-text-muted-dark max-w-3xl mx-auto">
          {pageData?.sections && pageData.sections.length > 0 ? (
            pageData.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light">
                  {sec.heading}
                </h2>
                <p className="whitespace-pre-line leading-relaxed">{sec.body}</p>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light">
                A Little More Thought, A Little More Love.
              </h2>
              <p>
                In a world hurried by convenience and instant deliveries, the soul of gifting was quietly slipping away. Packages arrived in sterile cardboard boxes, filled with disposable plastic wrappers, lacking the intimate warmth of human touch.
              </p>
              <p>
                ELARA &amp; CO. was founded with one guiding principle: <em>a gift should feel like a tender handwritten letter.</em> It should carry the fragrance of pressed lavender, the shimmer of genuine freshwater pearls, and the unmistakable evidence of time, patience, and love.
              </p>
            </div>
          )}

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-elara-border-light dark:border-elara-border-dark">
            <div className="p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark space-y-2">
              <Flower2 className="w-5 h-5 text-[#8A4A52] dark:text-[#E4A9AE]" />
              <h3 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                100% Artisanal
              </h3>
              <p className="text-xs">
                Hand-knotted cords, slow-poured soy wax, and preserved natural florals crafted in small thoughtful batches.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark space-y-2">
              <Heart className="w-5 h-5 text-[#8A4A52] dark:text-[#E4A9AE]" />
              <h3 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                Female Artisans
              </h3>
              <p className="text-xs">
                Proudly partnering with independent female makers and craftswomen, providing dignified fair wages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark space-y-2">
              <Feather className="w-5 h-5 text-[#8A4A52] dark:text-[#E4A9AE]" />
              <h3 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
                Zero Plastic
              </h3>
              <p className="text-xs">
                Recycled paper cartons, cotton drawstring bags, wax seals, and double-satin ribbons you will keep forever.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-elara-bg-light-sec/50 dark:bg-elara-bg-dark-sec border border-elara-border-light dark:border-elara-border-dark text-center space-y-4">
            <span className="font-serif italic text-lg sm:text-xl text-elara-text-dark dark:text-elara-text-light block">
              "We don't sell objects; we package feelings into tangible memories."
            </span>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
            >
              <span>Explore Our Curations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
