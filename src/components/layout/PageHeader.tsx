/**
 * Page Header Component
 *
 * Provides consistent page header with breadcrumb navigation and page title.
 */

import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; to: string }>;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  breadcrumbs = [],
  className = '' 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={`mb-8 ${className}`}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <nav className="mb-4 flex items-center text-sm text-ink-40">
          <ol className="flex space-x-2">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => 
                  isActive ? 'text-ink-60 hover:text-gold' : 'text-ink-40 hover:text-ink-60'
                }
              >
                Home
              </NavLink>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <>
                <li aria-hidden="true">/</li>
                <li key={index}>
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-ink-60">{crumb.label}</span>
                  ) : (
                    <NavLink
                      to={crumb.to}
                      end
                      className={({ isActive }) => 
                        isActive ? 'text-ink-60 hover:text-gold' : 'text-ink-40 hover:text-ink-60'
                      }
                    >
                      {crumb.label}
                    </NavLink>
                  )}
                </li>
              </>
            ))}
          </ol>
        </nav>
      )}

      {/* Page Title */}
      <h1 className="text-3xl font-display font-light text-foreground">
        {title}
      </h1>
    </div>
  );
};

export default PageHeader;