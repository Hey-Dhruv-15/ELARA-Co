import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, GiftCollection, HomepageContent, PageContent } from '../types';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { GIFT_COLLECTIONS } from '../data/collections';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  collections: GiftCollection[];
  homepage: HomepageContent;
  refreshData: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

const defaultHomepageContent: HomepageContent = {
  hero: {
    headline: 'Little Things. Lasting Feelings.',
    subtitle:
      'Discover thoughtful gifts, handmade treasures and beautiful little things that make every moment unforgettable. Artisanal jewelry, everlasting botanicals, and bespoke curations delivered with pure love.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1920&q=85',
    primaryButtonText: 'Explore Collection',
    primaryButtonLink: '/shop',
    secondaryButtonText: 'Shop Bestsellers',
    secondaryButtonLink: '/shop?filter=bestseller',
  },
  announcement: {
    enabled: true,
    text: 'UP TO 20% OFF — MAKE EVERY MOMENT SPECIAL',
    couponCode: 'ELARA20',
    discountText: 'Use code ELARA20',
  },
  brandStory: {
    headline: 'A Little More Thought, A Little More Love.',
    subheading: 'The ELARA & CO. Boutique Philosophy',
    paragraph1:
      "ELARA & CO. was born out of a gentle realization: in an increasingly rushed world, the gifts we give should slow down time. We believe a present isn't merely an object—it's an emotional bookmark, a quiet whisper that says 'I saw this and remembered you.'",
    paragraph2:
      'Every keepsake in our atelier is either shaped by artisan hands or thoughtfully curated to evoke serenity, aesthetic warmth, and lasting sentiment. From pure freshwater pearls strung on raw silk to everlasting botanicals that bloom through every season, our creations are little things designed to hold lasting feelings.',
    signatureTitle: 'Curated with Grace & Devotion',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  },
  newsletter: {
    headline: 'Stay in the Loop.',
    subtitle: 'Join our inner circle for secret seasonal drops, bespoke artisan stories, and 10% off your inaugural order.',
  },
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [collections, setCollections] = useState<GiftCollection[]>(GIFT_COLLECTIONS);
  const [homepage, setHomepage] = useState<HomepageContent>(defaultHomepageContent);

  const refreshData = useCallback(async () => {
    try {
      const [prodsRes, catsRes, collsRes, homeRes] = await Promise.all([
        fetch('/api/products').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/categories').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/collections').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/content/homepage').then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      if (prodsRes?.products && Array.isArray(prodsRes.products)) {
        setProducts(prodsRes.products);
      }
      if (catsRes?.categories && Array.isArray(catsRes.categories)) {
        setCategories(catsRes.categories);
      }
      if (collsRes?.collections && Array.isArray(collsRes.collections)) {
        setCollections(collsRes.collections);
      }
      if (homeRes?.homepage) {
        setHomepage(homeRes.homepage);
      }
    } catch (e) {
      console.warn('API sync fallback to bundled data', e);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getProductById = useCallback(
    (idOrSlug: string) => {
      return (
        products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ||
        PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
      );
    },
    [products]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        homepage,
        refreshData,
        getProductById,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

