import { CartItem } from '../../lib/cartSlice';

/**
 * Cart Item Factory - Creates valid cart items for testing
 * Reference: Test Data Factories section in cart-action-test-cases.md
 */
export const createCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'item_' + Math.random().toString(36).substr(2, 9),
  title: 'Test Item',
  handle: 'test-item',
  price: 1000,
  image: 'test.jpg',
  quantity: 1,
  ...overrides,
});

/**
 * Product Factory - Creates valid products for testing
 * Reference: Test Data Factories section in cart-action-test-cases.md
 */
export const createProduct = (overrides: Partial<any> = {}) => ({
  id: 'prod_' + Math.random().toString(36).substr(2, 6),
  name: 'Test Product',
  price: 1000,
  options: ['color', 'size'],
  ...overrides,
});

/**
 * Sample cart items for testing
 */
export const sampleCartItems: CartItem[] = [
  {
    id: 'item1',
    title: 'Test Item 1',
    handle: 'test-item-1',
    price: 1000,
    image: 'test1.jpg',
    quantity: 1,
  },
  {
    id: 'item2',
    title: 'Test Item 2',
    handle: 'test-item-2',
    price: 2000,
    image: 'test2.jpg',
    quantity: 2,
  },
];

/**
 * Sample product for testing
 */
export const sampleProduct = {
  id: 'prod_123456',
  name: 'Sample Product',
  price: 1500,
  options: ['color', 'size'],
};