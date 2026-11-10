import React from 'react';
import { Instagram, Heart, ExternalLink } from 'lucide-react';

interface InstaPost {
  id: string;
  image: string;
  likes: number;
  caption: string;
  tag: string;
}

export const InstagramFeed: React.FC = () => {
  const posts: InstaPost[] = [
    {
      id: 'ig-1',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
      likes: 482,
      caption: 'Unboxing our Rosewater & Champagne signature hamper ✨',
      tag: '@elaraandco',
    },
    {
      id: 'ig-2',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=600&q=80',
      likes: 615,
      caption: 'Baroque pearls caught in golden hour sunlight 🌸',
      tag: '#elarafreshwater',
    },
    {
      id: 'ig-3',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      likes: 389,
      caption: 'Everlasting preserved blooms that never need water 🌾',
      tag: '#aestheticbouquets',
    },
    {
      id: 'ig-4',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      likes: 541,
      caption: 'Hand-poured soy bubble candles on vintage books 🕯️',
      tag: '#deskstyling',
    },
    {
      id: 'ig-5',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
      likes: 720,
      caption: 'Melting blush sealing wax with brass stamps 💌',
      tag: '#waxsealmagic',
    },
    {
      id: 'ig-6',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
      likes: 432,
      caption: 'Heavy Georgia-green collectible soda glassware 🥤',
      tag: '#retromemories',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-elara-bg-light-sec/30 dark:bg-elara-bg-dark-sec/30 border-t border-elara-border-light/60 dark:border-elara-border-dark transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE] mb-1">
            <Instagram className="w-3.5 h-3.5" />
            <span>@elaraandco on Instagram</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-elara-text-dark dark:text-elara-text-light font-medium">
            Moments Made Beautiful
          </h2>
          <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-2">
            Tag us in your unboxing reels with <strong>#ElaraMoments</strong> to be featured in our monthly community spotlight.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-xl overflow-hidden aspect-square shadow-2xs hover:shadow-soft-hover transition-all duration-300 block bg-elara-bg-light dark:bg-elara-bg-dark"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 text-white text-xs">
                <div className="flex justify-end">
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </div>
                <div>
                  <div className="flex items-center gap-1 font-semibold text-rose-300 mb-1">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{post.likes}</span>
                  </div>
                  <p className="text-[11px] line-clamp-2 leading-tight opacity-90">
                    {post.caption}
                  </p>
                  <span className="text-[10px] text-elara-champagne font-mono block mt-1">
                    {post.tag}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
