import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import {
  Instagram,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-elara-bg-light-sec/80 dark:bg-elara-bg-dark-sec border-t border-elara-border-light dark:border-elara-border-dark transition-colors mt-20">
      {/* 1. Value Proposition Pillars */}
      <div className="border-b border-elara-border-light dark:border-elara-border-dark/80 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-elara-card-dark flex items-center justify-center text-elara-accent-light shrink-0 shadow-xs border border-elara-border-light dark:border-elara-border-dark">
                <Sparkles className="w-5 h-5 text-[#8A4A52] dark:text-elara-accent-dark" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                  Handmade With Love
                </h4>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                  Artisanal small-batch craft
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-elara-card-dark flex items-center justify-center text-elara-accent-light shrink-0 shadow-xs border border-elara-border-light dark:border-elara-border-dark">
                <Truck className="w-5 h-5 text-[#8A4A52] dark:text-elara-accent-dark" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                  Free Shipping &gt; ₹999
                </h4>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                  Express insured courier pan-India
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-elara-card-dark flex items-center justify-center text-elara-accent-light shrink-0 shadow-xs border border-elara-border-light dark:border-elara-border-dark">
                <Heart className="w-5 h-5 text-[#8A4A52] dark:text-elara-accent-dark" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                  Signature Gift Packaging
                </h4>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                  Ribbons &amp; wax seal notes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-elara-card-dark flex items-center justify-center text-elara-accent-light shrink-0 shadow-xs border border-elara-border-light dark:border-elara-border-dark">
                <RefreshCw className="w-5 h-5 text-[#8A4A52] dark:text-elara-accent-dark" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-dark dark:text-elara-text-light">
                  7-Day Easy Returns
                </h4>
                <p className="text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark mt-0.5">
                  Hassle-free guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start">
              <Logo variant="full" size="md" showTagline={true} />
            </div>
            <p className="text-xs leading-relaxed text-elara-text-muted dark:text-elara-text-muted-dark max-w-sm pt-2">
              ELARA &amp; CO. is a dedicated artisanal boutique studio crafting aesthetic gifts,
              handmade jewelry, preserved everlasting botanicals, and bespoke lifestyle treasures.
              Because little things carry lasting feelings.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow ELARA & CO. on Instagram"
                className="w-9 h-9 rounded-full bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark flex items-center justify-center text-elara-text-dark dark:text-elara-text-light hover:text-[#8A4A52] hover:border-[#8A4A52] transition-colors shadow-2xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discover ELARA & CO. on Pinterest"
                className="w-9 h-9 rounded-full bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark flex items-center justify-center text-elara-text-dark dark:text-elara-text-light hover:text-[#8A4A52] hover:border-[#8A4A52] transition-colors shadow-2xs"
              >
                <span className="font-serif font-bold text-sm leading-none">P</span>
              </a>
              <a
                href="mailto:hello@elaraandco.com"
                aria-label="Email ELARA & CO."
                className="w-9 h-9 rounded-full bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark flex items-center justify-center text-elara-text-dark dark:text-elara-text-light hover:text-[#8A4A52] hover:border-[#8A4A52] transition-colors shadow-2xs"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column: Boutique Shop */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
              Boutique
            </h5>
            <ul className="space-y-2 text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
              <li>
                <Link to="/shop" className="hover:text-elara-accent-light transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?category=handmade-bracelets" className="hover:text-elara-accent-light transition-colors">
                  Handmade Bracelets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=aesthetic-bouquets" className="hover:text-elara-accent-light transition-colors">
                  Aesthetic Bouquets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gift-hampers" className="hover:text-elara-accent-light transition-colors">
                  Gift Hampers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=coca-cola-collectibles" className="hover:text-elara-accent-light transition-colors">
                  Coca-Cola Collectibles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=personalized-gifts" className="hover:text-elara-accent-light transition-colors">
                  Personalized Keepsakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Company & Story */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
              <li>
                <Link to="/about" className="hover:text-elara-accent-light transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/about#story" className="hover:text-elara-accent-light transition-colors">
                  Our Artisan Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-elara-accent-light transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-elara-accent-light transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-elara-accent-light transition-colors">
                  Your Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Customer Care & Policies */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-elara-text-dark dark:text-elara-text-light uppercase tracking-wider">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
              <li>
                <Link to="/shipping" className="hover:text-elara-accent-light transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-elara-accent-light transition-colors">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-elara-accent-light transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-elara-accent-light transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="pt-2 text-[11px] leading-relaxed">
                Studio Hours: Mon – Sat (10am – 7pm IST)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="border-t border-elara-border-light dark:border-elara-border-dark/80 py-6 text-center text-xs text-elara-text-muted dark:text-elara-text-muted-dark">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} ELARA &amp; CO. All Rights Reserved. Little Things. Lasting Feelings.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <Link
              to="/admin/login"
              className="hover:text-[#8A4A52] dark:hover:text-elara-accent-dark transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
            >
              <span>Admin Atelier</span>
            </Link>
            <span className="opacity-30">•</span>
            <p className="flex items-center gap-1">
              Designed with <Heart className="w-3 h-3 text-[#8A4A52] fill-current" /> for aesthetic souls
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

