import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import './styles/index.css';
import './styles/global.css';
import store from './lib/store';
import { cartPersistenceMiddleware } from './lib/cartSlice';
import CartPersistenceService from './lib/cartPersistence';

// Initialize cart persistence
// Subscribe to store changes and persist cart state
cartPersistenceMiddleware.subscribeToStore(store);

// Load saved cart on app startup
cartPersistenceMiddleware.loadSavedCart(store);

// Listen for cross-tab cart sync (storage events)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'brim-cart' && event.newValue) {
      try {
        const savedCart = CartPersistenceService.loadCart();
        if (savedCart) {
          cartPersistenceMiddleware.loadSavedCart(store);
        }
      } catch (error) {
        console.warn('Failed to sync cart across tabs:', error);
      }
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);