import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs tracking-wide">
      <ol className="flex items-center flex-wrap gap-1.5 text-elara-text-muted dark:text-elara-text-muted-dark">
        <li className="flex items-center">
          <Link
            to="/"
            className="hover:text-elara-accent-light dark:hover:text-elara-accent-dark transition-colors flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 opacity-50" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-elara-accent-light dark:hover:text-elara-accent-dark transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-elara-text-dark dark:text-elara-text-light truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

