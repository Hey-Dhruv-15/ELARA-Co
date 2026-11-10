import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <div className="my-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            Data Stewardship
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2">
            Effective Date: November 2026
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-8 text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or inquire about gifts on ELARA &amp; CO., we collect information strictly necessary to fulfill your orders and personalize your gifting experience:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name, delivery street address, city, state, and postal PIN code.</li>
              <li>Phone number (utilized strictly for courier dispatch SMS updates and WhatsApp order confirmations).</li>
              <li>Email address (for invoice receipts and customer service communication).</li>
              <li>Custom calligraphy gift card messages and recipient names.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              2. How We Safeguard Your Privacy
            </h2>
            <p>
              We treat your personal details with the utmost reverence. We never sell, rent, or trade customer contact details or gift notes to any third-party advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              3. LocalStorage &amp; Cookies
            </h2>
            <p>
              ELARA &amp; CO. uses browser LocalStorage solely to maintain your active shopping bag, saved wishlist items, and light/dark theme preference across sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              4. Contact Our Data Officer
            </h2>
            <p>
              For any questions regarding your data privacy, email us at <a href="mailto:privacy@elaraandco.com" className="text-[#8A4A52] underline">privacy@elaraandco.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

