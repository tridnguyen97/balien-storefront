/**
 * MiniCart Component
 *
 * A draggable cart preview that shows items in the cart and allows quick actions.
 */

import React from 'react';
import { useCart } from '../../hooks/useCart';
import { useRemoveCartItem, useUpdateCartItem } from '../../hooks/useCart';
import AppImage from '../ui/AppImage';
import QuantitySelector from '../ui/QuantitySelector';
import Price from '../ui/Price';

interface MiniCartProps {
  open: boolean;
  onClose: () => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ open, onClose }) => {
  const { data: cart, isLoading } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();

  if (isLoading) {
    return <div className="p-4">Loading cart...</div>;
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="p-4 text-center text-ink-50">
        Your cart is empty
      </div>
    );
  }

  const handleRemove = (itemId: string) => {
    if (cart.id) {
      removeItem.mutate({ cartId: cart.id, itemId });
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (cart.id) {
      updateItem.mutate({ cartId: cart.id, itemId, quantity });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm ${
        open ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300`}
    >
      <div className="flex h-full w-80 bg-white shadow-2l flex-col">
        {/* MiniCart Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-ink-40 hover:text-ink-60"
          >
            ×
          </button>
        </div>

        {/* MiniCart Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-start mb-4">
              {/* Product Image */}
              <div className="w-16 h-16 flex-shrink-0">
                <AppImage
                  src={item.thumbnail || ''}
                  alt={item.title}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Product Details */}
              <div className="ml-3 flex-1 space-y-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-sm text-ink-50">
                  {item.variant?.title || 'Default'}
                </p>

                 {/* Quantity Controls */}
                 <div className="flex items-center mt-1">
                   <QuantitySelector 
                     value={item.quantity} 
                     onChange={(qty) => handleQuantityChange(item.id, qty)} 
                     min={1} 
                     max={99}
                   />
                   <button
                     onClick={() => handleRemove(item.id)}
                     className="ml-2 text-xs text-red-500 hover:text-red-700"
                   >
                     Remove
                   </div>
                 </div>

                 {/* Item Price */}
                 <div className="ml-4 flex-shrink-0 text-right space-y-1">
                   <Price amount={item.unit_price * item.quantity} size="sm" />
                 </div>
            </div>
          ))}
        </div>

        {/* MiniCart Footer */}
        <div className="px-6 pt-4 pb-6 border-t space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ink-50">Subtotal</p>
              <p className="text-ink-90">${cart.subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-ink-50">Shipping</p>
              <p className="text-ink-90">${cart.shipping_total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-ink-50">Tax</p>
              <p className="text-ink-90">${cart.tax_total.toFixed(2)}</p>
            </div>
            <div className="font-bold">
              <p className="text-ink-50">Total</p>
              <p className="text-ink-90 text-lg">${cart.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                onClose();
                // Navigate to cart page
                window.location.href = '/cart';
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              View Cart
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to checkout
                window.location.href = '/checkout';
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gold text-foreground hover:bg-gold/90 rounded text-sm font-medium"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;