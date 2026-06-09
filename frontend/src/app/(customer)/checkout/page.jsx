'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const { processCheckout, orderLoading } = useOrder();

  const directProductId = searchParams.get('product_id');
  const directQty = parseInt(searchParams.get('qty')) || 1;

  const [directProduct, setDirectProduct] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);

  // Delivery fields
  const [name, setName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

useEffect(() => {
  if (user?.role === 'admin') {
    router.replace('/');
  }
}, [user, router]);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setName(user.name || ''); // ✅ FIXED: default receiver name
      setShippingAddress(user.address || user.shipping_address || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Direct product load
  useEffect(() => {
    if (directProductId) {
      setDirectLoading(true);
      api.get(`/products/${directProductId}`)
        .then(res => {
          if (res.data?.success) setDirectProduct(res.data.product);
        })
        .catch(() => toast.error('Failed to parse direct purchase product lines.'))
        .finally(() => setDirectLoading(false));
    }
  }, [directProductId]);

  const isDirect = !!directProductId;

  const activeItems = isDirect
    ? (directProduct ? [{ ...directProduct, selected_quantity: directQty }] : [])
    : cart;

  const activeTotal = isDirect
    ? (directProduct ? parseFloat(directProduct.price) * directQty : 0)
    : cartTotal;

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();

    if (!activeItems.length)
      return toast.error('No items mapped inside order workflow parameters.');

    if (!shippingAddress.trim() || !phone.trim())
      return toast.error('Please input a valid phone and shipping delivery point.');

    try {
      const payload = {
        items: activeItems.map(item => ({
          product_id: item.id || item.product_id,
          selected_quantity: item.selected_quantity
        })),
        shippingAddress,
        phone,
        paymentMethod,
        clearCart: !isDirect
      };

      await processCheckout(payload);
      toast.success('🎉 Order successfully generated!');
      router.push('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (directLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        Loading context details...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 bg-[var(--cream)] flex items-center justify-center">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-orange-200/60 shadow-xl shadow-orange-900/5 animate-fade-in">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-2xl font-display font-black text-neutral-900 mb-6 tracking-tight">
            Delivery Manifest
          </h2>

          <form onSubmit={handlePlaceOrderSubmit} className="space-y-4">

            {/* Receiver Name (AUTO-FILLED BUT EDITABLE) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Receiver Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Receiver Name"
                className="w-full bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 px-4 py-2.5 rounded-xl font-medium text-neutral-800 text-sm transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 px-4 py-2.5 rounded-xl font-medium text-neutral-800 text-sm transition-all"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Destination Address
              </label>
              <textarea
                rows="3"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white border border-orange-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 px-4 py-2.5 rounded-xl font-medium text-neutral-800 text-sm transition-all resize-none"
                required
              />
            </div>

            {/* Payment Reference */}
            <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Payment Reference ()
            </label>

            <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Bkash-4801"
                className="w-full bg-white border border-orange-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 px-4 py-2.5 rounded-xl font-bold text-neutral-800 text-sm transition-all"
                required
            />

            <p className="text-[10px] text-neutral-400 mt-1">
                Enter: “COD” for cash on delivery, transaction ID or Account Number for mobile banking
            </p>
            </div>

            <button
              type="submit"
              disabled={orderLoading || !activeItems.length}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-700/20 tracking-wide uppercase text-xs mt-6"
            >
              {orderLoading
                ? 'Processing Verification...'
                : `Authorize Order • ৳ ${activeTotal}`}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800/80 mb-4">
              Summary Validation
            </h3>

            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
              {activeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm border-b border-orange-200/40 pb-3"
                >
                  <div>
                    <h4 className="font-bold text-neutral-800 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Qty: {item.selected_quantity} × ৳{item.price}
                    </p>
                  </div>

                  <span className="font-bold text-neutral-900">
                    ৳{parseFloat(item.price) * item.selected_quantity}
                  </span>
                </div>
              ))}

              {!activeItems.length && (
                <p className="text-sm text-neutral-400 italic text-center py-8">
                  Your checkout basket is empty.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-orange-200/60 pt-4 mt-6">
            <div className="flex justify-between items-baseline text-neutral-900">
              <span className="font-display font-extrabold text-base">
                Grand Total Allocation:
              </span>
              <span className="font-sans font-black text-2xl text-amber-700">
                ৳ {activeTotal}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}