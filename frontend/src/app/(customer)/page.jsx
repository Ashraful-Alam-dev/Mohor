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
      <div className="min-h-screen">
        {/* HERO */}
        <div className="bg-emerald-700 text-white py-16 px-6 text-center">
          <h1 className="text-4xl font-black mb-3">Mohor Store</h1>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Discover premium products at unbeatable prices. Modern, fast, and
            reliable shopping experience.
          </p>
        </div>

        {/* SEARCH */}
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: "100%",
              padding: "0.875rem 1.25rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
              background: "var(--cream)",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.925rem",
              outline: "none",
              boxShadow:
                "0 4px 20px oklch(0.18 0.02 80 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.6)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--mustard)";
              e.currentTarget.style.boxShadow =
                "0 6px 32px oklch(0.18 0.02 80 / 0.2), 0 0 0 4px oklch(0.78 0.15 80 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.6)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px oklch(0.18 0.02 80 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.6)";
            }}
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
        {error && <div className="text-center text-red-600 mt-4">{error}</div>}

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
                <div
                  key={product.id}
                  style={{
                    background: "var(--cream)",
                    borderRadius: "1rem",
                    border: "1px solid var(--border)",
                    boxShadow: "0 4px 20px oklch(0.18 0.02 80 / 0.08)",
                    transition:
                      "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px oklch(0.18 0.02 80 / 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px oklch(0.18 0.02 80 / 0.08)";
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
