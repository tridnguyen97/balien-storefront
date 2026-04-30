/**
 * Cart Item Component
 *
 * Displays a single cart item with image, details, quantity controls, and price.
 */

import React from 'react';
import { CartItem as CartItemType } from '../../lib/cartSlice';
import QuantitySelector from './QuantitySelector';
import Price from './Price';

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onUpdateQuantity }) => {
  return (
    <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-4 flex gap-4 transition-all duration-200 hover:border-gold/30">
      <div className="relative flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-20 h-20 object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-foreground">{item.title}</h3>
            {item.variant && (
              <p className="text-sm text-muted-dark">
                {Object.entries(item.variant.options).map(([key, value]) => `${key}: ${value}`).join(' - ')}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            Remove
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2">
          <QuantitySelector 
            value={item.quantity} 
            onChange={(qty) => onUpdateQuantity(item.id, qty)} 
            min={1} 
            max={99}
          />

          <div className="text-right">
            <div className="flex items-center gap-2">
              <Price amount={item.price * item.quantity} size="base" />
              {item.original_price && (
                <Price amount={item.original_price * item.quantity} size="sm" showCurrencySymbol={false} className="line-through text-muted-dark" />
              )}
            </div>
            {item.discount && (
              <span className="text-xs text-green-600">
                -${(item.discount * item.quantity).toFixed(2)} discount
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;