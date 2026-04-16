import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handleNext = () => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    } else {
      // Complete order
      alert('Order placed successfully!');
      localStorage.removeItem('brim-cart');
      navigate('/order-confirmation');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === 'shipping') {
    return (
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
        <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Shipping Information</h1>
        <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.zip}
              onChange={handleChange}
            />
            <select
              name="country"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Country</option>
              <option value="UK">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleNext}
              className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              Next: Payment
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
            >
              Edit Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
        <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Payment Information</h1>
        <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="cardName"
              placeholder="Cardholder Name"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.cardName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.cardNumber}
              onChange={handleChange}
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.expiry}
              onChange={handleChange}
              maxLength={5}
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={3}
            />
            <select className="bg-background border border-[var(--ink-10)] px-4 py-2 rounded-lg focus:outline-none focus:border-gold transition-colors">
              <option>Card Type</option>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>Amex</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleNext}
              className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              Review Order
            </button>
            <button
              onClick={() => setStep('shipping')}
              className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review step
  return (
    <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
      <h1 className="font-display italic text-2xl font-light text-foreground mb-6">Review Order</h1>
      <div className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-6 space-y-4">
        <h2 className="font-medium text-foreground">Shipping to:</h2>
        <p className="text-sm text-muted-dark">{formData.name}</p>
        <p className="text-sm text-muted-dark">{formData.address}, {formData.city}, {formData.zip}</p>
        <p className="text-sm text-muted-dark">{formData.country}</p>

        <h2 className="font-medium text-foreground mt-6">Payment Method:</h2>
        <p className="text-sm text-muted-dark">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>

        <div className="border-t border-b py-4">
          <div className="flex justify-between text-sm text-muted-dark mb-2">
            <span>Subtotal</span>
            <span>$475.00</span>
          </div>
          <div className="flex justify-between text-sm text-muted-dark mb-2">
            <span>Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between text-sm text-muted-dark">
            <span>Tax (8%)</span>
            <span>$38.00</span>
          </div>
          <div className="flex justify-between text-base font-display font-light text-foreground mt-2">
            <span>Total</span>
            <span className="text-gold">$518.00</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            Place Order
          </button>
          <button
            onClick={() => setStep('shipping')}
            className="flex-1 bg-transparent border border-[var(--ink-10)] text-foreground px-6 py-3 rounded-lg font-medium hover:bg-[var(--ink-05)] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;