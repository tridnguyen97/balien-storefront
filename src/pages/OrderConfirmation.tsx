import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="font-display italic text-3xl font-light text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-dark mb-6">Your elegant millinery piece is on its way.</p>
      </div>

      <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 max-w-md w-full mb-8">
        <h2 className="font-display italic text-xl font-light text-foreground mb-4">Order #ORD-123456</h2>
        <div className="space-y-2 text-sm text-muted-dark">
          <p>Elegant Sinamai Fascinator</p>
          <p>Shipping to: 123 Millinery Lane, London</p>
          <p>Total: $518.00</p>
        </div>
      </div>

      <Link
        to="/"
        className="bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors inline-flex items-center gap-2"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;