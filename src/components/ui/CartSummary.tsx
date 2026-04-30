/**
 * Cart Summary Component
 *
 * Displays order summary with subtotal, shipping, tax, total, and action buttons.
 */

import React from 'react';
import { CartState } from '../../lib/cartSlice';

interface CartSummaryProps {
  cart: CartState;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ 
  cart, 
  onCheckout, 
  onContinueShopping 
}) => {
  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 h-fit">
        <h2 className="font-display italic text-xl font-light text-foreground mb-6">Order Summary</h2>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-muted-dark">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-dark">
            <span>Shipping</span>
            <span>${cart.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-dark">
            <span>Tax</span>
            <span>${cart.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-display font-light text-foreground border-t border-b py-3">
            <span>Total</span>
            <span className="text-gold">${cart.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <a href='/checkout'>
            <button className="w-full bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors">
              Proceed to Checkout
            </button>
          </a>
          <a href='/products'>
            <button className="w-full bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors">
              Continue Shopping
            </button>
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-dark mb-2">Have questions?</p>
          <a href="mailto:support@brim.com" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;