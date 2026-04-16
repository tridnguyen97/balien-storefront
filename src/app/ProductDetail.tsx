import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartItem } from '../lib/store';

interface Variant {
  options: { [key: string]: string };
  price: number;
  sku: string;
  id: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number;
  original_price?: number;
  image: string;
  description: string;
  variants: Variant[];
  in_stock: boolean;
  category: string;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const addToCart = () => {
    if (!selectedVariant) {
      alert('Please select a variant');
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: selectedVariant.price,
      original_price: product.original_price,
      image: product.image,
      quantity: quantity,
      variant: selectedVariant,
      discount: 0
    };

    let cart = localStorage.getItem('brim-cart');
    let cartObj = cart ? JSON.parse(cart) : { items: [], subtotal: 0, shipping: 5.00, tax: 0, total: 0 };

    const existingItemIndex = cartObj.items.findIndex((item: any) => item.id === cartItem.id && item.variant?.sku === cartItem.variant?.sku);
    if (existingItemIndex > -1) {
      cartObj.items[existingItemIndex].quantity += cartItem.quantity;
    } else {
      cartObj.items.push(cartItem);
    }

    cartObj.subtotal = cartObj.items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
    cartObj.total = cartObj.subtotal + cartObj.shipping + (cartObj.subtotal * 0.08);

    localStorage.setItem('brim-cart', JSON.stringify(cartObj));
    alert('Added to cart!');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[var(--cotton)] border-b border-[var(--ink-10)] py-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-sm tracking-wide">
            <span className="text-muted-dark hover:text-gold transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="text-muted-dark">{product.category}</span>
            <span className="mx-2">/</span>
            <span className="text-muted-dark">{product.title}</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square bg-[var(--ink-05)] rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-[var(--ink-05)] rounded-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={`Product detail ${i}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-display italic text-3xl font-light text-foreground mb-2">{product.title}</h1>
              <p className="text-sm text-muted-dark">{product.category}</p>
            </div>

            <div>
              <p className="text-muted-dark text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display italic text-4xl font-light text-gold">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-lg text-muted-dark line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium tracking-wide text-muted-dark mb-3">Select Options</h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <div
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-gold bg-gold/5'
                        : 'border-[var(--ink-10)] hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">
                        {Object.entries(variant.options).map(([key, value]) => `${value} `).join('')}
                      </span>
                      <span className="font-display font-light text-gold">
                        ${variant.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium tracking-wide text-muted-dark mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center bg-[var(--ink-05)] rounded border border-[var(--ink-10)] hover:bg-[var(--ink-10)] transition-colors"
                >
                  <span className="text-sm font-medium">−</span>
                </button>
                <span className="text-base font-medium min-w-[24px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center bg-[var(--ink-05)] rounded border border-[var(--ink-10)] hover:bg-[var(--ink-10)] transition-colors"
                >
                  <span className="text-sm font-medium">+</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={addToCart}
                className="w-full bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;