"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
} from "@/services/productService";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      if (!value) {
        const data = await getProducts();
        setProducts(data);
        return;
      }

      const data = await searchProducts(value);
      setProducts(data);
    } catch {
      setError("Search failed");
    }
  };

  const handleCategory = async (category) => {
    setSelectedCategory(category);

    try {
      setLoading(true);

      if (category === "all") {
        const data = await getProducts();
        setProducts(data);
        return;
      }

      const data = await getProductsByCategory(category);
      setProducts(data);
    } catch {
      setError("Category filter failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        {/* HERO */}
        <div className="bg-emerald-700 text-white py-16 px-6 text-center">
          <h1 className="text-4xl font-black mb-3">
            Mohor Store
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Discover premium products at unbeatable prices. Modern, fast, and reliable shopping experience.
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* CATEGORIES */}
        <div className="max-w-5xl mx-auto px-4 mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategory("all")}
            className={`px-4 py-2 rounded-full text-sm border ${
              selectedCategory === "all"
                ? "bg-emerald-700 text-white"
                : "bg-white"
            }`}
          >
            All
          </button>

          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border capitalize ${
                selectedCategory === cat
                  ? "bg-emerald-700 text-white"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-600 mt-4">
            {error}
          </div>
        )}

        {/* PRODUCTS */}
        <div className="max-w-6xl mx-auto px-4 mt-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-neutral-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-neutral-500 mt-10">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}