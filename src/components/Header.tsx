import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      className={`nav-wrap fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}
      style={{
        background: scrolled ? 'rgba(245,240,235,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--ink-10)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span
            className="font-display italic text-2xl md:text-3xl font-light tracking-tight transition-colors duration-300"
            style={{ color: scrolled ? 'var(--ink)' : 'var(--cotton)' }}
          >
            Brim
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/"
                className="text-xs font-medium tracking-wider uppercase transition-colors duration-300"
                style={{ color: scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)')
                }
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-xs font-medium tracking-wider uppercase transition-colors duration-300"
                style={{ color: scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)')
                }
              >
                Collection
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="text-xs font-medium tracking-wider uppercase transition-colors duration-300 relative"
                style={{ color: scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)')
                }
              >
                Cart
                <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/fitting"
            className="text-xs font-medium tracking-wider uppercase transition-colors duration-300 btn-outline"
            style={{
              color: scrolled ? 'var(--ink)' : 'var(--cotton)',
              borderColor: scrolled ? 'var(--ink-20)' : 'rgba(245,240,235,0.3)',
            }}
          >
            Book a Fitting
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
            style={{ background: scrolled ? 'var(--ink)' : 'var(--cotton)' }}
          />
          <span
            className={`block w-6 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            style={{ background: scrolled ? 'var(--ink)' : 'var(--cotton)' }}
          />
          <span
            className={`block w-6 h-px transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            style={{ background: scrolled ? 'var(--ink)' : 'var(--cotton)' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-6 flex flex-col gap-4"
          style={{
            background: 'var(--cotton)',
            borderColor: 'var(--ink-10)',
          }}
        >
          <Link
            to="/"
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: 'var(--muted-dark)' }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: 'var(--muted-dark)' }}
            onClick={() => setMenuOpen(false)}
          >
            Collection
          </Link>
          <Link
            to="/cart"
            className="text-sm font-medium tracking-wider uppercase"
            style={{ color: 'var(--muted-dark)' }}
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>
          <Link
            to="/fitting"
            className="btn-gold text-center mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Book a Fitting
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
