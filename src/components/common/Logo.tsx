import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'horizontal' | 'mark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'compact',
  showTagline = false,
  size = 'md',
}) => {
  // Height configurations
  const heightClasses = {
    sm: variant === 'full' ? 'h-14' : 'h-8',
    md: variant === 'full' ? 'h-20' : 'h-11',
    lg: variant === 'full' ? 'h-28' : 'h-16',
    xl: variant === 'full' ? 'h-36' : 'h-20',
  }[size];

  return (
    <Link
      to="/"
      aria-label="ELARA & CO. Home"
      className={`inline-flex flex-col items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-elara-accent-light rounded ${className}`}
    >
      {variant === 'mark' ? (
        // Just the iconic lily flower mark
        <svg
          viewBox="0 0 100 100"
          className={`${heightClasses} w-auto transition-transform duration-300 group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#glow)">
            {/* Lily petals */}
            <path
              d="M50 50 C40 25 35 12 50 2 C65 12 60 25 50 50 Z"
              fill="url(#petalGrad1)"
              opacity="0.95"
            />
            <path
              d="M50 50 C70 35 88 32 96 46 C86 58 72 55 50 50 Z"
              fill="url(#petalGrad2)"
              opacity="0.92"
            />
            <path
              d="M50 50 C68 62 82 78 72 92 C58 88 56 68 50 50 Z"
              fill="url(#petalGrad3)"
              opacity="0.95"
            />
            <path
              d="M50 50 C38 68 28 86 14 78 C12 62 32 56 50 50 Z"
              fill="url(#petalGrad1)"
              opacity="0.9"
            />
            <path
              d="M50 50 C28 42 12 36 8 22 C22 16 36 32 50 50 Z"
              fill="url(#petalGrad2)"
              opacity="0.95"
            />
            {/* Center pistils and stamens */}
            <circle cx="50" cy="50" r="4" fill="#D97706" />
            <path d="M50 50 Q56 40 60 36" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="60" cy="36" r="1.5" fill="#78350F" />
            <path d="M50 50 Q52 38 48 32" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="48" cy="32" r="1.5" fill="#78350F" />
            <path d="M50 50 Q42 44 38 42" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="38" cy="42" r="1.5" fill="#78350F" />
          </g>
          <defs>
            <linearGradient id="petalGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="petalGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>
            <linearGradient id="petalGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="70%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
            <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#C2410C" floodOpacity="0.15" />
            </filter>
          </defs>
        </svg>
      ) : variant === 'full' || showTagline ? (
        // Full authentic brand logo with lily flower, ELARA & Co. typography, tagline, and star ornament
        <div className="flex flex-col items-center select-none text-center">
          <div className="relative flex items-center justify-center">
            {/* The signature watercolor lily flower on top-right of typography */}
            <div className="absolute -top-7 -right-7 sm:-top-8 sm:-right-8 w-14 h-14 sm:w-16 sm:h-16 pointer-events-none transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
                <g>
                  {/* Top center petal */}
                  <path d="M50 50 C44 26 36 10 52 2 C68 12 60 28 50 50 Z" fill="#FB923C" opacity="0.95" />
                  <path d="M50 50 C46 30 42 16 52 5 C62 14 58 32 50 50 Z" fill="#EA580C" opacity="0.4" />
                  {/* Right petal */}
                  <path d="M50 50 C68 34 86 32 96 46 C86 58 70 56 50 50 Z" fill="#F97316" opacity="0.95" />
                  <path d="M50 50 C66 38 80 38 90 48 C80 54 68 52 50 50 Z" fill="#C2410C" opacity="0.35" />
                  {/* Bottom right petal */}
                  <path d="M50 50 C66 62 80 78 70 92 C58 86 56 68 50 50 Z" fill="#EA580C" opacity="0.9" />
                  {/* Bottom left petal */}
                  <path d="M50 50 C38 68 28 86 14 78 C12 62 32 56 50 50 Z" fill="#FDBA74" opacity="0.92" />
                  {/* Left petal */}
                  <path d="M50 50 C28 42 12 36 8 22 C22 16 36 32 50 50 Z" fill="#FB923C" opacity="0.95" />
                  {/* Petal texture freckles */}
                  <circle cx="52" cy="38" r="1" fill="#7C2D12" />
                  <circle cx="48" cy="32" r="0.9" fill="#7C2D12" />
                  <circle cx="55" cy="28" r="0.8" fill="#7C2D12" />
                  <circle cx="62" cy="45" r="1" fill="#7C2D12" />
                  <circle cx="68" cy="48" r="0.8" fill="#7C2D12" />
                  <circle cx="42" cy="46" r="0.9" fill="#7C2D12" />
                  <circle cx="36" cy="42" r="0.8" fill="#7C2D12" />
                  <circle cx="56" cy="62" r="0.9" fill="#7C2D12" />
                  {/* Stamens */}
                  <path d="M50 50 Q56 40 60 36" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="60" cy="36" r="1.3" fill="#78350F" />
                  <path d="M50 50 Q52 36 49 30" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="49" cy="30" r="1.3" fill="#78350F" />
                  <path d="M50 50 Q44 42 38 40" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="38" cy="40" r="1.3" fill="#78350F" />
                </g>
              </svg>
            </div>

            {/* Brand Title: ELARA & CO. */}
            <div className="flex items-baseline tracking-widest transition-colors duration-300">
              <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#8A4A52] dark:text-[#E4A9AE] tracking-[0.18em]">
                ELARA
              </span>
              <span className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-[#8A4A52] dark:text-[#E4A9AE] ml-2 tracking-normal">
                &amp; Co.
              </span>
            </div>
          </div>

          {/* Authentic Calligraphy Tagline: "The extraordinary, made personal." */}
          <div className="mt-1 font-serif italic text-xs sm:text-sm md:text-base text-[#8A4A52]/90 dark:text-[#E4A9AE]/90 tracking-wide">
            The extraordinary, made personal.
          </div>

          {/* Authentic Elegant Star Divider */}
          <div className="flex items-center justify-center w-full max-w-[200px] mt-1 space-x-2 opacity-60">
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
            <span className="text-[10px] text-[#8A4A52] dark:text-[#E4A9AE]">✧</span>
            <span className="h-[0.5px] flex-1 bg-[#8A4A52] dark:bg-[#E4A9AE]" />
          </div>
        </div>
      ) : (
        // Compact version for Navbar
        <div className="relative flex items-center pr-3 select-none">
          <div className="flex items-baseline tracking-widest transition-colors duration-300">
            <span className="font-serif text-xl sm:text-2xl md:text-[26px] font-normal text-[#8A4A52] dark:text-[#E4A9AE] tracking-[0.16em]">
              ELARA
            </span>
            <span className="font-serif text-sm sm:text-base md:text-lg font-normal text-[#8A4A52] dark:text-[#E4A9AE] ml-1.5 tracking-tight">
              &amp; Co.
            </span>
          </div>

          {/* Micro Lily Flower Accent positioned over the & Co. */}
          <div className="absolute -top-3.5 -right-3 w-8 h-8 pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="none">
              <path d="M50 50 C44 26 36 10 52 2 C68 12 60 28 50 50 Z" fill="#FB923C" opacity="0.95" />
              <path d="M50 50 C68 34 86 32 96 46 C86 58 70 56 50 50 Z" fill="#F97316" opacity="0.95" />
              <path d="M50 50 C66 62 80 78 70 92 C58 86 56 68 50 50 Z" fill="#EA580C" opacity="0.9" />
              <path d="M50 50 C38 68 28 86 14 78 C12 62 32 56 50 50 Z" fill="#FDBA74" opacity="0.92" />
              <path d="M50 50 C28 42 12 36 8 22 C22 16 36 32 50 50 Z" fill="#FB923C" opacity="0.95" />
              <circle cx="50" cy="50" r="3" fill="#B45309" />
            </svg>
          </div>
        </div>
      )}
    </Link>
  );
};

