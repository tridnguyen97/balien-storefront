import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../lib/store';
import { useSelector } from 'react-redux';
import FittingSection from '../components/FittingSection';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  original_price?: number;
  image: string;
  featured: boolean;
  in_stock: boolean;
  category: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCategory, sortBy } = useSelector((state: RootState) => state.filters);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, currentPage]);

  const fetchProducts = () => {
    const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
      id: `prod_${i + 1}`,
      title: `Elegant Hat ${i + 1}`,
      handle: `elegant-hat-${i + 1}`,
      price: 89.99 + (i * 5),
      original_price: 120 + (i * 5),
      image: `/mock-product-${(i % 6) + 1}.jpg`,
      featured: i < 3,
      in_stock: true,
      category: ['Summer', 'Winter', 'Spring', 'Fall', 'Collection'][i % 5]
    }));
    setProducts(mockProducts);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-dark">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-gold text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(product =>
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <FittingSection />

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="group block"
            >
              <div className="relative aspect-square bg-[var(--ink-05)] rounded-lg overflow-hidden border border-[var(--ink-10)] group-hover:border-gold/30 transition-colors duration-300">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gold text-white text-xs px-2 py-1 rounded-full font-medium">Featured</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-medium tracking-wider text-foreground group-hover:text-gold transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-display font-light text-gold">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && (
                    <span className="text-sm text-muted-dark line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Products;