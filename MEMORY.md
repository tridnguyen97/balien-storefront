# OpenCode Memory

## Project: Medusa Storefront (Brim - Luxury Millinery)

---

## Phase 1: Foundation (Completed 2026-04-29)

### Summary
Implemented the foundation layer for Medusa API integration, state management refactoring, and error handling infrastructure.

### Changes Made

#### 1. API Layer (`src/api/`)
**New Files:**
- `client.ts` - Medusa API client with interceptors, error handling, cart ID persistence
- `products.ts` - Product API functions (fetchProducts, fetchProductByHandle, searchProducts, transformProduct)
- `cart.ts` - Cart API functions (createCart, addItemToCart, updateCartItem, removeCartItem, completeCart)

#### 2. React Query Hooks (`src/hooks/`)
**New Files:**
- `useProducts.ts` - Product data management with caching and prefetching
- `useCart.ts` - Cart operations with optimistic updates

#### 3. State Management (`src/lib/cartSlice.ts`)
**Refactored:**
- Added async thunks: `initializeCart`, `addItemAsync`, `updateItemQuantityAsync`, `removeItemAsync`
- Added `calculateTotals()` helper for centralized logic
- Added automatic tax calculation (8%)
- Added `extraReducers` for API response handling
- Added new actions: `setShipping`, `clearCart`
- Fixed duplicate calculation logic

#### 4. Error Handling (`src/components/ErrorBoundary.tsx`)
**New File:**
- React Error Boundary component
- User-friendly fallback UI with "Try Again" and "Reload Page" buttons
- Dev mode error details display

#### 5. App Integration (`src/app/App.tsx`)
**Updated:**
- Wrapped routes in `<ErrorBoundary>`
- Added `<Suspense>` with loading spinner
- Centralized error handling

#### 6. Checkout UX (`src/pages/Checkout.tsx`)
**Updated:**
- Replaced `alert()` with `message.success()` (Ant Design)
- Clears both `brim-cart` and `cart_id` on order completion

#### 7. Tests (`src/__tests__/cart/cart.reducer.test.ts`)
**Fixed:**
- Updated test expectations to account for tax and shipping calculations
- All 31 tests passing

### Architecture Decisions
- **Single Source of Truth**: Redux for state, API for persistence
- **Optimistic Updates**: React Query mutations update cache immediately
- **Error Boundaries**: Catch runtime errors at route level
- **Tax Calculation**: 8% automatic on all cart operations

### Environment Variables Required
```bash
VITE_MEDUSA_API_URL=http://localhost:9000
VITE_MEDUSA_API_KEY=your_publishable_key
```

---

## Active Tasks

### Task: Replace Alert with Ant Design Toast Messages (ProductDetail)

**Status**: Pending
**File**: `src/pages/ProductDetail.tsx`
**Lines to Fix**: ~63, ~83

#### Reference Pattern
File: `notification.tsx`
```typescript
import { message } from 'antd';

const [messageApi, contextHolder] = message.useMessage();

const success = () => {
  messageApi.open({
    type: 'success',
    content: 'Message content',
  });
};

// In JSX:
<>{contextHolder}</>
```

#### Implementation Notes
- Line ~63: Use `warning` type for variant selection
- Line ~83: Use `success` type for add to cart
