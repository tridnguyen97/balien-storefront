import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Products from './Products';

const Home: React.FC = () => {
  return (
    <main style={{ background: 'var(--cotton)' }}>
      <div className="grain-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Header />

      {/* Hero — macro close-up, cinematic text reveal */}
      <HeroSection />

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium tracking-wide text-muted-dark">Filter by category:</span>
            {['Summer', 'Winter', 'Spring', 'Fall', 'Collection'].map((cat) => (
              <button
                key={cat}
                onClick={() => console.log('Filter:', cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  backgroundColor: '#e8e8e8',
                  color: 'var(--ink)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-wide text-muted-dark">Sort by:</span>
            <select className="bg-background border border-[var(--ink-10)] text-sm text-foreground px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold transition-colors">
              <option value="featured">Featured</option>
              <option value="price">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <Products />
    </main>
  );
};

export default Home;