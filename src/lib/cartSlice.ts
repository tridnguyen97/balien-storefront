import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CartPersistenceService, { CartData } from './cartPersistence';

export interface CartItem {
  id: string;
  title: string;
  handle: string;
  price: number;
  original_price?: number;
  image: string;
  quantity: number;
  variant?: {
    options: { [key: string]: string };
    price: number;
    sku: string;
  };
  discount?: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount?: number;
  shipping: number;
  tax: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  shipping: 5.00,
  tax: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.subtotal = state.total;
    },
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.subtotal = state.total;
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.subtotal = state.total;
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        state.subtotal = state.total;
      }
    }
  }
});

export const { setCartItems, addCartItem, removeCartItem, updateCartItemQuantity } = cartSlice.actions;

// Action creators for test utilities
export const createAddItemAction = (productId: string, quantity: number, options: Record<string, string> = {}) => ({
  type: 'cart/addItem',
  payload: { productId, quantity, options }
});

export const createRemoveItemAction = (itemId: string) => ({
  type: 'cart/removeItem',
  payload: { itemId }
});

export const createUpdateQuantityAction = (id: string, quantity: number) => ({
  type: 'cart/updateQuantity',
  payload: { id, quantity: Math.max(0, quantity) }
});

export const createClearCartAction = () => ({
  type: 'cart/clear'
});

export const createAddItemsAction = (items: CartItem[]) => ({
  type: 'cart/addItems',
  payload: { items }
});

export const createUpdateItemOptionsAction = (itemId: string, options: Record<string, string>) => ({
  type: 'cart/updateItemOptions',
  payload: { itemId, options }
});

export const createApplyCouponAction = (code: string) => ({
  type: 'cart/applyCoupon',
  payload: { code }
});

export default cartSlice.reducer;

// Cart Persistence Middleware
export const cartPersistenceMiddleware = {
  /**
   * Subscribe to store changes and persist cart state
   */
  subscribeToStore: (store: any) => {
    let currentState = store.getState();

    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();

      // Check if cart state has changed
      if (
        currentState.cart.items !== nextState.cart.items ||
        currentState.cart.total !== nextState.cart.total ||
        currentState.cart.subtotal !== nextState.cart.subtotal ||
        currentState.cart.tax !== nextState.cart.tax
      ) {
        // Persist the entire cart state
        const cartData: CartData = {
          items: nextState.cart.items,
          total: nextState.cart.total,
          subtotal: nextState.cart.subtotal,
          shipping: nextState.cart.shipping,
          tax: nextState.cart.tax,
          discount: nextState.cart.discount
        };

        try {
          CartPersistenceService.saveCart(cartData);
          currentState = nextState;
        } catch (error) {
          console.warn('Cart persistence failed:', error);
        }
      }
    });

    return unsubscribe;
  },

  /**
   * Load saved cart state into store
   */
  loadSavedCart: (store: any) => {
    const savedCart = CartPersistenceService.loadCart();
    if (savedCart) {
      store.dispatch(setCartItems(savedCart.items));
    }
  }
};