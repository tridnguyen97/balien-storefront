import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { addCartItem } from '../lib/cartSlice';
import ProductGallery from '../components/product/ProductGallery';
import QuantitySelector from '../components/ui/QuantitySelector';
import Price from '../components/ui/Price';
import Breadcrumb from '../components/ui/Breadcrumb';

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
  images?: { url: string; alt?: string }[];
  description: string;
  variants: Variant[];
  in_stock: boolean;
  category: string;
}

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [handle]);

  const fetchProductDetails = () => {
    const mockProduct: Product = {
      id: 'prod_hat_001',
      title: 'Elegant Sinamai Fascinator',
      handle: 'elegant-hat-001',
      price: 185.00,
      original_price: 220.00,
      image: '/mock-product-1.jpg',
      images: [
        { url: '/mock-product-1.jpg', alt: 'Elegant Sinamai Fascinator - Front view' },
        { url: '/mock-product-1.jpg', alt: 'Elegant Sinamai Fascinator - Side view' },
        { url: '/mock-product-1.jpg', alt: 'Elegant Sinamai Fascinator - Detail view' },
        { url: '/mock-product-1.jpg', alt: 'Elegant Sinamai Fascinator - Back view' }
      ],
      description: 'Handcrafted sinamai fascinator featuring intricate pleating and elegant silhouette. Perfect for special occasions and weddings.',
      variants: [
        { id: 'v1', options: { Color: 'Ivory', Size: 'One Size' }, price: 185.00, sku: 'HAT-IV-001' },
        { id: 'v2', options: { Color: 'Black', Size: 'One Size' }, price: 185.00, sku: 'HAT-BK-001' },
        { id: 'v3', options: { Color: 'Gold', Size: 'One Size' }, price: 195.00, sku: 'HAT-GD-001' }
      ],
      in_stock: true,
      category: 'Spring'
    };
    setProduct(mockProduct);
    setLoading(false);
  };

  const addToCart = () => {
    if (!selectedVariant) {
      messageApi.warning({ content: 'Please select a variant' });
      return;
    }

    if (!product) return;

    const cartItem = {
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

    // Dispatch to Redux - middleware handles persistence and state updates
    dispatch(addCartItem(cartItem));
    messageApi.success({ content: 'Added to cart!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-dark">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gold text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

   return (
     <>
       {contextHolder}
       <Breadcrumb
         items={[
           { label: 'Home', to: '/' },
           { label: product.category, to: `/products?category=${product.category}` },
           { label: product.title, to: `/products/${product.handle}` }
         ]}
       />

       <section className="max-w-7xl mx-auto px-6 md:px-10 py-12">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="space-y-4">
             <ProductGallery 
               images={product.images || [{ url: product.image, alt: product.title }]}
               mainImageUrl={product.image}
               enableZoom={true}
             />
           </div>

          <div className="space-y-6">
            <div>
              <h1 className="font-display italic text-3xl font-light text-foreground mb-2">{product.title}</h1>
              <p className="text-sm text-muted-dark">{product.category}</p>
            </div>

            <div>
              <p className="text-muted-dark text-sm leading-relaxed">{product.description}</p>
            </div>

             <div className="flex items-baseline mb-6">
               <Price amount={product.price} size="xl" />
               {product.original_price && (
                 <Price amount={product.original_price} size="lg" showCurrencySymbol={false} className="line-through ml-3 text-muted-dark" />
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
               <QuantitySelector 
                 value={quantity} 
                 onChange={setQuantity} 
                 min={1} 
                 max={99}
               />
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