/**
 * Breadcrumb Component
 *
 * Displays navigation breadcrumbs with clickable links.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <div className={`bg-[var(--cotton)] border-b border-[var(--ink-10)] py-4 mb-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-sm tracking-wide">
          {items.map((item, index) => (
            <React.Fragment key={item.to}>
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-muted-dark">{item.label}</span>
              ) : (
                <Link
                  to={item.to}
                  className="text-muted-dark hover:text-gold transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;