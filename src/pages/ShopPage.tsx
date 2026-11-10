import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { GIFT_COLLECTIONS } from '../data/collections';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { FilterSidebar, FilterState } from '../components/shop/FilterSidebar';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { Product } from '../types';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Search,
  X,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected quick view product
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<3 | 4>(3);

  // Parse initial filters from URL search params
  const initialCategory = searchParams.get('category') || 'all';
  const initialCollection = searchParams.get('collection') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    collection: initialCollection,
    minPrice: 0,
    maxPrice: 2000,
    inStockOnly: false,
    sortBy: initialFilter === 'bestseller' ? 'bestseller' : 'popularity',
    search: initialSearch,
  });

  // Sync state if URL query params change externally
  useEffect(() => {
    const urlCat = searchParams.get('category') || 'all';
    const urlCol = searchParams.get('collection') || 'all';
    const urlSearch = searchParams.get('search') || '';
    const urlFilter = searchParams.get('filter');

    setFilters((prev) => ({
      ...prev,
      category: urlCat,
      collection: urlCol,
      search: urlSearch,
      sortBy: urlFilter === 'bestseller' ? 'bestseller' : prev.sortBy,
    }));
  }, [searchParams]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      // Update URL search parameters
      const newParams = new URLSearchParams(searchParams);
      if (key === 'category') {
        if (value === 'all') newParams.delete('category');
        else newParams.set('category', String(value));
      }
      if (key === 'collection') {
        if (value === 'all') newParams.delete('collection');
        else newParams.set('collection', String(value));
      }
      if (key === 'search') {
        if (!value) newParams.delete('search');
        else newParams.set('search', String(value));
      }
      setSearchParams(newParams);

      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      collection: 'all',
      minPrice: 0,
      maxPrice: 2000,
      inStockOnly: false,
      sortBy: 'popularity',
      search: '',
    });
    setSearchParams(new URLSearchParams());
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Search query
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.categoryName.toLowerCase().includes(query);
        const matchesTag = product.tagline.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesTag) return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Collection
      if (filters.collection !== 'all') {
        if (!product.collections.includes(filters.collection)) {
          return false;
        }
      }

      // Price
      if (product.price > filters.maxPrice) {
        return false;
      }

      // In stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'new':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'bestseller':
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        case 'popularity':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [filters]);

  // Current category name for heading
  const currentCategory = CATEGORIES.find((c) => c.slug === filters.category);
  const currentCollection = GIFT_COLLECTIONS.find((c) => c.slug === filters.collection);

  const activeFiltersCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.collection !== 'all' ? 1 : 0) +
    (filters.maxPrice < 2000 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <div className="min-h-screen bg-elara-bg-light dark:bg-elara-bg-dark transition-colors py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', to: '/shop' },
            ...(currentCategory ? [{ label: currentCategory.name }] : []),
            ...(currentCollection && !currentCategory ? [{ label: currentCollection.title }] : []),
          ]}
        />

        {/* Page Header */}
        <div className="my-6 border-b border-elara-border-light dark:border-elara-border-dark pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A4A52] dark:text-[#E4A9AE]">
                The Boutique Catalogue
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-elara-text-dark dark:text-elara-text-light font-medium mt-1">
                {currentCategory
                  ? currentCategory.name
                  : currentCollection
                  ? currentCollection.title
                  : filters.search
                  ? `Search results for "${filters.search}"`
                  : 'All Aesthetic Gifts & Treasures'}
              </h1>
              <p className="text-xs sm:text-sm text-elara-text-muted dark:text-elara-text-muted-dark mt-1.5 max-w-2xl">
                {currentCategory
                  ? currentCategory.description
                  : currentCollection
                  ? currentCollection.subtitle
                  : 'Explore our complete library of artisan bracelets, preserved botanical arrangements, retro collectibles, and bespoke gift hampers.'}
              </p>
            </div>

            {/* Results Count */}
            <div className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark shrink-0">
              Showing <strong className="text-elara-text-dark dark:text-elara-text-light">{filteredProducts.length}</strong> items
            </div>
          </div>
        </div>

        {/* Controls Bar: Mobile filter toggle, In-page Search, Sort, Grid Layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white dark:bg-elara-card-dark p-3.5 rounded-xl border border-elara-border-light dark:border-elara-border-dark shadow-xs">
          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 rounded-lg bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-elara-text-dark dark:text-elara-text-light text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border border-elara-border-light dark:border-elara-border-dark"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A4A52] dark:text-elara-accent-dark" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#8A4A52] text-white text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Active filter badges */}
            {activeFiltersCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {filters.category !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-xs text-elara-text-dark dark:text-elara-text-light border border-elara-border-light dark:border-elara-border-dark">
                    <span>{currentCategory?.name || filters.category}</span>
                    <button
                      onClick={() => handleFilterChange('category', 'all')}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.collection !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-xs text-elara-text-dark dark:text-elara-text-light border border-elara-border-light dark:border-elara-border-dark">
                    <span>{currentCollection?.title || filters.collection}</span>
                    <button
                      onClick={() => handleFilterChange('collection', 'all')}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec text-xs text-elara-text-dark dark:text-elara-text-light border border-elara-border-light dark:border-elara-border-dark">
                    <span>"{filters.search}"</span>
                    <button
                      onClick={() => handleFilterChange('search', '')}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Controls: Sort Dropdown & Grid View Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark hidden sm:inline">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="appearance-none bg-elara-bg-light dark:bg-elara-bg-dark border border-elara-border-light dark:border-elara-border-dark rounded-lg pl-3 pr-8 py-2 text-xs text-elara-text-dark dark:text-elara-text-light focus:outline-none focus:ring-1 focus:ring-[#8A4A52] font-medium cursor-pointer"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="bestseller">Bestsellers</option>
                  <option value="new">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ArrowUpDown className="w-3 h-3 text-elara-text-muted pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Grid Layout Switcher (Desktop) */}
            <div className="hidden lg:flex items-center border border-elara-border-light dark:border-elara-border-dark rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                aria-label="3-column grid"
                className={`p-2 transition-colors ${
                  gridColumns === 3
                    ? 'bg-[#8A4A52] text-white'
                    : 'bg-white dark:bg-elara-card-dark text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                aria-label="4-column grid"
                className={`p-2 transition-colors ${
                  gridColumns === 4
                    ? 'bg-[#8A4A52] text-white'
                    : 'bg-white dark:bg-elara-card-dark text-elara-text-muted hover:text-elara-text-dark dark:hover:text-elara-text-light'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Products Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isOpenMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            totalResultsCount={filteredProducts.length}
          />

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 ${
                  gridColumns === 4 ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'
                } gap-4 sm:gap-6`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="py-20 px-6 text-center bg-white dark:bg-elara-card-dark rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-xs max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-elara-bg-light-sec dark:bg-elara-bg-dark-sec flex items-center justify-center text-[#8A4A52] dark:text-[#E4A9AE] mx-auto mb-4">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-elara-text-dark dark:text-elara-text-light">
                  No matching treasures found
                </h3>
                <p className="text-xs text-elara-text-muted dark:text-elara-text-muted-dark mt-2 leading-relaxed">
                  We couldn't find any items matching your active filter criteria. Try adjusting the
                  filters or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#8A4A52] hover:bg-[#783c43] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

