import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Truck, ShieldCheck, Clock, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Breadcrumb items={[{ label: 'Shipping Policy' }]} />

        <div className="my-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
            Delivery Guidelines
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2">
            Last updated: November 2026
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark shadow-soft space-y-8 text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              1. Processing &amp; Dispatch Timeline
            </h2>
            <p>
              Every ELARA &amp; CO. parcel is individually wrapped with artistic precision.
              Standard non-personalized orders are dispatched within <strong>24 to 48 hours</strong> of order placement from our Indiranagar, Bengaluru atelier.
            </p>
            <p>
              Custom engraved jewelry and personalized calligraphy requests require an additional 24 hours of artisan handcrafting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              2. Shipping Charges
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Orders ₹999 and above:</strong> 100% FREE Express Insured Shipping.
              </li>
              <li>
                <strong>Orders below ₹999:</strong> Flat nominal shipping fee of ₹79 applied across all Indian states and union territories.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              3. Estimated Delivery Times
            </h2>
            <p>
              We partner with Tier-1 express air and surface couriers (Bluedart, Delhivery, Expressbees) to ensure timely arrival:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Metro Cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata): <strong>2–3 business days</strong>.</li>
              <li>Tier-2 &amp; Tier-3 Regional Locations: <strong>3–5 business days</strong>.</li>
              <li>Northeast &amp; Remote Island Pin Codes: <strong>5–7 business days</strong>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-lg font-medium text-elara-text-dark dark:text-elara-text-light">
              4. Real-time Tracking &amp; Notifications
            </h2>
            <p>
              Upon dispatch, a live tracking link and AWB number are immediately sent via SMS and Email to the contact information provided during checkout.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

