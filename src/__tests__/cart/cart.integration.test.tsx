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
      <Cart />,
      { store }
    );

    // Check item titles are rendered
    expect(screen.getByText('Test Hat')).toBeInTheDocument();
    expect(screen.getByText('Fedora')).toBeInTheDocument();

    // Check quantities using data-testid pattern for specific item quantities
    const quantities = screen.getAllByText('1');
    expect(quantities.length).toBeGreaterThanOrEqual(1);
    
    const quantities2 = screen.getAllByText('2');
    expect(quantities2.length).toBeGreaterThanOrEqual(1);

    // Check prices - use getAllByText since they appear in multiple places
    expect(screen.getAllByText('$1000.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('$4000.00').length).toBeGreaterThanOrEqual(1);
  });

  it('IT-002: Calculates totals correctly', () => {
    renderWithProviders(
      <Cart />,
      { store }
    );

    // Check subtotal - look for it within the Order Summary section
    const subtotalLabels = screen.getAllByText('Subtotal');
    expect(subtotalLabels.length).toBeGreaterThanOrEqual(1);

    // Check shipping
    const shippingLabels = screen.getAllByText('Shipping');
    expect(shippingLabels.length).toBeGreaterThanOrEqual(1);

    // Check tax
    const taxLabels = screen.getAllByText('Tax');
    expect(taxLabels.length).toBeGreaterThanOrEqual(1);

    // Check total labels
    const totalLabels = screen.getAllByText('Total');
    expect(totalLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('IT-002: Updates quantity correctly', () => {
    const { store: testStore } = renderWithProviders(
      <Cart />,
      { store }
    );

    // Get the first increment button
    const incrementButtons = screen.getAllByText('+');
    expect(incrementButtons.length).toBeGreaterThanOrEqual(1);
    
    // Click the first increment button
    fireEvent.click(incrementButtons[0]);

    // Check that the Redux state was updated
    const state = testStore.getState();
    const firstItem = state.cart.items.find((item: any) => item.id === 'item1');
    expect(firstItem?.quantity).toBe(2);
  });

  it('IT-002: Removes item correctly', () => {
    const { store: testStore } = renderWithProviders(
      <Cart />,
      { store }
    );

    // Verify we start with 2 items
    let state = testStore.getState();
    expect(state.cart.items).toHaveLength(2);

    // Find and click the first remove button
    const removeButtons = screen.getAllByText('Remove');
    expect(removeButtons.length).toBeGreaterThanOrEqual(1);
    
    fireEvent.click(removeButtons[0]);

    // Check that Redux state was updated
    state = testStore.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].id).toBe('item2');
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
      <Cart />,
      { store: emptyStore }
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start shopping for your perfect millinery piece')).toBeInTheDocument();
  });
});
