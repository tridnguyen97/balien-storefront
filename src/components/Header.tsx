import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch categories from Medusa API
    const mockCategories: Category[] = [
      { id: 'cat_1', name: 'Summer', slug: 'summer' },
      { id: 'cat_2', name: 'Winter', slug: 'winter' },
      { id: 'cat_3', name: 'Accessories', slug: 'accessories' }
    ];
    setCategories(mockCategories);
  }, []);

  return (
    <nav
      className="nav-wrap fixed top-0 left-0 right-0 z-10"
      style={{
        background: 'rgba(245,240,235,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--ink-10)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="font-display italic text-2xl md:text-3xl font-light tracking-tight" style={{ color: 'var(--cotton)' }}>
            Brim
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                style={{ color: 'var(--muted-dark)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-dark)'}
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="font-medium tracking-wider uppercase text-xs transition-colors duration-300"
                style={{ color: 'var(--muted-dark)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-dark)'}
              >
                Collection
              </Link>
            </li>
            <li>
              <Link to="/cart" className="font-medium tracking-wider uppercase text-xs transition-colors duration-300 relative"
                style={{ color: 'var(--muted-dark)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-dark)'}
              >
                Cart
                <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            style={{ background: 'var(--ink)' }} />
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            style={{ background: 'var(--ink)' }} />
          <span className={`block w-6 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            style={{ background: 'var(--ink)' }} />
        </button>

        {/* Mobile Menu */}
        <div className={`md:hidden border-t px-6 py-4 ${menuOpen ? 'block' : 'hidden'} transition-all duration-300`}
          style={{
            background: 'var(--cotton)',
            borderColor: 'var(--ink-10)',
          }}>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block py-2 font-medium text-sm"
                style={{ color: 'var(--ink)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="block py-2 font-medium text-sm"
                style={{ color: 'var(--ink)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                Collection
              </Link>
            </li>
            <li>
              <Link to="/cart" className="block py-2 font-medium text-sm"
                style={{ color: 'var(--ink)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;