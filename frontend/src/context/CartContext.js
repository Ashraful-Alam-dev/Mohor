'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '@/services/api'; 

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLiveCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchLiveCart = async () => {
    setCartLoading(true);
    try {
      const res = await api.get('/cart');
      
      if (res.data && res.data.success) {
        setCart(res.data.cart || []);
      }
    } catch (err) {
      console.error('Could not sync cart from database:', err.message);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    if (!user) throw new Error('Please login to add items to your cart.');
    
    try {
      const res = await api.post('/cart', { productId, quantity }); 
      if (res.data && res.data.success) {
        await fetchLiveCart();
        return true;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update database cart lines.');
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const res = await api.put(`/cart/${cartItemId}`, { quantity: newQuantity });
      if (res.data && res.data.success) {
        setCart(prev => prev.map(item => 
          item.cart_item_id === cartItemId 
            ? { ...item, selected_quantity: newQuantity } 
            : item
        ));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to adjust quantity.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/${cartItemId}`);
      if (res.data && res.data.success) {
        setCart(prev => prev.filter(item => item.cart_item_id !== cartItemId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item.');
    }
  };

  const clearCartState = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.selected_quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.selected_quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, cartLoading, cartTotal, cartCount, addToCart, updateQuantity, removeFromCart, clearCartState
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider wrapper');
  return context;
};