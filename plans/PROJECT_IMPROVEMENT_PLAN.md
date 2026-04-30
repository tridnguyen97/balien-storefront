# Medusa Storefront Improvement Plan

## Project Overview
**Type**: Medusa-based E-commerce Storefront (Luxury Millinery - "Brim")  
**Tech Stack**: React 18 + Vite + TypeScript + Redux Toolkit + Tailwind CSS + Ant Design  
**Current State**: Functional MVP with core cart, checkout, and product features

---

## Directory Structure (Current)

```
medusa-storefront/
├── src/
│   ├── app/
│   │   └── App.tsx                    # Main router component
│   ├── pages/
│   │   ├── Home.tsx                   # Landing page with Hero + Products
│   │   ├── Products.tsx               # Product listing grid
│   │   ├── ProductDetail.tsx          # Single product view with variants
│   │   ├── Cart.tsx                   # Shopping cart with order summary
│   │   ├── Checkout.tsx               # Multi-step checkout (shipping/payment/review)
│   │   └── OrderConfirmation.tsx      # Order success page
│   ├── components/
│   │   ├── Header.tsx                 # Navigation with scroll effects
│   │   ├── Footer.tsx                 # Site footer
│   │   ├── HeroSection.tsx            # Homepage hero banner
│   │   ├── FittingSection.tsx         # Book fitting CTA
│   │   └── ui/
│   │       ├── AppImage.tsx           # Optimized image component
│   │       ├── AppIcon.tsx            # Icon wrapper
│   │       └── AppLogo.tsx            # Brand logo component
│   ├── lib/
│   │   ├── store.ts                   # Redux store configuration
│   │   ├── cartSlice.ts               # Cart state management
│   │   ├── filtersSlice.ts            # Product filter state
│   │   ├── cartPersistence.ts         # LocalStorage persistence
│   │   └── queryClient.ts             # React Query client
│   ├── __tests__/
│   │   ├── cart/
│   │   │   ├── fixtures.ts            # Test data factories
│   │   │   ├── cart.reducer.test.ts   # Cart reducer tests
│   │   │   ├── cart.actions.test.ts   # Cart action tests
│   │   │   ├── cart.checkout.test.tsx # Checkout flow tests
│   │   │   └── cart.integration.test.tsx # Integration tests
│   │   └── utils/
│   │       └── test-utils.tsx         # Test utilities
│   ├── main.tsx                       # App entry point
│   ├── App.tsx                        # Alternative app component
│   └── router.tsx                     # Route configuration
├── notification.tsx                   # Ant Design toast pattern (reference)
├── MEMORY.md                          # OpenCode memory
├── package.json                       # Dependencies
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind styling
└── tsconfig.json                      # TypeScript config
```

---

## Improvement Areas & Recommendations

### 1. Performance Optimization (React + Vite Best Practices)

#### Critical Issues
| Issue | Location | Priority | Solution |
|-------|----------|----------|----------|
| Mock data in components | Products.tsx, ProductDetail.tsx | **High** | Implement Medusa API integration |
| No code splitting | App.tsx | **Medium** | Add React.lazy() for routes |
| Missing error boundaries | All pages | **Medium** | Add ErrorBoundary component |
| Images not optimized | ProductDetail.tsx | **Medium** | Implement lazy loading + WebP |

#### Vite Optimizations
```typescript
// vite.config.ts improvements
- Add rollupOptions for manual chunking
- Configure build.minify for production
- Add visualizer plugin for bundle analysis
```

**Directory Target**: `src/` (all components)

---

### 2. E-commerce UX Enhancements

#### Cart & Checkout
| Feature | Current | Recommended | Impact |
|---------|---------|-------------|--------|
| Cart persistence | localStorage | localStorage + sessionStorage fallback | Reliability |
| Quantity controls | Inline buttons | Inline + quick select dropdown | Usability |
| Price display | Static | Real-time with currency formatter | Trust |
| Checkout validation | None | Formik/React Hook Form + Zod | Conversion |
| Progress indicator | Step state | Visual stepper component | Completion |

#### Product Experience
| Feature | Current | Recommended | Impact |
|---------|---------|-------------|--------|
| Product images | Single image | Gallery with zoom + thumbnails | Engagement |
| Variant selection | Text boxes | Color swatches + size buttons | Conversion |
| Stock status | Boolean | Real-time inventory badge | Trust |
| Quick add | None | "Add to Cart" from grid | Conversion |
| Wishlist | None | Add wishlist feature | Retention |

**Directory Targets**: 
- `src/pages/Cart.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Products.tsx`

---

### 3. State Management Improvements

#### Current Issues
```
src/lib/cartSlice.ts:
- Cart calculations duplicated in every reducer
- No async thunks for API calls
- Missing optimistic updates
- No cart recovery on session timeout
```

#### Recommended Architecture
```
src/lib/
├── store.ts                    # Existing - keep
├── slices/
│   ├── cartSlice.ts            # Refactored with createAsyncThunk
│   ├── filtersSlice.ts         # Existing - add more filters
│   ├── checkoutSlice.ts        # NEW: Checkout flow state
│   ├── userSlice.ts            # NEW: User/auth state
│   └── wishlistSlice.ts        # NEW: Wishlist state
├── thunks/
│   ├── cartThunks.ts           # NEW: Async cart operations
│   ├── productThunks.ts        # NEW: Product fetching
│   └── checkoutThunks.ts       # NEW: Payment processing
└── selectors/
    └── cartSelectors.ts        # NEW: Memoized selectors
```

---

### 4. Component Architecture Refactoring

#### Current Structure Issues
- Mix of business logic and UI in pages
- No shared loading/error states
- Duplicate navigation logic in Header

#### Proposed Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx      # NEW: Header + Footer wrapper
│   │   ├── PageHeader.tsx      # NEW: Breadcrumb + title
│   │   └── Container.tsx       # NEW: Max-width wrapper
│   ├── ui/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── ProductCard/
│   │   ├── QuantitySelector/
│   │   ├── Price/
│   │   └── Loading/
│   ├── product/
│   │   ├── ProductGallery.tsx  # NEW: Image gallery
│   │   ├── ProductInfo.tsx     # NEW: Details panel
│   │   ├── VariantSelector.tsx # NEW: Options picker
│   │   ├── AddToCartButton.tsx # NEW: Cart CTA
│   │   └── ProductGrid.tsx     # NEW: Products list
│   ├── cart/
│   │   ├── CartItem.tsx        # NEW: Single item row
│   │   ├── CartSummary.tsx     # NEW: Order totals
│   │   ├── CartEmpty.tsx       # NEW: Empty state
│   │   └── MiniCart.tsx        # NEW: Drawer cart
│   └── checkout/
│       ├── ShippingForm.tsx    # NEW: Address form
│       ├── PaymentForm.tsx     # NEW: Card form
│       ├── OrderReview.tsx     # NEW: Final review
│       └── CheckoutProgress.tsx # NEW: Step indicator
```

---

### 5. API Integration (Medusa.js)

#### Current: Mock Data
```typescript
// Products.tsx - using static mock data
const mockProducts = Array.from({ length: 12 }, ...)
```

#### Target: Medusa API
```
src/
├── api/
│   ├── client.ts               # NEW: Medusa client configuration
│   ├── products.ts             # NEW: Product API calls
│   ├── cart.ts                 # NEW: Cart API calls
│   ├── checkout.ts             # NEW: Checkout API calls
│   └── regions.ts              # NEW: Region/currency settings
├── hooks/
│   ├── useProducts.ts          # NEW: Product queries
│   ├── useCart.ts              # NEW: Cart queries + mutations
│   ├── useCheckout.ts          # NEW: Checkout flow
│   └── useRegions.ts           # NEW: Region context
```

**Medusa Endpoints to Implement**:
- `GET /store/products` - Product listing
- `GET /store/products/:id` - Product details
- `POST /store/carts` - Create cart
- `POST /store/carts/:id/line-items` - Add item
- `POST /store/carts/:id/complete` - Complete order

---

### 6. Testing Strategy Enhancement

#### Current Coverage
- Cart reducer tests ✅
- Cart actions tests ✅
- Basic integration tests ✅

#### Missing Coverage
```
src/__tests__/
├── unit/
│   ├── components/
│   │   ├── ProductCard.test.tsx    # Component rendering
│   │   ├── CartItem.test.tsx       # Interaction tests
│   │   └── QuantitySelector.test.tsx # State tests
│   ├── hooks/
│   │   ├── useCart.test.ts         # Hook behavior
│   │   └── useProducts.test.ts     # API mocking
│   └── utils/
│       └── formatters.test.ts      # Price/formatting
├── integration/
│   ├── checkout-flow.test.tsx      # Full purchase flow
│   ├── cart-persistence.test.ts    # localStorage tests
│   └── routing.test.tsx            # Navigation tests
└── e2e/
    └── playwright/                 # NEW: E2E test suite
        ├── cart.spec.ts
        ├── checkout.spec.ts
        └── product.spec.ts
```

---

### 7. SEO & Marketing Enhancements

#### Metadata & Performance
```
public/
├── seo/
│   ├── schema/
│   │   ├── product.schema.json   # NEW: Product structured data
│   │   ├── organization.schema.json
│   │   └── breadcrumb.schema.json
│   └── images/
│       └── og-default.jpg        # NEW: Social share image
```

#### Features to Add
| Feature | Implementation | Location |
|---------|------------------|----------|
| Meta tags | react-helmet-async | All pages |
| Open Graph | Dynamic meta | ProductDetail.tsx |
| Structured data | JSON-LD | Product pages |
| Sitemap | sitemap.xml | Public folder |
| Robots.txt | SEO rules | Public folder |

---

### 8. Accessibility (A11y) Improvements

#### Current Gaps
- Missing form labels in Checkout.tsx
- No focus management on page transitions
- Low color contrast in some text elements

#### Improvements
```
src/
├── hooks/
│   └── useFocusManagement.ts   # NEW: Focus trap for modals
├── components/
│   └── ui/
│       ├── SkipLink.tsx        # NEW: Skip to content
│       ├── LiveRegion.tsx      # NEW: Screen reader announcements
│       └── FormError.tsx       # NEW: Accessible error messages
```

**Target Files**:
- `src/pages/Checkout.tsx` - Add proper labels
- `src/components/Header.tsx` - Add skip navigation
- `src/pages/ProductDetail.tsx` - Add ARIA live regions

---

## Implementation Priority Matrix

### Phase 1: Foundation (Week 1-2)
- [ ] Implement proper API layer (`src/api/`)
- [ ] Refactor cartSlice with async thunks
- [ ] Add Error Boundary component
- [ ] Replace remaining `alert()` calls (Checkout.tsx line 27)

### Phase 2: UX Enhancement (Week 3-4)
- [ ] Build reusable component library
- [ ] Implement proper form validation in Checkout
- [ ] Add MiniCart drawer component
- [ ] Create ProductGallery with zoom

### Phase 3: Performance (Week 5-6)
- [ ] Implement code splitting (React.lazy)
- [ ] Optimize images (WebP + lazy loading)
- [ ] Add React.memo for expensive components
- [ ] Configure Vite build optimization

### Phase 4: SEO & Marketing (Week 7-8)
- [ ] Add meta tags to all pages
- [ ] Implement structured data
- [ ] Create sitemap
- [ ] Add social sharing

---

## Key Files for Immediate Attention

1. **`src/pages/Checkout.tsx`**
   - Line 27: Replace `alert()` with Ant Design message
   - Add form validation
   - Connect to real payment processing

2. **`src/pages/Products.tsx`**
   - Replace mock data with Medusa API
   - Add pagination/infinite scroll
   - Implement search functionality

3. **`src/lib/cartSlice.ts`**
   - Refactor duplicate calculation logic
   - Add async thunks for API integration
   - Implement optimistic updates

4. **`src/pages/ProductDetail.tsx`**
   - ✅ Toast messages (completed)
   - Add product image gallery
   - Implement recently viewed

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lighthouse Performance | ~60 | >90 | Lighthouse CI |
| Test Coverage | ~40% | >80% | Jest coverage |
| Bundle Size | Unknown | <200KB initial | Webpack Analyzer |
| Conversion Rate | N/A | Baseline + analytics | GA/Medusa |
| Cart Abandonment | N/A | Track & reduce | Medusa analytics |

---

*Last Updated: 2026-04-27*  
*Next Review: After Phase 1 completion*
