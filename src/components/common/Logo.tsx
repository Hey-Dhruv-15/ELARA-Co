import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  variant?: 'full' | 'compact' | 'mark';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  imgClassName = '',
  variant = 'compact',
  showTagline = false,
  size = 'md',
}) => {
  // Height classes based on size and variant
  const sizeClasses = {
    sm: variant === 'full' || showTagline ? 'h-16 sm:h-20' : 'h-10 sm:h-12',
    md: variant === 'full' || showTagline ? 'h-24 sm:h-28' : 'h-14 sm:h-16 md:h-[68px]',
    lg: variant === 'full' || showTagline ? 'h-32 sm:h-36' : 'h-18 sm:h-22',
    xl: variant === 'full' || showTagline ? 'h-40 sm:h-48' : 'h-24 sm:h-28',
  }[size];

  return (
    <Link
      to="/"
      aria-label="ELARA & CO. Home"
      className={`inline-flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-elara-accent-light rounded ${className}`}
    >
      {variant === 'mark' ? (
        // Blossom mark
        <img
          src="/logo-flower.png"
          alt="ELARA & CO. Blossom Mark"
          className={`${sizeClasses} ${imgClassName} w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 drop-shadow-xs`}
        />
      ) : (
        // Official logo with transparent background: Light & Dark editions
        <div className="relative inline-flex items-center justify-center py-1">
          {/* Light Mode Logo (Rosewater Edition) */}
          <img
            src="/logo.png"
            alt="ELARA & CO. - The extraordinary, made personal."
            className={`block dark:hidden ${sizeClasses} ${imgClassName} w-auto object-contain transition-all duration-300 group-hover:scale-102 drop-shadow-xs`}
          />

          {/* Dark Mode Logo (Luxury Gold Edition - Used ONLY in Dark Mode) */}
          <img
            src="/logo-dark.png"
            alt="ELARA & CO. - The extraordinary, made personal. (Dark Edition)"
            className={`hidden dark:block ${sizeClasses} ${imgClassName} w-auto object-contain transition-all duration-300 group-hover:scale-102 drop-shadow-xs`}
          />
        </div>
      )}
    </Link>
  );
};
