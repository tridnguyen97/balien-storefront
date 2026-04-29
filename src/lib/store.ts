import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  filters: filtersReducer,
  cart: cartReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

// Infer the PreloadedState type from the root reducer's first parameter
export type PreloadedState = Parameters<typeof rootReducer>[0];

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  });
}

const store = setupStore();

export default store;