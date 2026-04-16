import { combineReducers, configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';
import cartReducer from './cartSlice';

const rootReducer = combineReducers({
  filters: filtersReducer,
  cart: cartReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: rootReducer
});

export default store;