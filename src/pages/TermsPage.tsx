import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

        <div className="my-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            Legal Information
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2">
            Last modified: November 2026
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-8 text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or placing orders on the ELARA &amp; CO. website (including direct WhatsApp ordering), you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              2. Handcrafted &amp; Artisanal Variations
            </h2>
            <p>
              Many products featured on ELARA &amp; CO. (including baroque freshwater pearl bracelets, crocheted florals, and hand-cast terrazzo ceramics) are made by human hands using natural materials. Slight organic variations in color grain, pearl luster, and dried petal shape are natural hallmarks of authentic craftsmanship and celebrate the uniqueness of each piece.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              3. Pricing &amp; Taxes
            </h2>
            <p>
              All prices shown on the website are in Indian Rupees (INR) and are inclusive of all applicable Goods and Services Tax (GST).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              4. Intellectual Property
            </h2>
            <p>
              All trademarks, photography, product styling, graphics, and logos (including the ELARA &amp; CO. botanical tiger lily mark and wordmark) are the exclusive intellectual property of ELARA &amp; CO.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

