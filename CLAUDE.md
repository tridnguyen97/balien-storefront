# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Medusa-based e-commerce storefront with the following structure:

- **`src/app/App.tsx`** - Main router with React Router routes for Home, Products, Cart, Checkout, and Order Confirmation
- **`src/pages/`** - Page components: Home, Products, Cart, Checkout, OrderConfirmation
- **`src/components/`** - Reusable components: Header, Footer, ProductCard, FittingSection
- **`src/lib/`** - Core logic: store (Redux), cartSlice, filtersSlice
- **`src/__tests__/`** - Comprehensive test suite with unit and integration tests

## Key Patterns

- **State Management**: Redux Toolkit with cart and filters slices
- **Testing**: Jest + Testing Library with mock data factories in fixtures.ts
- **Routing**: React Router v6 with static routes
- **Styling**: CSS custom properties with vanilla CSS modules

## Common Commands

```bash
# Run tests
npm test

# Run specific test file
npm test src/__tests__/cart/cart.checkout.test.ts

# Run single test by name
npm test -t "Cart Reducer Tests"

# Watch mode
npm test -- --watch
```

## Development Notes

- All cart operations maintain immutability using Redux best practices
- Test data factories in `src/__tests__/cart/fixtures.ts` ensure consistent test scenarios
- Components use both local state (Checkout stepper) and Redux state (Cart, Products)
- Memory files created: user.md, project.md, feedback.md, MEMORY.md

## Memory System

The Claude memory system is active with:
- User profile for context-aware assistance
- Project context for architectural decisions  
- Feedback tracking for continuous improvement