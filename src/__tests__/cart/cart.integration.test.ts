import { screen, fireEvent, render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../lib/cartSlice';
import Cart from '../../pages/Cart';
import { renderWithProviders } from '../utils/test-utils';

describe('Cart Integration Tests', () => {
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
            },
            {
              id: 'item2',
              title: 'Fedora',
              handle: 'fedora',
              price: 2000,
              image: 'fedora.jpg',
              quantity: 2,
              variant: {
                options: { color: 'brown', size: 'medium' },
                price: 2000,
                sku: 'FED-002'
              }
            }
          ],
          total: 5000,
          subtotal: 5000,
          shipping: 500,
          tax: 400
        }
      }
    });
  });

  it('IT-001: Renders cart items correctly', () => {
    renderWithProviders(
        <Cart />
    );

    // Check item titles are rendered
    expect(screen.getByText('Test Hat')).toBeInTheDocument();
    expect(screen.getByText('Fedora')).toBeInTheDocument();

    // Check quantities
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Check prices
    expect(screen.getByText('$1000.00')).toBeInTheDocument();
    expect(screen.getByText('$4000.00')).toBeInTheDocument();
  });

  it('IT-002: Calculates totals correctly', () => {
    renderWithProviders(
        <Cart />
    );

    // Check subtotal
    expect(screen.getByText('$5000.00')).toBeInTheDocument();

    // Check shipping
    expect(screen.getByText('$500.00')).toBeInTheDocument();

    // Check tax (8%)
    expect(screen.getByText('$400.00')).toBeInTheDocument();

    // Check total
    expect(screen.getByText('$5900.00')).toBeInTheDocument();
  });

  it('IT-002: Updates quantity correctly', () => {
    renderWithProviders(
        <Cart />
    );

    // Find and click the increment button for the first item
    const incrementButtons = screen.getAllByText('+');
    fireEvent.click(incrementButtons[0]);

    // Check that quantity updated
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('IT-002: Removes item correctly', () => {
    renderWithProviders(
        <Cart />
    );

    // Find and click the remove button for the first item
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    // Check that item is removed
    expect(screen.queryByText('Test Hat')).not.toBeInTheDocument();
    expect(screen.getByText('Fedora')).toBeInTheDocument();
  });

  it('IT-003: Shows empty cart message', () => {
    const emptyStore = configureStore({
      reducer: {
        cart: cartReducer
      },
      preloadedState: {
        cart: {
          items: [],
          total: 0,
          subtotal: 0,
          shipping: 500,
          tax: 0
        }
      }
    });

    renderWithProviders(
        <Cart />
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start shopping for your perfect millinery piece')).toBeInTheDocument();
  });
});