# Component Mapping Specification

## Overview
This document maps inline JSX patterns found in pages (`src/pages/`) against available reusable components (`src/components/`). It identifies:
- **Direct component usage** - Components currently imported and used
- **Inline JSX patterns** - UI patterns that could be extracted into components
- **Similarity analysis** - Opportunities for reuse and consolidation
- **Recommendations** - Suggested refactoring actions

---

## Available Components Inventory

### 1. Layout Components (`src/components/layout/`)
| Component | Purpose | Exports |
|-----------|---------|---------|
| `MainLayout.tsx` | Page wrapper with Header/Footer | MainLayout |
| `PageHeader.tsx` | Breadcrumb + page title | PageHeader |
| `Container.tsx` | Centered container with max-width | Container |

### 2. Cart Components (`src/components/cart/`)
| Component | Purpose | Exports |
|-----------|---------|---------|
| `MiniCart.tsx` | Slide-out cart preview drawer | MiniCart |

### 3. Product Components (`src/components/product/`)
| Component | Purpose | Exports |
|-----------|---------|---------|
| `ProductGallery.tsx` | Image gallery with zoom/thumbnails | ProductGallery |

### 4. UI Components (`src/components/ui/`)
| Component | Purpose | Exports |
|-----------|---------|---------|
| `AppImage.tsx` | Optimized image with WebP/lazy loading | AppImage |
| `AppIcon.tsx` | Icon wrapper | AppIcon |
| `AppLogo.tsx` | Brand logo component | AppLogo |
| `Price.tsx` | Formatted price display | Price |
| `ProductCard.tsx` | Product grid card with memoization | ProductCard |
| `QuantitySelector.tsx` | +/- quantity controls | QuantitySelector |

### 5. Global Components (`src/components/`)
| Component | Purpose | Exports |
|-----------|---------|---------|
| `Header.tsx` | Navigation with cart badge | Header |
| `Footer.tsx` | Site footer | Footer |
| `HeroSection.tsx` | Home hero banner | HeroSection |
| `FittingSection.tsx` | Filter/sort bar for products | FittingSection |
| `ErrorBoundary.tsx` | Error handling wrapper | ErrorBoundary |

---

## Page-by-Page Analysis

### 1. Home Page (`src/pages/Home.tsx`)

#### Current Imports
```typescript
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Products from './Products';
```

#### Inline JSX Patterns
| Pattern | Location | Description | Reusable? |
|---------|----------|-------------|-----------|
| `grain-overlay` | Line 9 | Background texture div | Yes → `GrainOverlay` |
| `main` wrapper | Line 8 | Background color wrapper | Partial → Use `MainLayout` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Page structure | Inline `<main>` | `MainLayout` | High |
| Navigation | `Header` | `Header` (memoized) | Current ✓ |
| Hero banner | `HeroSection` | `HeroSection` | Current ✓ |
| Product grid | `Products` | `Products` → `ProductCard` | Current ✓ |

#### Recommendations
1. **Replace inline `<main>`** with `MainLayout` component
2. **Extract `grain-overlay`** into separate `GrainOverlay` component for reusability

---

### 2. Products Page (`src/pages/Products.tsx`)

#### Current Imports
```typescript
import { Link } from 'react-router-dom';
import FittingSection from '../components/FittingSection';
import ProductCard from '../components/ui/ProductCard';
```

#### Inline JSX Patterns
| Pattern | Lines | Description | Reusable? |
|---------|-------|-------------|-----------|
| Loading spinner | 48-56 | Centered loading state | Yes → `LoadingSpinner` |
| Error state | 59-72 | Error message + retry button | Yes → `ErrorState` |
| Header spacer | 89 | `<div className="h-16 md:h-20" />` | Yes → `HeaderSpacer` |
| Product grid | 93-99 | Grid container with cards | Partial → `ProductGrid` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Loading state | Inline spinner | `LoadingSpinner` | High |
| Error display | Inline error | `ErrorState` | High |
| Filter bar | `FittingSection` | `FittingSection` | Current ✓ |
| Product cards | `ProductCard` | `ProductCard` (memoized) | Current ✓ |
| Grid layout | Inline grid | `ProductGrid` | Medium |

#### Missing Components Needed
1. **`LoadingSpinner`** - Centered spinner with text (used in Home, Products, ProductDetail)
2. **`ErrorState`** - Error display with retry action (used in Products, ProductDetail)
3. **`HeaderSpacer`** - Fixed header height spacer (used in Products, Cart, Checkout)

---

### 3. Product Detail Page (`src/pages/ProductDetail.tsx`)

#### Current Imports
```typescript
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { addCartItem } from '../lib/cartSlice';
```

#### Inline JSX Patterns (241 lines - most complex)
| Pattern | Lines | Description | Reusable? |
|---------|-------|-------------|-----------|
| Loading spinner | 88-96 | Same as Products | Yes → `LoadingSpinner` |
| Error state | 99-112 | Error with back button | Yes → `ErrorState` |
| Breadcrumb | 117-128 | Home / Category / Product | Yes → `Breadcrumb` |
| Product image gallery | 133-152 | Main image + thumbnails | **Should use** `ProductGallery` |
| Variant selector | 175-198 | Option buttons grid | Yes → `VariantSelector` |
| Quantity selector | 201-218 | +/- buttons | **Should use** `QuantitySelector` |
| Price display | 164-173 | Price with original | **Should use** `Price` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Loading state | Inline | `LoadingSpinner` | High |
| Error display | Inline | `ErrorState` | High |
| Breadcrumb | Inline | `Breadcrumb` | High |
| Image gallery | Inline `<img>` | `ProductGallery` | **Critical** |
| Variant selector | Inline divs | `VariantSelector` | High |
| Quantity controls | Inline buttons | `QuantitySelector` | **Critical** |
| Price display | Inline formatting | `Price` | **Critical** |

#### Critical Issues Found
1. **ProductGallery exists but NOT used** - Page has inline image gallery (lines 133-152)
2. **QuantitySelector exists but NOT used** - Page has inline quantity controls (lines 201-218)
3. **Price component exists but NOT used** - Page has inline price formatting (lines 164-173)

#### Recommendations
1. **Immediate**: Replace inline image gallery with `ProductGallery`
2. **Immediate**: Replace inline quantity controls with `QuantitySelector`
3. **Immediate**: Replace inline price with `Price` component
4. **Create**: `Breadcrumb` component from inline pattern (used in ProductDetail, Cart)
5. **Create**: `VariantSelector` component for product options

---

### 4. Cart Page (`src/pages/Cart.tsx`)

#### Current Imports
```typescript
import { useSelector, useDispatch } from 'react-redux';
import CartPersistenceService from '../lib/cartPersistence';
import { removeCartItem, updateCartItemQuantity, setCartItems } from '../lib/cartSlice';
```

#### Inline JSX Patterns (191 lines)
| Pattern | Lines | Description | Reusable? |
|---------|-------|-------------|-----------|
| Empty cart state | 36-52 | Emoji + message + CTA | Yes → `EmptyCart` |
| Breadcrumb | 56-64 | Home / Cart | Partial → `Breadcrumb` |
| Cart item row | 68-139 | Image + details + quantity + price | Yes → `CartItem` |
| Quantity controls | 101-117 | +/- buttons (same as ProductDetail) | **Should use** `QuantitySelector` |
| Order summary | 142-184 | Subtotal/shipping/tax/total box | Yes → `CartSummary` |
| Price display | 121-128 | Inline price formatting | **Should use** `Price` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Empty state | Inline | `EmptyCart` | High |
| Breadcrumb | Inline | `Breadcrumb` | High |
| Cart items | Inline rows | `CartItem` | High |
| Quantity controls | Inline buttons | `QuantitySelector` | **Critical** |
| Order summary | Inline box | `CartSummary` | High |
| Price display | Inline formatting | `Price` | **Critical** |

#### Critical Issues Found
1. **QuantitySelector NOT used** - Cart has inline quantity controls (lines 101-117)
2. **Price component NOT used** - Cart has inline price formatting (lines 121-128)
3. **MiniCart exists but NOT used** - Could use `MiniCart` for slide-out preview

#### Recommendations
1. **Immediate**: Replace inline quantity controls with `QuantitySelector`
2. **Immediate**: Replace inline price with `Price` component
3. **Create**: `CartItem` component from inline pattern (used in Cart, MiniCart)
4. **Create**: `CartSummary` component from order summary box
5. **Create**: `EmptyCart` component for empty state
6. **Consider**: Use `MiniCart` for mobile cart experience

---

### 5. Checkout Page (`src/pages/Checkout.tsx`)

#### Current Imports
```typescript
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
```

#### Inline JSX Patterns (298 lines)
| Pattern | Lines | Description | Reusable? |
|---------|-------|-------------|-----------|
| Shipping form | 75-165 | Address inputs with validation | Yes → `ShippingForm` |
| Payment form | 168-245 | Card inputs with validation | Yes → `PaymentForm` |
| Order review | 247-295 | Summary + action buttons | Yes → `OrderReview` |
| Form inputs | Throughout | Styled input/select elements | Yes → `FormInput`, `FormSelect` |
| Validation errors | 88-146 | Error message display | Yes → `FormError` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Shipping step | Inline form | `ShippingForm` | High |
| Payment step | Inline form | `PaymentForm` | High |
| Review step | Inline summary | `OrderReview` | High |
| Text inputs | Inline | `FormInput` | Medium |
| Select inputs | Inline | `FormSelect` | Medium |
| Error messages | Inline | `FormError` | Medium |

#### Missing Components Needed
1. **`ShippingForm`** - Address entry with validation
2. **`PaymentForm`** - Card entry with validation
3. **`OrderReview`** - Order summary with actions
4. **`FormInput`** - Consistent styled input
5. **`FormSelect`** - Consistent styled select
6. **`FormError`** - Validation error display

#### Recommendations
1. **Create**: Checkout-specific form components from existing patterns
2. **Refactor**: Extract form input patterns from Checkout into reusable components
3. **Consider**: Use `StepIndicator` for multi-step checkout progress

---

### 6. Order Confirmation Page (`src/pages/OrderConfirmation.tsx`)

#### Current Imports
```typescript
import { Link } from 'react-router-dom';
```

#### Inline JSX Patterns (32 lines - simplest)
| Pattern | Lines | Description | Reusable? |
|---------|-------|-------------|-----------|
| Success state | 6-28 | Icon + title + order details + CTA | Yes → `OrderSuccess` |
| Order summary card | 13-20 | Product/shipping/total display | Partial → `OrderSummary` |

#### Component Usage Mapping
| Pattern | Currently Uses | Should Use | Priority |
|---------|----------------|------------|----------|
| Success page | Inline | `OrderSuccess` | Medium |
| Order details | Inline card | `OrderSummary` | Medium |

#### Recommendations
1. **Create**: `OrderSuccess` component for post-purchase experience
2. **Create**: `OrderSummary` component (could share with Checkout review)

---

## Similarity Analysis & Consolidation Opportunities

### Pattern: Quantity Selector
| Location | Current Implementation | Target Component |
|----------|----------------------|------------------|
| ProductDetail.tsx (201-218) | Inline buttons | `QuantitySelector` |
| Cart.tsx (101-117) | Inline buttons | `QuantitySelector` |
| MiniCart.tsx (85-105) | Inline buttons | `QuantitySelector` |

**Consolidation Benefit**: 3 implementations → 1 component
**Effort**: Replace inline JSX with `<QuantitySelector value={qty} onChange={setQty} />`

### Pattern: Price Display
| Location | Current Implementation | Target Component |
|----------|----------------------|------------------|
| ProductDetail.tsx (164-173) | Inline formatting | `Price` |
| Cart.tsx (121-128) | Inline formatting | `Price` |
| MiniCart.tsx (109-113) | Inline formatting | `Price` |

**Consolidation Benefit**: 3 implementations → 1 component
**Effort**: Replace with `<Price amount={price} size="lg" />`

### Pattern: Loading State
| Location | Current Implementation | Target Component |
|----------|----------------------|------------------|
| Products.tsx (48-56) | Inline spinner | `LoadingSpinner` |
| ProductDetail.tsx (88-96) | Inline spinner | `LoadingSpinner` |
| MiniCart.tsx (22-24) | "Loading cart..." text | `LoadingSpinner` |

**Consolidation Benefit**: 2 full + 1 basic → 1 consistent component
**Effort**: Standardize loading UX across pages

### Pattern: Breadcrumb Navigation
| Location | Current Implementation | Target Component |
|----------|----------------------|------------------|
| ProductDetail.tsx (117-128) | Inline spans | `Breadcrumb` |
| Cart.tsx (56-64) | Inline spans | `Breadcrumb` |
| PageHeader.tsx | Not used here | `PageHeader` has breadcrumbs |

**Consolidation Benefit**: 2 inline + existing component → unified `Breadcrumb`
**Effort**: Create shared `Breadcrumb` or use `PageHeader` with breadcrumbs

---

## Component Reuse Matrix

| Component | Used In | Missing In | Priority |
|-----------|---------|------------|----------|
| **ProductCard** | Products.tsx | — | Current ✓ |
| **ProductGallery** | — | ProductDetail.tsx | **Critical** |
| **QuantitySelector** | — | ProductDetail.tsx, Cart.tsx | **Critical** |
| **Price** | — | ProductDetail.tsx, Cart.tsx | **Critical** |
| **MiniCart** | — | Cart.tsx (for mobile) | Medium |
| **MainLayout** | — | Home.tsx, Products.tsx | High |
| **PageHeader** | — | Products.tsx, Cart.tsx | Medium |
| **Container** | — | Multiple pages | Medium |

---

## New Components to Create

### High Priority (Critical for consistency)
1. **`Breadcrumb`** - Navigation breadcrumb (ProductDetail, Cart)
2. **`LoadingSpinner`** - Centered loading state (Home, Products, ProductDetail, MiniCart)
3. **`ErrorState`** - Error display with retry (Products, ProductDetail)
4. **`CartItem`** - Cart line item row (Cart, MiniCart)
5. **`CartSummary`** - Order totals box (Cart, Checkout review)

### Medium Priority (UX improvement)
6. **`EmptyCart`** - Empty cart state (Cart)
7. **`VariantSelector`** - Product variant options (ProductDetail)
8. **`OrderSuccess`** - Post-purchase success (OrderConfirmation)
9. **`OrderSummary`** - Order details display (OrderConfirmation, Checkout)

### Low Priority (Nice to have)
10. **`GrainOverlay`** - Background texture effect (Home)
11. **`HeaderSpacer`** - Fixed header height placeholder (Products, Cart, Checkout)
12. **`FormInput`** - Styled text input (Checkout)
13. **`FormSelect`** - Styled select input (Checkout)
14. **`FormError`** - Validation error message (Checkout)

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Immediate)
1. Replace ProductDetail image gallery with `ProductGallery`
2. Replace ProductDetail quantity controls with `QuantitySelector`
3. Replace ProductDetail price display with `Price`
4. Replace Cart quantity controls with `QuantitySelector`
5. Replace Cart price display with `Price`

### Phase 2: Page Structure (Week 1)
6. Implement `MainLayout` in Home.tsx and Products.tsx
7. Create and implement `Breadcrumb` component
8. Create and implement `LoadingSpinner` component
9. Create and implement `ErrorState` component

### Phase 3: Cart Improvements (Week 2)
10. Create `CartItem` component
11. Create `CartSummary` component
12. Create `EmptyCart` component
13. Consider `MiniCart` integration for mobile

### Phase 4: Checkout & Forms (Week 3)
14. Extract form components from Checkout
15. Create `ShippingForm`, `PaymentForm`, `OrderReview`
16. Create form primitives: `FormInput`, `FormSelect`, `FormError`

### Phase 5: Polish (Week 4)
17. Create `OrderSuccess` and `OrderSummary`
18. Implement `HeaderSpacer` for consistent spacing
19. Extract `GrainOverlay` if needed elsewhere

---

## Test Impact Assessment

All refactors should maintain passing tests. Key considerations:

| Refactor | Test Files Affected | Risk Level |
|----------|---------------------|------------|
| Replace inline JSX with components | Component tests only | Low |
| Add MainLayout wrapper | Layout tests | Low |
| Extract new components | New component tests needed | Medium |
| Replace form inputs | Checkout integration tests | **High** |

**Recommendation**: Create component tests for each new component before integration.

---

## Summary Statistics

### Current State
- **Pages analyzed**: 6
- **Total lines of JSX**: ~1,400
- **Inline JSX patterns identified**: 25+
- **Available components**: 13
- **Components actually used in pages**: 4 (`Header`, `HeroSection`, `FittingSection`, `ProductCard`)

### Consolidation Opportunity
- **Duplicate patterns**: 12
- **Potential component extractions**: 14 new components
- **Estimated code reduction**: 30-40% (removing duplicate inline JSX)
- **Estimated bundle impact**: Neutral to positive (tree-shaking unused patterns)

### Critical Gaps
1. **3 components exist but are NOT being used** (ProductGallery, QuantitySelector, Price)
2. **No layout wrapper** being used (MainLayout exists but unused)
3. **Inconsistent loading states** across 3 pages
4. **Inconsistent error handling** across 2 pages
5. **Inline quantity controls duplicated** in 3 locations

---

*Document generated: 2026-04-29*
*Next review: After Phase 1 implementation*
