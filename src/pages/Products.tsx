import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../lib/store';
import { useSelector } from 'react-redux';
import FittingSection from '../components/FittingSection';
import ProductCard from '../components/ui/ProductCard';

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
      {/* Spacer for fixed header: h-16 (64px) mobile, h-20 (80px) desktop */}
      <div className="h-16 md:h-20" />

      <FittingSection />

       <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {sortedProducts.map((product) => (
             <ProductCard key={product.id} product={product} />
           ))}
         </div>
       </section>
    </>
  );
};

export default Products;