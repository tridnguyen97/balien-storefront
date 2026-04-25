import { CartItem } from './cartSlice';

export interface CartMetadata {
  version: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CartData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
  metadata?: CartMetadata;
}

const CART_VERSION = 1;
const CART_EXPIRATION_DAYS = 30;

export class CartPersistenceService {
  private static STORAGE_KEY = 'brim-cart';

  /**
   * Check if running in browser environment
   */
  private static isClient(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  /**
   * Generate cart metadata
   */
  private static createMetadata(existingMetadata?: CartMetadata): CartMetadata {
    const now = new Date().toISOString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + CART_EXPIRATION_DAYS);

    return {
      version: CART_VERSION,
      createdAt: existingMetadata?.createdAt || now,
      updatedAt: now,
      expiresAt: expiresAt.toISOString()
    };
  }

  /**
   * Check if cart has expired
   */
  private static isExpired(metadata?: CartMetadata): boolean {
    if (!metadata?.expiresAt) return false;
    return new Date(metadata.expiresAt) < new Date();
  }

  /**
   * Save cart data to localStorage with validation
   * @param cart - Cart data to persist
   */
  static saveCart(cart: CartData): void {
    if (!this.isClient()) {
      console.warn('Cannot save cart: not in browser environment');
      return;
    }

    try {
      const validatedCart = this.validateCartData(cart);
      const cartWithMetadata: CartData = {
        ...validatedCart,
        metadata: this.createMetadata(cart.metadata)
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartWithMetadata));
    } catch (error) {
      console.error('Failed to save cart:', error);
      // Fallback: clear corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
      throw error;
    }
  }

  /**
   * Load cart data from localStorage with validation
   * @returns Cart data or null if not found/invalid/expired
   */
  static loadCart(): CartData | null {
    if (!this.isClient()) {
      console.warn('Cannot load cart: not in browser environment');
      return null;
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);
      const validated = this.validateCartData(parsed);

      // Check expiration
      if (this.isExpired(validated.metadata)) {
        console.log('Cart expired, clearing...');
        this.clearCart();
        return null;
      }

      return validated;
    } catch (error) {
      console.error('Failed to load cart:', error);
      return null;
    }
  }

  /**
   * Clear cart data from localStorage
   */
  static clearCart(): void {
    if (!this.isClient()) {
      console.warn('Cannot clear cart: not in browser environment');
      return;
    }
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if localStorage quota is exceeded
   */
  private static isQuotaExceededError(error: Error): boolean {
    return error.name === 'QuotaExceededError' ||
           error.name === 'NS_QUOTA_EXCEEDED_ERR' ||
           error.message?.toLowerCase().includes('quota');
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