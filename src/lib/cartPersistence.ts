import { CartItem } from './cartSlice';

export interface CartData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
}

export class CartPersistenceService {
  private static STORAGE_KEY = 'brim-cart';

  /**
   * Save cart data to localStorage with validation
   * @param cart - Cart data to persist
   */
  static saveCart(cart: CartData): void {
    try {
      const validatedCart = this.validateCartData(cart);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validatedCart));
    } catch (error) {
      console.error('Failed to save cart:', error);
      // Fallback: clear corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
      throw error;
    }
  }

  /**
   * Load cart data from localStorage with validation
   * @returns Cart data or null if not found/invalid
   */
  static loadCart(): CartData | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      return this.validateCartData(parsed);
    } catch (error) {
      console.error('Failed to load cart:', error);
      return null;
    }
  }

  /**
   * Clear cart data from localStorage
   */
  static clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Validate cart data structure and types
   * @param data - Raw data to validate
   * @returns Validated cart data
   */
  private static validateCartData(data: any): CartData {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid cart data: not an object');
    }

    if (!Array.isArray(data.items)) {
      throw new Error('Invalid cart data: items must be an array');
    }

    if (typeof data.subtotal !== 'number' || isNaN(data.subtotal)) {
      throw new Error('Invalid cart data: subtotal must be a number');
    }

    if (typeof data.shipping !== 'number' || isNaN(data.shipping)) {
      throw new Error('Invalid cart data: shipping must be a number');
    }

    if (typeof data.total !== 'number' || isNaN(data.total)) {
      throw new Error('Invalid cart data: total must be a number');
    }

    // Validate each cart item
    data.items.forEach((item: any, index: number) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Invalid cart item at index ${index}: not an object`);
      }
      if (typeof item.id !== 'string' || !item.id) {
        throw new Error(`Invalid cart item at index ${index}: id must be a non-empty string`);
      }
      if (typeof item.price !== 'number' || isNaN(item.price)) {
        throw new Error(`Invalid cart item at index ${index}: price must be a number`);
      }
      if (typeof item.quantity !== 'number' || isNaN(item.quantity) || item.quantity < 1) {
        throw new Error(`Invalid cart item at index ${index}: quantity must be a positive number`);
      }
    });

    return data as CartData;
  }
}

/**
 * Default export for convenience
 */
export default CartPersistenceService;