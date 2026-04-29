import { screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../../lib/cartSlice';
import { renderWithProviders } from '../utils/test-utils';
import Checkout from '../../pages/Checkout';

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

  it('renders checkout shipping step', () => {
    renderWithProviders(
      <Checkout />,
      { store }
    );

    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street Address')).toBeInTheDocument();
  });

  it('renders checkout buttons', () => {
    renderWithProviders(
      <Checkout />,
      { store }
    );

    expect(screen.getByText('Next: Payment')).toBeInTheDocument();
    expect(screen.getByText('Edit Cart')).toBeInTheDocument();
  });

  it('proceeds to payment step', async () => {
    renderWithProviders(
      <Checkout />,
      { store }
    );

    // Initially on shipping step
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    
    // Fill in required fields and proceed
    const nameInput = screen.getByPlaceholderText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const emailInput = screen.getByPlaceholderText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    const addressInput = screen.getByPlaceholderText('Street Address');
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    
    const cityInput = screen.getByPlaceholderText('City');
    fireEvent.change(cityInput, { target: { value: 'Anytown' } });
    
    const zipInput = screen.getByPlaceholderText('ZIP Code');
    fireEvent.change(zipInput, { target: { value: '12345' } });
    
    const countrySelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(countrySelect, { target: { value: 'US' } });
    
    // Submit the form by clicking the button
    const nextButton = screen.getByRole('button', { name: /next: payment/i });
    fireEvent.click(nextButton);
    
    // Should show payment step - wait for the transition
    expect(await screen.findByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cardholder Name')).toBeInTheDocument();
    expect(await screen.findByText('Review Order')).toBeInTheDocument();
  });
});
