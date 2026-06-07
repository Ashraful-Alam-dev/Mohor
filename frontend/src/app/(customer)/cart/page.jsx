"use client";

import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, cartLoading, cartTotal, updateQuantity, removeFromCart } =
    useCart();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundImage:
          "radial-gradient(oklch(0.18 0.02 80 / 0.08) 1px, transparent 1px)",
        backgroundSize: "8px 4px",
      }}
    >
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-neutral-950 dark:text-white">
            Your Cart Bags
          </h1>
          <p className="text-xs font-medium text-neutral-400 mt-0.5">
            Review items currently staged for purchase reservations.
          </p>
        </div>

        {cartLoading ? (
          <div className="py-12 text-center text-xs font-bold text-neutral-400 animate-pulse">
            Loading cloud cart parameters...
          </div>
        ) : cart.length === 0 ? (
          <div
            className="border border-dashed rounded-3xl p-16 text-center space-y-4"
            style={{ background: "var(--cream)", borderColor: "var(--border)" }}
          >
            <p className="text-sm font-bold text-neutral-400">
              Your collection layout queue is completely empty.
            </p>
            <Link
              href="/"
              className="inline-block bg-brand-500 text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider"
            >
              Browse Premium Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* PRODUCT CARD PRESENTATION GRID WITH ROW LAYOUT CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.map((item) => {
                // Reconstruct the payload to match what your ProductCard expects
                const structuredProduct = {
                  id: item.product_id,
                  name: item.name,
                  category: item.category,
                  price: item.price,
                  quantity: item.available_stock, // Pass stock info to ProductCard
                  images: [{ url: item.thumbnail_url }],
                };

                return (
                  <div
                    key={item.cart_item_id}
                    className="flex flex-col rounded-2xl overflow-hidden shadow-sm p-3 relative group"
                    style={{
                      background: "var(--cream)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* Render your exact ProductCard structural file */}
                    <div className="flex-1">
                      <ProductCard product={structuredProduct} />
                    </div>

                    {/* DYNAMIC CART CONTROLS DRAWER BAR */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
                      {/* Meta Context Information displaying individual choice depth */}
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-neutral-400 uppercase tracking-wide">
                          Selected Bag Depth
                        </span>
                        <span className="font-mono text-neutral-950 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          {item.selected_quantity}{" "}
                          {item.selected_quantity === 1 ? "unit" : "units"}
                        </span>
                      </div>

                      {/* Interactive Adjustment Blocks */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
                          <button
                            disabled={item.selected_quantity <= 1}
                            onClick={() =>
                              updateQuantity(
                                item.cart_item_id,
                                item.selected_quantity - 1,
                              )
                            }
                            className="w-9 h-9 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition text-sm text-neutral-600 dark:text-neutral-400 disabled:opacity-20 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-black text-neutral-950 dark:text-white">
                            {item.selected_quantity}
                          </span>
                          <button
                            disabled={
                              item.selected_quantity >= item.available_stock
                            }
                            onClick={() =>
                              updateQuantity(
                                item.cart_item_id,
                                item.selected_quantity + 1,
                              )
                            }
                            className="w-9 h-9 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition text-sm text-neutral-600 dark:text-neutral-400 disabled:opacity-20 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cart_item_id)}
                          className="text-xs font-black uppercase text-red-500 hover:text-red-600 tracking-wider transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHECKOUT VALUATION AGGREGATION BLOCK */}
            <div
              className="rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{
                background: "var(--cream)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Total Purchase Weight
                </p>
                <h2 className="text-3xl font-black text-neutral-950 dark:text-white mt-1">
                  ৳ {cartTotal.toLocaleString()}
                </h2>
              </div>

              <button
                onClick={() =>
                  alert("Proceeding to checkout management system...")
                }
                className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 text-white text-xs font-black uppercase tracking-wider px-10 py-4 rounded-xl transition shadow-lg shadow-brand-500/10 cursor-pointer"
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
