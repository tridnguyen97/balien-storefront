import cartReducer, { CartItem, CartState } from '../../../lib/cartSlice';
import { setCartItems, addCartItem, removeCartItem, updateCartItemQuantity } from '../../../lib/cartSlice';

describe('Cart Reducer Tests', () => {
  const initialState: CartState = {
    items: [],
    total: 0,
    subtotal: 0,
    shipping: 5.00,
    tax: 0
  };

  describe('Initial State', () => {
    it('CR-001: Initial state is correct', () => {
      const state = cartReducer(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual({
        items: [],
        total: 0,
        subtotal: 0,
        shipping: 5.00,
        tax: 0
      });
    });
  });

  describe('setCartItems Action', () => {
    it('CR-002: setCartItems sets items correctly', () => {
      const testItems: CartItem[] = [
        {
          id: 'item1',
          title: 'Test Item 1',
          handle: 'test-item-1',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        },
        {
          id: 'item2',
          title: 'Test Item 2',
          handle: 'test-item-2',
          price: 2000,
          image: 'test2.jpg',
          quantity: 2
        }
      ];

      const state = cartReducer(initialState, setCartItems(testItems));

      expect(state.items).toEqual(testItems);
      expect(state.total).toBe(5000); // 1000*1 + 2000*2
      expect(state.subtotal).toBe(5000);
    });

    it('CR-007: Reducer maintains immutability', () => {
      const originalState: CartState = {
        items: [{ id: 'item1', title: 'Test', handle: 'test', price: 1000, image: 'test.jpg', quantity: 1 }],
        total: 1000,
        subtotal: 1000,
        shipping: 5,
        tax: 0
      };

      const clonedState = JSON.parse(JSON.stringify(originalState));

      cartReducer(originalState, setCartItems([]));

      expect(originalState).toEqual(clonedState);
    });
  });

  describe('addCartItem Action', () => {
    it('CR-002: ADD_ITEM action adds item correctly (new item)', () => {
      const state = cartReducer(initialState, addCartItem({
        id: 'item1',
        title: 'Test Item',
        handle: 'test-item',
        price: 1000,
        image: 'test.jpg',
        quantity: 1
      }));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe('item1');
      expect(state.items[0].quantity).toBe(1);
      expect(state.total).toBe(1000);
      expect(state.subtotal).toBe(1000);
    });

    it('CR-003: ADD_ITEM action updates quantity for existing item', () => {
      const stateWithItem = cartReducer(initialState, addCartItem({
        id: 'item1',
        title: 'Test Item',
        handle: 'test-item',
        price: 1000,
        image: 'test.jpg',
        quantity: 1
      }));

      const updatedState = cartReducer(stateWithItem, addCartItem({
        id: 'item1',
        title: 'Test Item',
        handle: 'test-item',
        price: 1000,
        image: 'test.jpg',
        quantity: 2
      }));

      expect(updatedState.items).toHaveLength(1);
      expect(updatedState.items[0].quantity).toBe(3); // 1 + 2
      expect(updatedState.total).toBe(3000);
    });
  });

  describe('removeCartItem Action', () => {
    it('CR-003: REMOVE_ITEM action removes item correctly', () => {
      const stateWithItems = cartReducer(initialState, setCartItems([
        {
          id: 'item1',
          title: 'Test Item 1',
          handle: 'test-item-1',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        },
        {
          id: 'item2',
          title: 'Test Item 2',
          handle: 'test-item-2',
          price: 2000,
          image: 'test2.jpg',
          quantity: 2
        }
      ]));

      const updatedState = cartReducer(stateWithItems, removeCartItem('item1'));

      expect(updatedState.items).toHaveLength(1);
      expect(updatedState.items[0].id).toBe('item2');
      expect(updatedState.total).toBe(4000); // 2000 * 2
      expect(updatedState.subtotal).toBe(4000);
    });

    it('CR-007: Reducer maintains immutability on remove', () => {
      const stateWithItems = cartReducer(initialState, setCartItems([
        {
          id: 'item1',
          title: 'Test Item',
          handle: 'test-item',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        }
      ]));

      const clonedState = JSON.parse(JSON.stringify(stateWithItems));

      cartReducer(stateWithItems, removeCartItem('item1'));

      expect(stateWithItems).toEqual(clonedState);
    });
  });

  describe('updateCartItemQuantity Action', () => {
    it('CR-004: UPDATE_QUANTITY action updates quantity correctly', () => {
      const stateWithItems = cartReducer(initialState, setCartItems([
        {
          id: 'item1',
          title: 'Test Item',
          handle: 'test-item',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        }
      ]));

      const updatedState = cartReducer(stateWithItems, updateCartItemQuantity({
        id: 'item1',
        quantity: 5
      }));

      expect(updatedState.items[0].quantity).toBe(5);
      expect(updatedState.total).toBe(5000);
      expect(updatedState.subtotal).toBe(5000);
    });

    it('CR-003: UPDATE_QUANTITY maintains immutability', () => {
      const stateWithItems = cartReducer(initialState, setCartItems([
        {
          id: 'item1',
          title: 'Test Item',
          handle: 'test-item',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        }
      ]));

      const clonedState = JSON.parse(JSON.stringify(stateWithItems));

      cartReducer(stateWithItems, updateCartItemQuantity({
        id: 'item1',
        quantity: 3
      }));

      expect(stateWithItems).toEqual(clonedState);
    });

    it('CR-007: UPDATE_QUANTITY handles missing item gracefully', () => {
      const stateWithItems = cartReducer(initialState, setCartItems([
        {
          id: 'item1',
          title: 'Test Item',
          handle: 'test-item',
          price: 1000,
          image: 'test.jpg',
          quantity: 1
        }
      ]));

      const originalState = JSON.parse(JSON.stringify(stateWithItems));

      // Update non-existent item
      const updatedState = cartReducer(stateWithItems, updateCartItemQuantity({
        id: 'nonexistent',
        quantity: 5
      }));

      expect(updatedState).toEqual(originalState);
    });
  });

  describe('Unknown Action', () => {
    it('CR-006: Reducer handles unknown actions gracefully', () => {
      const state = cartReducer(initialState, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(initialState);
    });
  });
});