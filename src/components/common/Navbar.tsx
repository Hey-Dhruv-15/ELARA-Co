import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../data/products';
import { formatINR } from '../../utils/formatters';
import {
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Gift,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Filter search results
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Handmade', path: '/shop?category=handmade-crafts' },
    { name: 'Gifts', path: '/shop?collection=birthday' },
    { name: 'Collections', path: '/shop?collection=for-her' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Promotional Announcement Bar */}
      <div className="bg-[#8A4A52] text-white py-2 px-4 text-center text-[11px] sm:text-xs font-medium tracking-widest uppercase transition-colors">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-elara-champagne animate-pulse-slow" />
          <span>UP TO 20% OFF — MAKE EVERY MOMENT SPECIAL</span>
          <span className="hidden md:inline text-elara-champagne font-serif italic normal-case tracking-normal pl-2">
            Use code <strong className="font-semibold underline tracking-wider uppercase">ELARA20</strong>
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 dark:bg-elara-bg-dark/95 backdrop-blur-md shadow-sm border-elara-border-light dark:border-elara-border-dark py-2.5 sm:py-3'
            : 'bg-elara-bg-light/95 dark:bg-elara-bg-dark/95 backdrop-blur-sm border-elara-border-light/70 dark:border-elara-border-dark py-3.5 sm:py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 -ml-2 rounded-lg text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo with Lily Flower */}
            <div className="flex-shrink-0">
              <Logo variant="compact" size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.16em] font-medium text-elara-text-dark/90 dark:text-elara-text-light/90">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-colors hover:text-elara-accent-light dark:hover:text-elara-accent-dark relative py-1 ${
                      isActive && link.path === location.pathname
                        ? 'text-[#8A4A52] dark:text-elara-accent-dark font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#8A4A52] dark:after:bg-elara-accent-dark'
                        : ''
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Icons: Search, Wishlist, Bag, Theme Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search products"
                className="p-2 rounded-full text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors relative"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link with Badge */}
              <Link
                to="/wishlist"
                aria-label={`Wishlist, ${wishlistCount} items`}
                className="p-2 rounded-full text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8A4A52] text-white text-[10px] font-semibold flex items-center justify-center animate-fade-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Link with Badge */}
              <Link
                to="/cart"
                aria-label={`Shopping Bag, ${totalItemsCount} items`}
                className="p-2 rounded-full text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8A4A52] text-white text-[10px] font-semibold flex items-center justify-center animate-fade-in">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* Theme Toggle (Sun/Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                className="p-2 rounded-full text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec transition-colors"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search Dropdown Bar / Autocomplete Overlay */}
      {isSearchOpen && (
        <div
          ref={searchContainerRef}
          className="w-full bg-white dark:bg-elara-card-dark border-b border-elara-border-light dark:border-elara-border-dark shadow-lg animate-slide-up"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-3xl mx-auto">
              <Search className="absolute left-4 w-5 h-5 text-elara-text-muted dark:text-elara-text-muted-dark" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handmade bracelets, preserved bouquets, hampers..."
                className="w-full pl-12 pr-24 py-3 bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-xl text-sm text-elara-text-dark dark:text-elara-text-light placeholder-elara-text-muted dark:placeholder-elara-text-muted-dark focus:outline-none focus:ring-2 focus:ring-elara-accent-light"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 rounded-lg bg-elara-accent-light hover:bg-elara-rosewater-hover text-white text-xs font-medium transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick Autocomplete Suggestions */}
            {searchQuery.trim() && (
              <div className="max-w-3xl mx-auto mt-3 pt-3 border-t border-elara-border-light/60 dark:border-elara-border-dark">
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark block">
                      Matching Products ({searchResults.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-elara-bg-light dark:hover:bg-elara-bg-dark-sec transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-medium text-elara-text-dark dark:text-elara-text-light truncate">
                              {product.name}
                            </h5>
                            <span className="text-xs font-serif font-bold text-elara-accent-light">
                              {formatINR(product.price)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark text-center py-2">
                    No matching gifts found for "{searchQuery}". Press Enter to view all catalogue items.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[90px] z-30 lg:hidden bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-elara-bg-dark border-r border-elara-border-light dark:border-elara-border-dark shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-up">
            <div className="space-y-6">
              <div className="border-b border-elara-border-light dark:border-elara-border-dark pb-4">
                <Logo variant="full" size="md" showTagline={true} />
              </div>

              {/* Main Links */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-text-muted dark:text-elara-text-muted-dark">
                  Explore Boutique
                </span>
                <nav className="flex flex-col space-y-2">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-between ${
                          isActive && link.path === location.pathname
                            ? 'bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-[#8A4A52] dark:text-elara-accent-dark font-semibold'
                            : 'text-elara-text-dark dark:text-elara-text-light hover:bg-elara-bg-light-sec/50 dark:hover:bg-elara-bg-dark-sec'
                        }`
                      }
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Curated Category Shortcuts */}
              <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-elara-text-muted dark:text-elara-text-muted-dark block mb-2">
                  Popular Categories
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    to="/shop?category=handmade-bracelets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded bg-elara-bg-light dark:bg-elara-bg-dark-sec hover:text-elara-accent-light"
                  >
                    Bracelets
                  </Link>
                  <Link
                    to="/shop?category=aesthetic-bouquets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded bg-elara-bg-light dark:bg-elara-bg-dark-sec hover:text-elara-accent-light"
                  >
                    Bouquets
                  </Link>
                  <Link
                    to="/shop?category=gift-hampers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded bg-elara-bg-light dark:bg-elara-bg-dark-sec hover:text-elara-accent-light"
                  >
                    Gift Hampers
                  </Link>
                  <Link
                    to="/shop?category=coca-cola-collectibles"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded bg-elara-bg-light dark:bg-elara-bg-dark-sec hover:text-elara-accent-light"
                  >
                    Retro Collectibles
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Support & Quick Links */}
            <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-4 mt-6 text-xs text-elara-text-muted dark:text-elara-text-muted-dark space-y-2">
              <div className="flex items-center justify-between">
                <span>Theme Mode</span>
                <button
                  onClick={toggleTheme}
                  className="px-3 py-1 rounded-full border border-elara-border-light dark:border-elara-border-dark text-xs flex items-center gap-1.5"
                >
                  {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
                </button>
              </div>
              <p className="text-[11px] pt-2 text-center">
                Need help? WhatsApp us at +91 98765 43210
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

