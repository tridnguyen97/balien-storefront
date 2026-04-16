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

export const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  shipping: 5.00,
  tax: 0
};

const store = {
  items: [],
  total: 0,
  subtotal: 0,
  shipping: 5.00,
  tax: 0,
  getState() {
    return {
      items: this.items,
      total: this.total,
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax
    };
  },
  subscribe: function (listener: () => void) {
    // Simple subscription logic
    return () => {};
  }
};

export default store;