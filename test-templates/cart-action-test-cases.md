# Cart Action Test Cases (Vitest)

## Test Case Template

### Format
- **Test ID:** AC-XXX
- **Description:** [Clear, concise description]
- **Priority:** P0/P1/P2/P3
- **Type:** Unit/Integration/Performance
- **Preconditions:** [Setup requirements]
- **Steps:** [Detailed steps]
- **Expected Result:** [Observable outcome]
- **Test Data:** [Factory functions used]

---

## Test Cases

### AC-001: Create Add Item Action
**Priority:** P0  
**Type:** Unit  
**Preconditions:** Valid product ID and quantity  
**Steps:**
1. Call `createAddItemAction(productId, quantity)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/addItem',
  payload: {
    productId: 'prod_123',
    quantity: 1,
    options: {}
  }
}
```

**Test Data:**
```javascript
const productId = 'prod_123';
const quantity = 1;
```

---

### AC-002: Create Remove Item Action
**Priority:** P0  
**Type:** Unit  
**Preconditions:** Valid item ID  
**Steps:**
1. Call `createRemoveItemAction(itemId)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/removeItem',
  payload: {
    itemId: 'item_123'
  }
}
```

**Test Data:**
```javascript
const itemId = 'item_123';
```

---

### AC-003: Create Update Quantity Action (Valid)
**Priority:** P0  
**Type:** Unit  
**Preconditions:** Valid item ID and positive quantity  
**Steps:**
1. Call `createUpdateQuantityAction(itemId, newQuantity)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/updateQuantity',
  payload: {
    itemId: 'item_123',
    quantity: 2
  }
}
```

**Test Data:**
```javascript
const itemId = 'item_123';
const newQuantity = 2;
```

---

### AC-004: Create Update Quantity Action (Invalid - Negative)
**Priority:** P0  
**Type:** Unit  
**Preconditions:** Negative quantity  
**Steps:**
1. Call `createUpdateQuantityAction(itemId, -1)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/updateQuantity',
  payload: {
    itemId: 'item_123',
    quantity: 0 // Should default to 0 or throw
  }
}
```

---

### AC-005: Async Add Item Thunk (Success)
**Priority:** P0  
**Type:** Integration  
**Preconditions:** API endpoint available  
**Steps:**
1. Mock API response for add item
2. Dispatch `addItemThunk(productId, quantity)`
3. Wait for async completion
4. Verify dispatched actions

**Expected Result:**
```javascript
// Actions dispatched in order:
1. { type: 'cart/addItem/pending' }
2. { type: 'cart/addItem/fulfilled', payload: {...} }
```

**Mock API:**
```javascript
// MSW handler
rest.post('/api/cart/add', (req, res, ctx) => {
  return res(ctx.status(200), ctx.json({ item: { id: 'item_123' } }));
});
```

---

### AC-006: Async Add Item Thunk (Error)
**Priority:** P1  
**Type:** Integration  
**Preconditions:** API endpoint returns error  
**Steps:**
1. Mock API error response
2. Dispatch `addItemThunk(productId, quantity)`
3. Wait for async completion
4. Verify error action dispatched

**Expected Result:**
```javascript
// Actions dispatched:
1. { type: 'cart/addItem/pending' }
2. { type: 'cart/addItem/rejected', error: {...} }
```

---

### AC-007: Clear Cart Action
**Priority:** P0  
**Type:** Unit  
**Preconditions:** Cart has items  
**Steps:**
1. Dispatch `clearCartAction()`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/clear'
}
```

---

### AC-008: Batch Add Items Action
**Priority:** P1  
**Type:** Unit  
**Preconditions:** Array of valid items  
**Steps:**
1. Call `createAddItemsAction(itemsArray)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/addItems',
  payload: {
    items: [
      { productId: 'prod_1', quantity: 1 },
      { productId: 'prod_2', quantity: 2 }
    ]
  }
}
```

---

### AC-009: Update Item Options Action
**Priority:** P1  
**Type:** Unit  
**Preconditions:** Valid item ID and options  
**Steps:**
1. Call `createUpdateItemOptionsAction(itemId, options)`
2. Verify returned action object

**Expected Result:**
```javascript
{
  type: 'cart/updateItemOptions',
  payload: {
    itemId: 'item_123',
    options: { color: 'red', size: 'M' }
  }
}
```

---

### AC-010: Apply Coupon Action
**Priority:** P1  
**Type:** Integration  
**Preconditions:** Valid coupon code  
**Steps:**
1. Mock API response for coupon validation
2. Dispatch `applyCouponThunk(code)`
3. Verify discount applied

**Expected Result:**
```javascript
// Actions dispatched:
1. { type: 'cart/applyCoupon/pending' }
2. { type: 'cart/applyCoupon/fulfilled', payload: { discount: 0.1 } }
```

---

## Test Data Factories

### Cart Item Factory
```javascript
const createCartItem = (overrides = {}) => ({
  id: 'item_' + Math.random().toString(36).substr(2, 9),
  productId: 'prod_' + Math.random().toString(36).substr(2, 6),
  quantity: 1,
  price: 1000,
  options: {},
  ...overrides
});
```

### Product Factory
```javascript
const createProduct = (overrides = {}) => ({
  id: 'prod_' + Math.random().toString(36).substr(2, 6),
  name: 'Test Product',
  price: 1000,
  options: ['color', 'size'],
  ...overrides
});
```

## Common Test Patterns

### Testing Async Actions
```javascript
describe('addItemThunk', () => {
  it('should dispatch success actions on API success', async () => {
    const actions = [];
    const mockStore = {
      dispatch: (action) => actions.push(action),
      getState: () => initialState
    };
    
    await addItemThunk('prod_123', 1)(mockStore);
    
    expect(actions).toEqual([
      { type: 'cart/addItem/pending' },
      expect.objectContaining({ type: 'cart/addItem/fulfilled' })
    ]);
  });
});
```

### Testing Reducer Immutability
```javascript
describe('cart reducer', () => {
  it('should not mutate state', () => {
    const originalState = { items: [], total: 0 };
    const clonedState = JSON.parse(JSON.stringify(originalState));
    
    cartReducer(originalState, { type: 'cart/addItem', payload: {} });
    
    expect(originalState).toEqual(clonedState);
  });
});
```

## Validation Rules

### Quantity Validation
- Must be positive integer
- Must not exceed inventory
- Must default to 0 or 1 on invalid input

### Product Validation
- Must have valid product ID format
- Must check product availability
- Must validate options against product configuration

## Edge Cases to Test

1. **Empty cart operations** - Remove from empty cart
2. **Maximum quantity** - Add beyond inventory
3. **Invalid product IDs** - Malformed or non-existent
4. **Duplicate items** - Adding same product multiple times
5. **Concurrent updates** - Race conditions
6. **Network failures** - API timeout/errors
7. **Invalid coupon codes** - Expired or invalid
8. **Zero quantity updates** - Should remove item