import { createAddItemAction, createRemoveItemAction, createUpdateQuantityAction, createClearCartAction, createAddItemsAction, createUpdateItemOptionsAction, createApplyCouponAction } from '../../lib/cartSlice';
import { CartItem } from '../../lib/cartSlice';
import { createCartItem, createProduct, sampleCartItems, sampleProduct } from './fixtures';

describe('Cart Action Creator Tests', () => {
  describe('createAddItemAction', () => {
    it('AC-001: Creates add item action with correct structure', () => {
      const result = createAddItemAction('prod_123', 2);

      expect(result).toEqual({
        type: 'cart/addItem',
        payload: {
          productId: 'prod_123',
          quantity: 2,
          options: {}
        }
      });
    });

    it('AC-001: Creates add item action with options', () => {
      const result = createAddItemAction('prod_456', 1, { color: 'red', size: 'M' });

      expect(result).toEqual({
        type: 'cart/addItem',
        payload: {
          productId: 'prod_456',
          quantity: 1,
          options: { color: 'red', size: 'M' }
        }
      });
    });
  });

  describe('createRemoveItemAction', () => {
    it('AC-002: Creates remove item action with correct structure', () => {
      const result = createRemoveItemAction('item_123');

      expect(result).toEqual({
        type: 'cart/removeItem',
        payload: {
          itemId: 'item_123'
        }
      });
    });
  });

  describe('createUpdateQuantityAction', () => {
    it('AC-003: Creates update quantity action with valid input', () => {
      const result = createUpdateQuantityAction('item_123', 5);

      expect(result).toEqual({
        type: 'cart/updateQuantity',
        payload: {
          id: 'item_123',
          quantity: 5
        }
      });
    });

    it('AC-004: Handles invalid negative quantity', () => {
      const result = createUpdateQuantityAction('item_123', -1);

      expect(result).toEqual({
        type: 'cart/updateQuantity',
        payload: {
          id: 'item_123',
          quantity: 0
        }
      });
    });

    it('AC-004: Handles invalid zero quantity', () => {
      const result = createUpdateQuantityAction('item_123', 0);

      expect(result).toEqual({
        type: 'cart/updateQuantity',
        payload: {
          id: 'item_123',
          quantity: 0
        }
      });
    });
  });

  describe('createClearCartAction', () => {
    it('AC-007: Creates clear cart action', () => {
      const result = createClearCartAction();

      expect(result).toEqual({
        type: 'cart/clear'
      });
    });
  });

  describe('createAddItemsAction', () => {
    it('AC-008: Creates add multiple items action', () => {
      const items: CartItem[] = [
        {
          id: 'item1',
          title: 'Item 1',
          handle: 'item-1',
          price: 1000,
          image: 'item1.jpg',
          quantity: 1
        },
        {
          id: 'item2',
          title: 'Item 2',
          handle: 'item-2',
          price: 2000,
          image: 'item2.jpg',
          quantity: 2
        }
      ];

      const result = createAddItemsAction(items);

      expect(result).toEqual({
        type: 'cart/addItems',
        payload: {
          items: items
        }
      });
    });
  });

  describe('createUpdateItemOptionsAction', () => {
    it('AC-009: Creates update item options action', () => {
      const result = createUpdateItemOptionsAction('item_123', { color: 'blue', size: 'L' });

      expect(result).toEqual({
        type: 'cart/updateItemOptions',
        payload: {
          itemId: 'item_123',
          options: { color: 'blue', size: 'L' }
        }
      });
    });
  });

  describe('createApplyCouponAction', () => {
    it('AC-010: Creates apply coupon action', () => {
      const result = createApplyCouponAction('SAVE10');

      expect(result).toEqual({
        type: 'cart/applyCoupon',
        payload: {
          code: 'SAVE10'
        }
      });
    });
  });

  describe('Factory Functions', () => {
    it('Creates valid cart item using factory', () => {
      const item = createCartItem({
        id: 'custom_id',
        title: 'Custom Item',
        handle: 'custom',
        price: 1500,
        image: 'custom.jpg',
        quantity: 3
      });

      expect(item.id).toBe('custom_id');
      expect(item.title).toBe('Custom Item');
      expect(item.quantity).toBe(3);
      expect(item.price).toBe(1500);
    });

    it('Creates valid product using factory', () => {
      const product = createProduct({
        id: 'custom_prod',
        name: 'Custom Product',
        price: 999,
        options: ['color', 'size']
      });

      expect(product.id).toBe('custom_prod');
      expect(product.name).toBe('Custom Product');
      expect(product.price).toBe(999);
      expect(product.options).toEqual(['color', 'size']);
    });
  });
});