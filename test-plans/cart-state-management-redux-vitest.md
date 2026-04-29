# Cart State Management Redux - Test Plan (Vitest)

## Test Plan Overview

**Feature:** Cart State Management (Redux)
**Framework:** Vitest
**Scope:** Redux store, actions, reducers, selectors, and integration tests
**Test Level:** Unit, Integration, and State Management

## 1. Test Objectives

- Validate Redux cart state management functionality
- Ensure actions, reducers, and selectors work correctly
- Test cart operations (add, remove, update items)
- Verify state persistence and immutability
- Confirm integration with Medusa API

## 2. Test Scope

### In Scope
- Cart reducer logic
- Cart actions and action creators
- Cart selectors (reselect)
- Cart state persistence
- Integration with Medusa API endpoints
- Cart item validation
- Quantity management
- Discount/coupon handling

### Out of Scope
- UI component rendering (use separate component tests)
- Payment processing flows
- User authentication
- Shipping calculations

## 3. Test Environment

- **Framework:** Vitest with Vue 3 / React
- **State Management:** Redux Toolkit
- **Testing Library:** @testing-library/vue / @testing-library/react
- **Mocking:** MSW (Mock Service Worker) for API calls
- **Coverage:** Vitest coverage reporting

## 4. Test Strategy

### 4.1 Unit Tests (Actions & Reducers)
- Test individual action creators
- Test reducer pure functions
- Test initial state and default cases
- Test edge cases and invalid inputs

### 4.2 Integration Tests
- Test action → reducer → selector flow
- Test async thunk actions
- Test API integration
- Test state updates across multiple actions

### 4.3 Selectors Tests
- Test memoized selector outputs
- Test selector with different state shapes
- Test performance characteristics

## 5. Test Data Strategy

- Use factory functions for test data
- Generate realistic cart items with variations
- Include edge cases: empty cart, max quantities, invalid data
- Mock API responses with consistent structure

## 6. Test Cases

### 6.1 Cart Reducer Tests

| Test ID | Description | Priority | Test Type |
|---------|-------------|----------|----------|
| CR-001 | Initial state is correct | P0 | Unit |
| CR-002 | ADD_ITEM action adds item correctly | P0 | Unit |
| CR-003 | REMOVE_ITEM action removes item correctly | P0 | Unit |
| CR-004 | UPDATE_QUANTITY action updates quantity | P0 | Unit |
| CR-005 | CLEAR_CART action resets state | P0 | Unit |
| CR-006 | Reducer handles unknown actions | P1 | Unit |
| CR-007 | Reducer maintains immutability | P0 | Unit |

### 6.2 Action Creator Tests

| Test ID | Description | Priority | Test Type |
|---------|-------------|----------|----------|
| AC-001 | createAddItemAction creates valid action | P0 | Unit |
| AC-002 | createRemoveItemAction creates valid action | P0 | Unit |
| AC-003 | createUpdateQuantityAction validates input | P0 | Unit |
| AC-004 | Async thunk dispatches correct actions | P0 | Integration |
| AC-005 | Async thunk handles API errors | P1 | Integration |

### 6.3 Selector Tests

| Test ID | Description | Priority | Test Type |
|---------|-------------|----------|----------|
| SL-001 | getCartItems returns correct items | P0 | Unit |
| SL-002 | getCartTotal calculates correctly | P0 | Unit |
| SL-003 | getCartItemCount returns correct count | P0 | Unit |
| SL-004 | getCartWithDiscount applies discounts | P1 | Unit |
| SL-005 | Selectors are memoized | P2 | Performance |

### 6.4 Integration Tests

| Test ID | Description | Priority | Test Type |
|---------|-------------|----------|----------|
| IT-001 | Add item → Update quantity → Remove flow | P1 | Integration |
| IT-002 | Cart persists across state updates | P1 | Integration |
| IT-003 | API fetch → State update → UI render | P1 | Integration |
| IT-004 | Error handling in async actions | P2 | Integration |

## 7. Testing Approach

### 7.1 Unit Testing Pattern
```
1. Setup: Create mock state, define test case
2. Execute: Call action/reducer/selector
3. Verify: Assert expected state/output
4. Cleanup: Reset mocks
```

### 7.2 Integration Testing Pattern
```
1. Setup: Configure store with middleware
2. Mock: API responses using MSW
3. Execute: Dispatch async actions
4. Verify: State changes and API calls
5. Assert: Final state matches expectations
```

## 8. Quality Metrics

- **Unit Test Coverage:** Target 90%+ for cart reducer
- **Action Coverage:** Test all action creators
- **Branch Coverage:** Test all reducer branches
- **Performance:** Selectors should be memoized
- **Flakiness:** Zero tolerance for flaky tests

## 9. Test Organization

### File Structure
```
src/
  __tests__/
    cart/
      cart.actions.test.ts
      cart.reducer.test.ts
      cart.selectors.test.ts
      cart.integration.test.ts
      fixtures/
        cart.test.data.ts
```

### Naming Conventions
- Test files: `*.test.ts` or `*.spec.ts`
- Test descriptions: Use Gherkin style: "should [action] when [condition]"
- Test IDs: Use prefix based on file (CR=reducer, AC=action, SL=selector, IT=integration)

## 10. Best Practices

### 10.1 Test Writing
- Use descriptive test names
- Keep tests independent and isolated
- Use factory functions for test data
- Test edge cases and error conditions
- Include negative test cases

### 10.2 Mocking Strategy
- Mock API calls with MSW
- Use realistic but synthetic data
- Test error scenarios (404, 500, timeout)
- Avoid over-mocking (test real logic)

### 10.3 Assertions
- Use Vitest's expect assertions
- Test state shapes, not implementation
- Verify immutability patterns
- Check action payloads

## 11. Execution Plan

### Phase 1: Unit Tests (Week 1)
- [ ] Set up test environment
- [ ] Write reducer tests
- [ ] Write action creator tests
- [ ] Run and debug tests

### Phase 2: Integration Tests (Week 2)
- [ ] Set up API mocking
- [ ] Write async action tests
- [ ] Test state persistence
- [ ] Test error handling

### Phase 3: Selector Tests (Week 3)
- [ ] Write basic selector tests
- [ ] Test memoization
- [ ] Test performance
- [ ] Optimize selectors

### Phase 4: Final Integration (Week 4)
- [ ] Run full test suite
- [ ] Check coverage report
- [ ] Fix failing tests
- [ ] Performance optimization

## 12. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Async test flakiness | High | Medium | Use proper wait strategies, mock APIs |
| State mutation bugs | High | Low | Immutable patterns, thorough testing |
| Selector performance issues | Medium | Medium | Memoization testing, benchmark |
| API integration failures | Medium | Low | Comprehensive mocking, error testing |

## 13. Deliverables

- [ ] Complete test suite for cart state management
- [ ] 90%+ code coverage report
- [ ] Performance benchmarks for selectors
- [ ] Documentation of test patterns
- [ ] CI/CD integration for test execution

## 14. Success Criteria

- All critical tests pass (P0 priority)
- No flaky tests in the suite
- Code coverage meets target thresholds
- Performance benchmarks are met
- Tests can run in isolation and parallel

## 15. Maintenance Plan

- Review test suite monthly
- Update tests with feature changes
- Monitor test execution time
- Refactor tests as codebase evolves
- Add new tests for bug fixes

---

**Generated:** 2026-04-16  
**Framework:** Vitest  
**Status:** Planning Phase  
**Next Steps:** Review with team, estimate effort, begin Phase 1 implementation