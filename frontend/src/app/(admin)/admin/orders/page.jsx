'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllAdminOrders = async (productFilter = '') => {
    try {
      const res = await api.get(
  `/orders/admin/all?product=${encodeURIComponent(productFilter)}`
);
      if (res.data?.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not fetch admin manifest parameters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllAdminOrders(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleStatusTransition = async (orderId, targetStatus) => {
    const originalOrders = [...orders];
    setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: targetStatus } : o));

    try {
      const res = await api.patch(`/orders/admin/${orderId}/status`, { status: targetStatus });
      if (res.data?.success) {
        toast.success(`Fulfillment updated: ${targetStatus.toUpperCase()}`);
      }
    } catch (err) {
      setOrders(originalOrders);
      toast.error(err.response?.data?.message || 'Transaction state update rejected.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center font-medium text-stone-500">
        Parsing terminal master manifests...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
      
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-neutral-900 tracking-tight">Order Oversight Console</h1>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mt-1">System Administration Hub</p>
          </div>

          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-4 py-2 text-sm font-medium bg-white border border-stone-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-neutral-800"
            />
            <span className="bg-amber-100 text-amber-900 border border-amber-200 px-4 py-2 rounded-xl font-bold text-xs whitespace-nowrap">
              {orders.length} Records
            </span>
          </div>
        </div>

       
        <div className="bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100/80 border-b border-stone-200 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="py-4 px-6">Customer Information</th>
                  <th className="py-4 px-6">Product Manifest Summary</th>
                  <th className="py-4 px-6">Financial Ledger</th>
                  <th className="py-4 px-6 text-center">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-stone-50/60 transition-colors">
                    
                    <td className="py-5 px-6 max-w-[280px]">
                      <div className="font-bold text-neutral-800 text-base">{order.user_name}</div>
                      <div className="font-mono text-xs text-stone-500 mt-1 font-semibold">{order.user_number}</div>
                      <div className="text-xs text-stone-400 mt-2 line-clamp-2 bg-stone-100 p-2 rounded-lg border border-stone-200/40">
                        {order.address}
                      </div>
                    </td>

                    
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        {(() => {
                          let parsedItems = [];
                          try {
                            parsedItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                          } catch (e) {
                            console.error("Parsing breakdown error:", e);
                          }

                          if (!Array.isArray(parsedItems) || parsedItems.length === 0 || parsedItems[0]?.product_name === null) {
                            return <span className="text-stone-400 italic text-xs">No items linked</span>;
                          }

                          return parsedItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs bg-orange-50/40 border border-orange-100/50 p-2 rounded-lg">
                              <span className="font-bold text-neutral-700 line-clamp-1 pr-4">{item.product_name}</span>
                              <span className="text-stone-500 font-medium whitespace-nowrap">
                                {item.quantity} × <span className="font-bold text-neutral-800">৳{parseInt(item.price_at_purchase)}</span>
                              </span>
                            </div>
                          ));
                        })()}
                      </div>
                    </td>

                   
                    <td className="py-5 px-6 whitespace-nowrap">
                      <div className="text-lg font-black text-amber-700">৳ {parseFloat(order.total_price).toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-1">
                        Via: <span className="text-neutral-700">{order.payment_method}</span>
                      </div>
                    </td>

                    
                    <td className="py-5 px-6 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusTransition(order.order_id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                            order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <span className="text-[9px] text-stone-400 font-medium tracking-tight">
                          Logged: {new Date(order.ordertime).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-stone-400 italic">
                      No matching records found for that product search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}