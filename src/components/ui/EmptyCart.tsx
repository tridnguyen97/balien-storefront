/**
 * Empty Cart Component
 *
 * Displays empty cart state with call-to-action to shop.
 */

import React from 'react';

interface EmptyCartProps {
  onShopNow?: () => void;
  message?: string;
  subMessage?: string;
}

const EmptyCart: React.FC<EmptyCartProps> = ({ 
  onShopNow, 
  message = 'Your cart is empty',
  subMessage = 'Start shopping for your perfect millinery piece'
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-display font-light text-foreground mb-2">{message}</h2>
        <p className="text-muted-dark mb-6">{subMessage}</p>
        <button
          onClick={onShopNow}
          className="bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors inline-flex items-center gap-2"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;