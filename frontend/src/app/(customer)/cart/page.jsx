"use client";

import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [blockedMsg, setBlockedMsg] = useState(false);
  const { cart, cartLoading, cartTotal, updateQuantity, removeFromCart } =
    useCart();
  const [toast, setToast] = useState(null);

  useEffect(() => {
  if (user && user.role === "admin") {
    setBlockedMsg(true);

    const timer = setTimeout(() => {
      router.replace("/");
    }, 1200); 

    return () => clearTimeout(timer);
  }
}, [user, router]);

  const showToast = (type, message, sub) => {
    setToast({ type, message, sub });
    setTimeout(() => setToast(null), 2000);
  };

  if (blockedMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            Access restricted
          </p>
          <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes btnGlow {
        0%   { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
        14%  { box-shadow: 0 0 16px 5px oklch(0.45 0.1 60 / 0.6); }
        28%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
        42%  { box-shadow: 0 0 12px 3px oklch(0.45 0.1 60 / 0.5); }
        70%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.25); }
        100% { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
      }
      @keyframes categoryGlow {
   0%   { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
  14%  { text-shadow: 0 0 12px oklch(0.45 0.12 60 / 0.9), 0 0 30px oklch(0.35 0.1 60 / 0.5); }
  28%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
  42%  { text-shadow: 0 0 10px oklch(0.45 0.12 60 / 0.7), 0 0 22px oklch(0.35 0.1 60 / 0.35); }
  70%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.3), 0 0 15px oklch(0.35 0.1 60 / 0.15); }
  100% { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
}
      .cart-btn {
        padding: 0.6rem 1.25rem;
        borderRadius: 0.75rem;
        font-weight: 700;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        border: none;
        cursor: pointer;
        background: oklch(0.35 0.08 60);
        color: var(--butter);
        transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        border-radius: 0.6rem;
      }
      .cart-btn:hover {
        background: oklch(0.28 0.08 60);
        animation: btnGlow 2.4s ease-in-out infinite;
        transform: translateY(-2px);
      }
      .cart-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        animation: none;
        transform: none;
      }
      .cart-card {
        transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s;
      }
      .cart-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px oklch(0.18 0.02 80 / 0.15) !important;
      }
    `}</style>

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 200,
            background: "var(--cream)",
            border: `1px solid ${toast.type === "remove" ? "oklch(0.55 0.2 27)" : "var(--mustard)"}`,
            borderRadius: "1rem",
            padding: "1rem 1.5rem",
            boxShadow: "0 8px 32px oklch(0.18 0.02 80 / 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--font-sans)",
            animation: "fadeInUp 0.3s ease-out",
            minWidth: "220px",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>
            {toast.type === "remove"
              ? "🗑️"
              : toast.type === "add"
                ? "➕"
                : "➖"}
          </span>
          <div>
            <p
              style={{
                fontWeight: 700,
                color: "var(--ink)",
                fontSize: "0.875rem",
              }}
            >
              {toast.message}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 80)",
                marginTop: "0.1rem",
              }}
            >
              {toast.sub}
            </p>
          </div>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-8">
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Your Cart
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              color: "oklch(0.5 0.04 80)",
              marginTop: "0.25rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            Review items currently staged for purchase.
          </p>
        </div>

        {cartLoading ? (
          <div
            style={{
              padding: "3rem 0",
              textAlign: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "oklch(0.6 0.04 80)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Loading cart...
          </div>
        ) : cart.length === 0 ? (
          <div
            style={{
              background: "var(--cream)",
              border: "1px dashed var(--border)",
              borderRadius: "1.5rem",
              padding: "4rem 2rem",
              textAlign: "center",
              boxShadow: "0 4px 20px oklch(0.18 0.02 80 / 0.08)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "oklch(0.5 0.04 80)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Your cart is empty.
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                color: "oklch(0.45 0.12 60)",
                fontSize: "0.875rem",
                fontWeight: 700,
                fontFamily: "var(--font-sans)",
                textDecoration: "none",
                animation: "categoryGlow 2.4s ease-in-out infinite",
                letterSpacing: "0.05em",
              }}
            >
              Browse Premium Collections
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cart.map((item) => {
                const structuredProduct = {
                  id: item.product_id,
                  name: item.name,
                  category: item.category,
                  price: item.price,
                  quantity: item.available_stock,
                  images: [{ url: item.thumbnail_url }],
                };

                return (
                  <div
                    key={item.cart_item_id}
                    className="cart-card flex flex-col rounded-2xl overflow-hidden p-3 relative"
                    style={{
                      background: "var(--cream)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 4px 20px oklch(0.18 0.02 80 / 0.08)",
                    }}
                  >
                    <div className="flex-1">
                      <ProductCard product={structuredProduct} />
                    </div>

                    {/* Cart controls */}
                    <div
                      style={{
                        marginTop: "1rem",
                        paddingTop: "0.75rem",
                        borderTop: "1px solid var(--border)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {/* Quantity label */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "oklch(0.55 0.04 80)",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          Quantity
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 900,
                            fontFamily: "monospace",
                            color: "var(--ink)",
                            background: "var(--butter)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "0.4rem",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {item.selected_quantity}{" "}
                          {item.selected_quantity === 1 ? "unit" : "units"}
                        </span>
                      </div>

                      {/* +/- and Remove */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                        }}
                      >
                        {/* Counter */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid var(--border)",
                            borderRadius: "0.6rem",
                            overflow: "hidden",
                            background: "var(--butter)",
                          }}
                        >
                          <button
                            disabled={item.selected_quantity <= 1}
                            onClick={() => {
                              updateQuantity(
                                item.cart_item_id,
                                item.selected_quantity - 1,
                              );
                              showToast(
                                "subtract",
                                `1 unit removed`,
                                item.name,
                              );
                            }}
                            style={{
                              width: "2.25rem",
                              height: "2.25rem",
                              fontWeight: 700,
                              fontSize: "1rem",
                              background: "transparent",
                              border: "none",
                              cursor:
                                item.selected_quantity <= 1
                                  ? "not-allowed"
                                  : "pointer",
                              color: "var(--ink)",
                              opacity: item.selected_quantity <= 1 ? 0.25 : 1,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              item.selected_quantity > 1 &&
                              (e.currentTarget.style.boxShadow =
                                "0 0 10px 3px oklch(0.45 0.1 60 / 0.4)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.boxShadow = "none")
                            }
                          >
                            −
                          </button>
                          <span
                            style={{
                              width: "2rem",
                              textAlign: "center",
                              fontSize: "0.85rem",
                              fontWeight: 900,
                              fontFamily: "monospace",
                              color: "var(--ink)",
                            }}
                          >
                            {item.selected_quantity}
                          </span>
                          <button
                            disabled={
                              item.selected_quantity >= item.available_stock
                            }
                            onClick={() => {
                              updateQuantity(
                                item.cart_item_id,
                                item.selected_quantity + 1,
                              );
                              showToast("add", `1 unit added`, item.name);
                            }}
                            style={{
                              width: "2.25rem",
                              height: "2.25rem",
                              fontWeight: 700,
                              fontSize: "1rem",
                              background: "transparent",
                              border: "none",
                              cursor:
                                item.selected_quantity >= item.available_stock
                                  ? "not-allowed"
                                  : "pointer",
                              color: "var(--ink)",
                              opacity:
                                item.selected_quantity >= item.available_stock
                                  ? 0.25
                                  : 1,
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                              item.selected_quantity < item.available_stock &&
                              (e.currentTarget.style.boxShadow =
                                "0 0 10px 3px oklch(0.45 0.1 60 / 0.4)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.boxShadow = "none")
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => {
                            removeFromCart(item.cart_item_id);
                            showToast(
                              "remove",
                              "Item removed from cart",
                              item.name,
                            );
                          }}
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "oklch(0.5 0.22 27)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "var(--font-sans)",
                            transition: "box-shadow 0.2s, color 0.2s",
                            padding: "0.35rem 0.6rem",
                            borderRadius: "0.4rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                              "0 0 12px 4px oklch(0.35 0.25 27 / 0.7)";
                            e.currentTarget.style.color = "oklch(0.4 0.25 27)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.color = "oklch(0.5 0.22 27)";
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout block */}
            <div
              style={{
                background: "var(--cream)",
                border: "1px solid var(--border)",
                borderRadius: "1.5rem",
                padding: "1.5rem",
                boxShadow: "0 4px 20px oklch(0.18 0.02 80 / 0.08)",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "oklch(0.55 0.04 80)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Total
                </p>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "var(--ink)",
                    fontFamily: "var(--font-sans)",
                    marginTop: "0.25rem",
                  }}
                >
                  ৳ {cartTotal.toLocaleString()}
                </h2>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="cart-btn"
                style={{ padding: "0.875rem 2.5rem", fontSize: "0.875rem" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "oklch(0.28 0.08 60)";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px 5px oklch(0.45 0.1 60 / 0.5)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "oklch(0.35 0.08 60)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
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
