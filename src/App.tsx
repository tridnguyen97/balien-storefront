import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { initialState } from './lib/store';
import { App as AppContent } from './app/App';

const App: React.FC = () => {
  const [cart, setCart] = useState(initialState.cart);

  return (
    <BrowserRouter>
      <AppContent cart={cart} setCart={setCart} />
    </BrowserRouter>
  );
};

export default App;