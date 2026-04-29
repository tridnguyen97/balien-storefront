import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import CartPersistenceService, { CartData } from './cartPersistence';
import {
  getOrCreateCart as apiGetOrCreateCart,
  addItemToCart as apiAddItemToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  Cart as ApiCart,
} from '../api/cart';

// Async Thunks for API Integration

/**
 * Initialize cart - loads from API or creates new one
 */
export const initializeCart = createAsyncThunk(
  'cart/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetOrCreateCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to initialize cart');
    }
  }
);

/**
 * Add item to cart via API
 */
export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async (
    { cartId, variantId, quantity }: { cartId: string; variantId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiAddItemToCart(cartId, variantId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add item');
    }
  }
);

/**
 * Update item quantity via API
 */
export const updateItemQuantityAsync = createAsyncThunk(
  'cart/updateItemQuantityAsync',
  async (
    { cartId, itemId, quantity }: { cartId: string; itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiUpdateCartItem(cartId, itemId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update quantity');
    }
  }
);

/**
 * Remove item from cart via API
 */
export const removeItemAsync = createAsyncThunk(
  'cart/removeItemAsync',
  async (
    { cartId, itemId }: { cartId: string; itemId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiRemoveCartItem(cartId, itemId);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove item');
    }
  }
);

// Helper to transform API cart to local format
const transformApiCartToLocal = (apiCart: ApiCart): CartState => {
  return {
    items: apiCart.items.map(item => ({
      id: item.variant_id,
      title: item.title,
      handle: '', // Will need to be populated from product data
      price: item.unit_price,
      original_price: item.original_price,
      image: item.thumbnail || '',
      quantity: item.quantity,
      variant: {
        sku: item.variant.sku,
        price: item.unit_price,
        options: item.variant.options.reduce((acc, opt, idx) => {
          acc[`option_${idx}`] = opt;
          return acc;
        }, {} as { [key: string]: string }),
      },
    })),
    subtotal: apiCart.subtotal,
    total: apiCart.total,
    shipping: apiCart.shipping_total || 5.00,
    tax: apiCart.tax_total || 0,
    discount: apiCart.discount_total || 0,
  };
};

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

const calculateTotals = (state: CartState) => {
  state.subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  state.tax = state.subtotal * 0.08; // 8% tax
  state.total = state.subtotal + state.shipping + state.tax;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      calculateTotals(state);
    },
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      calculateTotals(state);
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        calculateTotals(state);
      }
    },
    setShipping: (state, action: PayloadAction<number>) => {
      state.shipping = action.payload;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.tax = 0;
      state.total = 0;
      state.discount = 0;
    }
  },
  extraReducers: (builder) => {
    // Initialize cart
    builder.addCase(initializeCart.fulfilled, (state, action) => {
      const cartData = transformApiCartToLocal(action.payload);
      state.items = cartData.items;
      state.subtotal = cartData.subtotal;
      state.total = cartData.total;
      state.shipping = cartData.shipping;
      state.tax = cartData.tax;
      state.discount = cartData.discount;
    });

    // Add item via API
    builder.addCase(addItemAsync.fulfilled, (state, action) => {
      const cartData = transformApiCartToLocal(action.payload);
      state.items = cartData.items;
      state.subtotal = cartData.subtotal;
      state.total = cartData.total;
      state.shipping = cartData.shipping;
      state.tax = cartData.tax;
      state.discount = cartData.discount;
    });

    // Update quantity via API
    builder.addCase(updateItemQuantityAsync.fulfilled, (state, action) => {
      const cartData = transformApiCartToLocal(action.payload);
      state.items = cartData.items;
      state.subtotal = cartData.subtotal;
      state.total = cartData.total;
    });

    // Remove item via API
    builder.addCase(removeItemAsync.fulfilled, (state, action) => {
      const cartData = transformApiCartToLocal(action.payload);
      state.items = cartData.items;
      state.subtotal = cartData.subtotal;
      state.total = cartData.total;
    });
  }
});

export const {
  setCartItems,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  setShipping,
  clearCart
} = cartSlice.actions;

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