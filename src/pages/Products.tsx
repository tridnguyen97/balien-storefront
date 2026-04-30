import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RootState } from '../lib/store';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';
import FittingSection from '../components/FittingSection';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorState from '../components/ui/ErrorState';

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
     return <LoadingSpinner text="Loading products..." />;
   }

   if (error) {
     return <ErrorState error={error} onRetry={fetchProducts} />;
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
    <MainLayout>
      <FittingSection />

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
};

export default Products;