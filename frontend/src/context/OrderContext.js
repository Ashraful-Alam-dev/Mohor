'use client';

import { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';
import api from '@/services/api';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { clearCartState } = useCart();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const processCheckout = async (orderPayload) => {
    setOrderLoading(true);
    try {
      const res = await api.post('/orders', orderPayload);
      if (res.data && res.data.success) {
        if (orderPayload.clearCart) {
          clearCartState();
        }
        return res.data.data;
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed processing checkout transaction.');
    } finally {
      setOrderLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data && res.data.success) {
        setOrderHistory(res.data.orders);
      }
    } catch (err) {
      console.error('Could not load user order list profiles:', err.message);
    }
  };

  return (
    <OrderContext.Provider value={{ orderLoading, orderHistory, processCheckout, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider wrap context.');
  return context;
};