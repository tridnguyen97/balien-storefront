import React from 'react';
import Header from '../components/Header';

const Home: React.FC = () => {
  return (
    <main style={{ background: 'var(--cotton)' }}>
      <div className="grain-overlay" aria-hidden="true" />

      {/* Navigation */}
      <Header />

      {/* Hero — macro close-up, cinematic text reveal */}
      <section className="relative w-full h-[40vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-16">
          <h1 className="font-display italic text-5xl md:text-7xl font-light text-white mb-4 leading-tight">
            The Collection
          </h1>
          <p className="text-muted-dark/80 text-base md:text-lg max-w-lg">
            Handcrafted millinery creations, each piece a testament to traditional craftsmanship meeting contemporary design.
          </p>
        </div>
      </section>

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
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Mock Products */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="group block"
            >
              <div className="relative aspect-square bg-[var(--ink-05)] rounded-lg overflow-hidden border border-[var(--ink-10)] group-hover:border-gold/30 transition-colors duration-300">
                <img
                  src={`/mock-product-${(i % 6) + 1}.jpg`}
                  alt={`Product ${i + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {i < 3 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gold text-white text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-medium tracking-wider text-foreground group-hover:text-gold transition-colors">
                  Elegant Hat {i + 1}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-display font-light text-gold">
                    ${(89.99 + i * 5).toFixed(2)}
                  </span>
                  {i % 2 === 0 && (
                    <span className="text-sm text-muted-dark line-through">
                      ${(120 + i * 5).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;