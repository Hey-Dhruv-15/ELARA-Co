import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { GIFT_COLLECTIONS } from '../../data/collections';
import { formatINR } from '../../utils/formatters';
import { X, RotateCcw, Filter } from 'lucide-react';

export interface FilterState {
  category: string;
  collection: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: string;
  search: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  totalResultsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenMobile = false,
  onCloseMobile,
  totalResultsCount,
}) => {
  const content = (
    <div className="space-y-6 text-elara-text-dark dark:text-elara-text-light">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-elara-border-light dark:border-elara-border-dark pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8A4A52] dark:text-elara-accent-dark" />
          <h3 className="font-serif text-base font-medium">Refine Boutique</h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-elara-accent-light hover:underline flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onFilterChange('category', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              filters.category === 'all'
                ? 'bg-[#8A4A52] text-white'
                : 'hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec text-elara-text-dark dark:text-elara-text-light'
            }`}
          >
            <span>All Categories</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange('category', cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                filters.category === cat.slug
                  ? 'bg-[#8A4A52] text-white font-medium'
                  : 'hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec text-elara-text-dark dark:text-elara-text-light'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.itemCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-3 border-t border-elara-border-light dark:border-elara-border-dark pt-5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
            Max Price: {formatINR(filters.maxPrice)}
          </h4>
        </div>
        <input
          type="range"
          min="200"
          max="2000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
          className="w-full accent-[#8A4A52] cursor-pointer"
        />
        <div className="flex items-center justify-between text-[11px] text-elara-text-muted dark:text-elara-text-muted-dark">
          <span>₹200</span>
          <span>₹1,000</span>
          <span>₹2,000+</span>
        </div>
      </div>

      {/* 3. Gift Collections / Occasions */}
      <div className="space-y-3 border-t border-elara-border-light dark:border-elara-border-dark pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-elara-text-muted dark:text-elara-text-muted-dark">
          Curated For
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onFilterChange('collection', 'all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filters.collection === 'all'
                ? 'bg-[#8A4A52] text-white font-medium'
                : 'hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec text-elara-text-dark dark:text-elara-text-light'
            }`}
          >
            All Collections
          </button>
          {GIFT_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => onFilterChange('collection', col.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                filters.collection === col.slug
                  ? 'bg-[#8A4A52] text-white font-medium'
                  : 'hover:bg-elara-bg-light-sec dark:hover:bg-elara-bg-dark-sec text-elara-text-dark dark:text-elara-text-light'
              }`}
            >
              <span>{col.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. In Stock Filter */}
      <div className="border-t border-elara-border-light dark:border-elara-border-dark pt-5">
        <label className="flex items-center gap-2.5 text-xs text-elara-text-dark dark:text-elara-text-light cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
            className="w-4 h-4 rounded text-[#8A4A52] focus:ring-[#8A4A52] border-elara-border-light dark:border-elara-border-dark"
          />
          <span>In Stock Items Only</span>
        </label>
      </div>
    </div>
  );

  // Desktop view
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-elara-card-dark p-6 rounded-2xl border border-elara-border-light dark:border-elara-border-dark shadow-xs self-start sticky top-28">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white dark:bg-elara-bg-dark p-6 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 animate-slide-up">
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded text-elara-text-muted hover:text-elara-text-dark"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <div className="pt-6 border-t border-elara-border-light dark:border-elara-border-dark mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 rounded-xl bg-[#8A4A52] text-white text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                Apply Filters ({totalResultsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

