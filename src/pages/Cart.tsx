import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import {
  removeCartItem,
  updateCartItemQuantity,
  setCartItems,
} from '../lib/cartSlice';
import CartPersistenceService from '../lib/cartPersistence';
import QuantitySelector from '../components/ui/QuantitySelector';
import Price from '../components/ui/Price';
import Breadcrumb from '../components/ui/Breadcrumb';
import CartItem from '../components/ui/CartItem';
import CartSummary from '../components/ui/CartSummary';
import EmptyCart from '../components/ui/EmptyCart';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);

  // Load saved cart on mount (in case Redux store was empty)
  React.useEffect(() => {
    if (cart.items.length === 0) {
      const savedCart = CartPersistenceService.loadCart();
      if (savedCart && savedCart.items.length > 0) {
        dispatch(setCartItems(savedCart.items));
      }
    }
  }, [dispatch, cart.items.length]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
  };

  const removeItem = (id: string) => {
    dispatch(removeCartItem(id));
  };

   if (cart.items.length === 0) {
     return <EmptyCart onShopNow={() => navigate('/products')} />;
   }

   return (
     <>
       <Breadcrumb
         items={[
           { label: 'Home', to: '/' },
           { label: 'Shopping Cart', to: '/cart' }
         ]}
       />

       <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
           {cart.items.map((item) => (
             <CartItem
               key={item.id}
               item={item}
               onRemove={removeItem}
               onUpdateQuantity={updateQuantity}
             />
           ))}
         </div>

         <CartSummary cart={cart} />
      </div>
    </>
  );
};

export default Cart;
