"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the router for redirection
import { useAuth } from "@/context/AuthContext"; // Adjust this path to match your file structure
import api from "@/services/api";
import KpiCard from "@/components/KpiCard";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth(); // Extract auth states

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // 1. Guard the route using AuthContext state
  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.push("/login"); // or wherever your fallback / login page is
      } else {
        loadDashboard();
      }
    }
  }, [authLoading, user, isAdmin, router]);

  const loadDashboard = async () => {
    try {
      setDataLoading(true);
      const [productRes, categoryRes] = await Promise.all([
        api.get("/products"),
        api.get("/products/categories"),
      ]);

      setProducts(productRes.data.products);
      setCategories(categoryRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalCategories = categories.length;

  const inventoryValue = products.reduce((sum, p) => {
    return sum + (p.price || 0) * (p.quantity || 0);
  }, 0);

  const recentProducts = products.slice(0, 5);

  // 2. Show spinner if Auth is processing OR if product data is fetching
  if (authLoading || (!user || !isAdmin) || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 3. Render dashboard structure securely
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-black mb-6">
          Dashboard Overview
        </h2>

        {/* KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KpiCard title="Total Products" value={totalProducts} />
          <KpiCard title="Total Categories" value={totalCategories} />
          <KpiCard
            title="Inventory Value"
            value={`BDT ${inventoryValue.toFixed(2)}`}
          />
        </div>

        {/* RECENT PRODUCTS */}
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-bold mb-4">Recent Products</h3>

          {recentProducts.length === 0 ? (
            <p className="text-neutral-500">No products available</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.category}</p>
                  </div>

                  <p className="text-sm font-bold text-emerald-700">
                    BDT{p.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}