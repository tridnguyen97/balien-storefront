import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import {
  removeCartItem,
  updateCartItemQuantity,
  setCartItems,
} from '../lib/cartSlice';
import CartPersistenceService from '../lib/cartPersistence';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);

  // Load saved cart on mount (in case Redux store was empty)
  React.useEffect(() => {
    if (cart.items.length === 0) {
      const savedCart = CartPersistenceService.loadCart();
      if (savedCart && savedCart.items.length > 0) {
        dispatch(setCartItems(savedCart.items));
      }
    }
  }, [dispatch, cart.items.length]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
  };

  const removeItem = (id: string) => {
    dispatch(removeCartItem(id));
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-display font-light text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-dark mb-6">Start shopping for your perfect millinery piece</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors inline-flex items-center gap-2"
          >
            Shop Now
          </button>
        </div>
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
            <span className="text-muted-dark">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--cotton)] border border-[var(--ink-10)] rounded-lg p-4 flex gap-4 transition-all duration-200 hover:border-gold/30"
            >
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
                    onClick={() => removeItem(item.id)}
                    className="text-gold hover:text-gold-light transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-[var(--ink-05)] rounded border border-[var(--ink-10)] hover:bg-[var(--ink-10)] transition-colors"
                    >
                      <span className="text-sm font-medium">−</span>
                    </button>
                    <span className="text-base font-medium min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-[var(--ink-05)] rounded border border-[var(--ink-10)] hover:bg-[var(--ink-10)] transition-colors"
                    >
                      <span className="text-sm font-medium">+</span>
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-display font-light text-gold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      {item.original_price && (
                        <span className="text-sm text-muted-dark line-through">
                          ${(item.original_price * item.quantity).toFixed(2)}
                        </span>
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
          ))}
        </div>

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
      </div>
    </>
  );
};

export default Cart;
