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
        
        <div
          style={{
            background: "oklch(0.35 0.08 60)",
            padding: "4rem 1.5rem 3.5rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "radial-gradient(oklch(1 0 0 / 0.04) 1px, transparent 1px)",
            backgroundSize: "8px 4px",
          }}
        >
      
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "oklch(0.78 0.15 80 / 0.7)",
              fontFamily: "var(--font-sans)",
              marginBottom: "1.25rem",
            }}
          >
            VOL. 01 · SPRING EDIT 2026
          </p>

          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1.05,
              color: "var(--butter)",
              letterSpacing: "-0.02em",
              marginBottom: "0",
            }}
          >
            MOHOR
          </h1>

          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.15,
              color: "var(--butter)",
              marginTop: "0.5rem",
            }}
          >
            Soft <em style={{ color: "var(--mustard)" }}>like</em> sunlight,
          </p>
          <p
            className="font-display"
            style={{
              fontSize: "clamp(1.6rem, 5vw, 3.2rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              color: "var(--mustard)",
            }}
          >
            worn loud.
          </p>

          <p
            style={{
              fontSize: "0.9rem",
              color: "oklch(0.89 0.06 98 / 0.75)",
              maxWidth: "36rem",
              margin: "1.5rem auto 0",
              lineHeight: 1.75,
              fontFamily: "var(--font-sans)",
            }}
          >
            Born from the ancient, quiet hum of the loom, we catch the golden
            warmth of the midday sun only to drape it over our shoulders, and
            shake the world.
          </p>
        </div>

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
        <div className="max-w-5xl mx-auto px-4 mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleCategory("all")}
            style={{
              padding: "0.5rem 1.1rem",
              borderRadius: "99px",
              fontSize: "0.8rem",
              fontWeight: 700,
              fontFamily: "var(--font-sans)",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition:
                "background 0.2s, box-shadow 0.2s, transform 0.15s, color 0.2s",
              background:
                selectedCategory === "all"
                  ? "oklch(0.35 0.08 60)"
                  : "var(--cream)",
              color:
                selectedCategory === "all" ? "var(--butter)" : "var(--ink)",
              boxShadow:
                selectedCategory === "all"
                  ? "0 4px 14px oklch(0.35 0.08 60 / 0.35)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== "all") {
                e.currentTarget.style.background = "oklch(0.35 0.08 60)";
                e.currentTarget.style.color = "var(--butter)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px oklch(0.35 0.08 60 / 0.35)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== "all") {
                e.currentTarget.style.background = "var(--cream)";
                e.currentTarget.style.color = "var(--ink)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            All
          </button>

          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleCategory(cat)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                textTransform: "capitalize",
                transition:
                  "background 0.2s, box-shadow 0.2s, transform 0.15s, color 0.2s",
                background:
                  selectedCategory === cat
                    ? "oklch(0.35 0.08 60)"
                    : "var(--cream)",
                color:
                  selectedCategory === cat ? "var(--butter)" : "var(--ink)",
                boxShadow:
                  selectedCategory === cat
                    ? "0 4px 14px oklch(0.35 0.08 60 / 0.35)"
                    : "none",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.background = "oklch(0.35 0.08 60)";
                  e.currentTarget.style.color = "var(--butter)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px oklch(0.35 0.08 60 / 0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.background = "var(--cream)";
                  e.currentTarget.style.color = "var(--ink)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <div className="text-center text-red-600 mt-4">{error}</div>}

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
