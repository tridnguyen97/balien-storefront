  import React from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { RootState } from '../lib/store';
  import { setCategory, setSortBy } from '../lib/filtersSlice';

  const FittingSection: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedCategory, sortBy } = useSelector((state: RootState) => state.filters);

    return (
      <div className="bg-[var(--cotton)] border-b border-[var(--ink-10)] py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium tracking-wide text-muted-dark">Filter by category:</span>
              {['Summer', 'Winter', 'Spring', 'Fall', 'Collection'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => dispatch(setCategory(cat))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-gold text-white'
                      : 'bg-[var(--ink-05)] text-muted-dark hover:bg-[var(--ink-10)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-wide text-muted-dark">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="bg-background border border-[var(--ink-10)] text-sm text-foreground px-3 py-1.5 rounded-lg focus:outline-none focus:border-gold
  transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default FittingSection;
