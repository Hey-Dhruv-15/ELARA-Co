import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: 'square' | 'portrait' | 'wide' | 'auto';
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'ELARA & CO. Product',
  fallbackSrc,
  className = '',
  aspectRatio = 'portrait',
  containerClassName = '',
  loading = 'lazy',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Default aesthetic fallback if image fails to load
  const defaultFallback =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="100%" height="100%"><rect width="100%" height="100%" fill="%23F7E9E7"/><g transform="translate(250, 320)"><circle cx="50" cy="50" r="45" fill="%23D9A6A5" opacity="0.4"/><text x="50" y="65" font-family="serif" font-size="44" text-anchor="middle" fill="%2349383B" opacity="0.6">E</text></g><text x="300" y="440" font-family="sans-serif" font-size="16" letter-spacing="3" text-anchor="middle" fill="%238C7375">ELARA &amp; CO.</text><text x="300" y="470" font-family="serif" font-style="italic" font-size="14" text-anchor="middle" fill="%238C7375" opacity="0.8">Little Things. Lasting Feelings.</text></svg>';

  const aspectClass = {
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    wide: 'aspect-[16/9]',
    auto: '',
  }[aspectRatio];

  return (
    <div
      className={`relative overflow-hidden bg-elara-bg-light-sec/50 dark:bg-elara-bg-dark-sec/60 ${aspectClass} ${containerClassName}`}
    >
      {/* Shimmer skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-elara-bg-light-sec via-elara-border-light to-elara-bg-light-sec dark:from-elara-bg-dark-sec dark:via-elara-border-dark dark:to-elara-bg-dark-sec" />
      )}

      <img
        src={hasError ? fallbackSrc || defaultFallback : src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

