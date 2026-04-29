# Plan: Update Cart Item Count Badge in Header

## Context

Currently in `Header.tsx` line 92, the cart badge shows a **hardcoded "2"**. The goal is to make it **dynamically display the actual number of items** from the Redux cart state.

### Current State
- **File**: `src/components/Header.tsx`
- **Cart State**: Redux slice (`cartSlice.ts`) has `items: CartItem[]` with quantities
- **Current Code**: `<span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>`
- **Store Structure**: `state.cart.items` available via `useSelector`

---

## Implementation Plan

### Phase 1: Setup (High Priority)

| Step | Action | Description |
|------|--------|-------------|
| 1.1 | Import `useSelector` from react-redux | Add to existing imports at line 2 |
| 1.2 | Import `RootState` from store | Type-safe selector access |

### Phase 2: State Connection (High Priority)

| Step | Action | Description |
|------|--------|-------------|
| 2.1 | Add selector for cart items | `const cartItems = useSelector((state: RootState) => state.cart.items)` |
| 2.2 | Calculate total quantity | `const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)` |

### Phase 3: Badge Update (High Priority)

| Step | Action | Description |
|------|--------|-------------|
| 3.1 | Replace hardcoded "2" | Use `{itemCount}` dynamic value |
| 3.2 | Conditional rendering | Only show badge when `itemCount > 0` |

### Phase 4: UX Enhancements (Medium Priority)

| Step | Action | E-commerce PM Rationale |
|------|--------|----------------------|
| 4.1 | Animate count changes | Subtle transition for visual feedback (conversion psychology) |
| 4.2 | Consider badge limit | Show "9+" for counts >9 to prevent layout shifts |

---

## Code Changes Summary

### Before (line 91-93):
```tsx
<span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
  2
</span>
```

### After:
```tsx
{itemCount > 0 && (
  <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[1.25rem]">
    {itemCount > 9 ? '9+' : itemCount}
  </span>
)}
```

### Full Implementation:
```tsx
import { useSelector } from 'react-redux'; // Add to imports
import { RootState } from '../lib/store';   // Add to imports

const Header: React.FC = () => {
  // ... existing state declarations ...
  
  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Calculate total item count
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // ... rest of component ...
  
  // In the Cart Link:
  <Link
    to="/cart"
    className="text-xs font-medium tracking-wider uppercase transition-colors duration-300 relative"
    style={{ color: scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)' }}
    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
    onMouseLeave={(e) =>
      (e.currentTarget.style.color = scrolled ? 'var(--muted-dark)' : 'rgba(245,240,235,0.7)')
    }
  >
    Cart
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[1.25rem]">
        {itemCount > 9 ? '9+' : itemCount}
      </span>
    )}
  </Link>
```

---

## E-commerce Product Manager Insights

| Metric | Impact |
|--------|--------|
| **Cart Visibility** | Real-time cart count increases trust and reduces abandonment |
| **Badge Psychology** | Red badge creates urgency; hiding at 0 reduces cognitive load |
| **Edge Cases** | Handle empty cart (hide badge), large counts (cap at 9+) |

### Best Practices Applied:
1. **Conditional Display**: Badge only appears when items exist (cleaner UI)
2. **Count Cap**: "9+" prevents badge from growing too wide
3. **Real-time Sync**: Redux ensures count updates immediately across the app

---

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|------------|
| No cart items | Low | Conditional rendering handles empty state |
| Large quantities | Low | Capped at "9+" display |
| Redux connection | Low | Store already configured and working |

**Overall Risk**: **None** - purely UI enhancement, no business logic changes.

---

## Testing Checklist

- [ ] Badge shows correct count when items added to cart
- [ ] Badge updates when item quantity changes
- [ ] Badge hides when cart is empty
- [ ] Badge shows "9+" when count exceeds 9
- [ ] Badge position remains consistent across scroll states

---

*Created: 2026-04-26*
*Skills Applied: E-commerce Product Manager, React Vite Best Practices*
