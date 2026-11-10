import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'Return & Refund Policy' }]} />

        <div className="my-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            Customer Satisfaction
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
            Return &amp; Refund Policy
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2">
            7-Day Hassle-Free Gifting Guarantee
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-8 text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              1. 7-Day Return Window
            </h2>
            <p>
              We want you and your loved ones to be completely overjoyed with every treasure from ELARA &amp; CO. If for any reason an item fails to meet your expectations, you may initiate a return within <strong>7 days</strong> of delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              2. Return Eligibility Conditions
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Product must be in original, unused, and pristine condition.</li>
              <li>Must retain all original packaging, tags, velvet pouches, and keepsake gift boxes.</li>
              <li>Preserved florals and candles must not show signs of handling, burning, or trimming.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              3. Non-Returnable Items
            </h2>
            <p>
              Due to their custom nature, products that have been customized with specific initials, custom names, or specialized engravings cannot be accepted for return, unless they arrived damaged or with a defect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              4. Refund Processing
            </h2>
            <p>
              Once your return parcel arrives back at our Bengaluru atelier and passes quality inspection, your refund is initiated within <strong>48 hours</strong> to the original payment source or UPI account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

