import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Home, Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-elara-bg-light dark:bg-elara-bg-dark transition-colors">
      <div className="max-w-md mx-auto space-y-6">
        <Logo variant="mark" size="md" />

        <span className="font-serif text-6xl sm:text-7xl font-bold text-[#8A4A52] dark:text-[#E4A9AE] block tracking-widest opacity-80">
          404
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-elara-text-dark dark:text-elara-text-light">
          A Moment Lost in Time
        </h1>

        <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark leading-relaxed">
          The page or heirloom you were looking for seems to have drifted away like a dried petal on the breeze. Let us guide you back to our curated boutique.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/shop"
            className="px-6 py-3 rounded-xl bg-white dark:bg-elara-card-dark border border-elara-border-light dark:border-elara-border-dark text-elara-text-dark dark:text-elara-text-light hover:border-[#8A4A52] text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-elara-accent-light" />
            <span>Browse All Gifts</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
