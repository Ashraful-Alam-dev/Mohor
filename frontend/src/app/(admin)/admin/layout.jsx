"use client";

import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      
      <div className="w-64 bg-white border-r p-5 hidden md:block">
        <h1 className="text-2xl font-black text-emerald-700 mb-8">
          Mohor Admin
        </h1>

        <nav className="space-y-3 text-sm font-medium">
          <Link href="/admin" className="block hover:text-emerald-700">
            Dashboard
          </Link>

          <Link href="/admin/inventory" className="block hover:text-emerald-700">
            Inventory
          </Link>

          <Link href="/admin/orders" className="block hover:text-emerald-700">
            Orders
          </Link>

          <Link href="/admin/analytics" className="block hover:text-emerald-700">
            Analytics
          </Link>

          <Link href="/admin/audit" className="block hover:text-emerald-700">
            Audit Logs
          </Link>
        </nav>
      </div>

      
      <div className="flex-1">{children}</div>
    </div>
  );
}