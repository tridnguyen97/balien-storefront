/**
 * Product Card Component
 *
 * A reusable component for displaying product information in grids and lists.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { AppImage } from './AppImage';
import { Price } from './Price';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    price: number;
    original_price?: number;
    image: string;
    featured?: boolean;
    in_stock?: boolean;
    category: string;
  };
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block"
    >
      <div className="relative aspect-square bg-[var(--ink-05)] rounded-lg overflow-hidden border border-[var(--ink-10)] group-hover:border-gold/30 transition-colors duration-300">
        <AppImage
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
  );
};

export default React.memo(ProductCard);