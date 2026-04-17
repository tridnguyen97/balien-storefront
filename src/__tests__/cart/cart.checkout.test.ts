import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../lib/cartSlice';
import Checkout from '../../app/Checkout';

describe('Checkout Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer
      },
      preloadedState: {
        cart: {
          items: [
            {
              id: 'item1',
              title: 'Test Hat',
              handle: 'test-hat',
              price: 1000,
              image: 'hat.jpg',
              quantity: 1,
              variant: {
                options: { color: 'black', size: 'one-size' },
                price: 1000,
                sku: 'HAT-001'
              }
            }
          ],
          total: 1000,
          subtotal: 1000,
          shipping: 500,
          tax: 80
        }
      }
    });
  });

  it('renders checkout form elements', () => {
    render(
      <Provider store={store}>
        <Checkout />
      </Provider>
    );

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders checkout buttons', () => {
    render(
      <Provider store={store}>
        <Checkout />
      </Provider>
    );

    expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(
      <Provider store={store}>
        <Checkout />
      </Provider>
    );

    expect(screen.getByText('Have questions?')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
  });
});