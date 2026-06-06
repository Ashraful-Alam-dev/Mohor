"use client";

import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* MAIN */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-black mb-6">Order Management</h1>

        {/* EMPTY STATE CARD */}
        <div className="bg-white border rounded-xl p-10 text-center">
          <div className="text-5xl mb-4">📦</div>

          <h2 className="text-xl font-bold mb-2">
            Order System Coming Soon
          </h2>

          <p className="text-neutral-500 text-sm">
            This module is under development. Orders, payments, and tracking
            will be available soon.
          </p>

          <button className="mt-5 px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold opacity-50 cursor-not-allowed">
            View Orders
          </button>
        </div>

        {/* PLACEHOLDER CARDS */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-2/3 mb-3"></div>
              <div className="h-3 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}