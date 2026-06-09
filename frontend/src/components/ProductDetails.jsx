"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || product.images?.[0] || null,
  );


  const [successToast, setSuccessToast] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("cart"); 
  const [chosenQuantity, setChosenQuantity] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);

  
  const getImageUrl = (image) => {
    if (typeof image === "string") return image;
    return image?.url || null;
  };

 
  const imageUrls = product.images?.map((img) => getImageUrl(img)) || [];

  
  const handleAddToCartClick = () => {
    if (!isAuthenticated) {
      alert("Please log in to start saving premium catalog lines.");
      router.push("/login");
      return;
    }
    setChosenQuantity(1);
    setModalMode("cart");
    setShowModal(true);
  };

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      alert("Please log in to initiate order creation pipelines.");
      router.push("/login");
      return;
    }
    setChosenQuantity(1);
    setModalMode("direct_order");
    setShowModal(true);
  };

  const handleConfirmDone = async () => {
    if (modalMode === "cart") {
      setIsSyncing(true);
      try {
        await addToCart(product.id, chosenQuantity);
        setShowModal(false);
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 2000);
      } catch (err) {
        alert(err.message || "Failed to sync cart item selection.");
      } finally {
        setIsSyncing(false);
      }
    } else {
      
      setShowModal(false);
      router.push(`/checkout?product_id=${product.id}&qty=${chosenQuantity}`);
    }
  };

  return (
    <section
      style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "2.5rem 1.25rem",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes categoryGlow {
          0%   { text-shadow: 0 0 6px oklch(0.55 0.2 300 / 0.4), 0 0 15px oklch(0.45 0.2 300 / 0.2); }
          14%  { text-shadow: 0 0 12px oklch(0.55 0.2 300 / 0.9), 0 0 30px oklch(0.45 0.2 300 / 0.5); }
          28%  { text-shadow: 0 0 6px oklch(0.55 0.2 300 / 0.4), 0 0 15px oklch(0.45 0.2 300 / 0.2); }
          42%  { text-shadow: 0 0 10px oklch(0.55 0.2 300 / 0.7), 0 0 22px oklch(0.45 0.2 300 / 0.35); }
          70%  { text-shadow: 0 0 6px oklch(0.55 0.2 300 / 0.3), 0 0 15px oklch(0.45 0.2 300 / 0.15); }
          100% { text-shadow: 0 0 6px oklch(0.55 0.2 300 / 0.4), 0 0 15px oklch(0.45 0.2 300 / 0.2); }
        }
        @keyframes quantityGlow {
          0%   { text-shadow: 0 0 5px oklch(0.55 0.2 27 / 0.4); }
          14%  { text-shadow: 0 0 12px oklch(0.55 0.2 27 / 0.8), 0 0 25px oklch(0.55 0.2 27 / 0.4); }
          28%  { text-shadow: 0 0 5px oklch(0.55 0.2 27 / 0.4); }
          42%  { text-shadow: 0 0 9px oklch(0.55 0.2 27 / 0.6), 0 0 20px oklch(0.55 0.2 27 / 0.3); }
          70%  { text-shadow: 0 0 5px oklch(0.55 0.2 27 / 0.3); }
          100% { text-shadow: 0 0 5px oklch(0.55 0.2 27 / 0.4); }
        }
        @keyframes btnGlow {
          0%   { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
          14%  { box-shadow: 0 0 16px 5px oklch(0.45 0.1 60 / 0.6); }
          28%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
          42%  { box-shadow: 0 0 12px 3px oklch(0.45 0.1 60 / 0.5); }
          70%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.25); }
          100% { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
        }
        .product-btn {
          padding: 0.75rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          background: oklch(0.35 0.08 60);
          color: var(--butter);
        }
        .product-btn:hover {
          background: oklch(0.28 0.08 60);
          animation: btnGlow 2.4s ease-in-out infinite;
          transform: translateY(-2px);
        }
        .product-btn:disabled {
          background: oklch(0.75 0.02 80);
          color: oklch(0.55 0.02 80);
          cursor: not-allowed;
          animation: none;
          transform: none;
        }
        .thumb-btn {
          border-radius: 0.5rem;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid oklch(0.3 0.02 80);
          transition: border-color 0.2s, box-shadow 0.2s;
          background: oklch(0.97 0.03 95);
        }
        .thumb-btn.active {
          border-color: var(--mustard);
          box-shadow: 0 0 0 2px var(--mustard);
        }
        .thumb-btn:hover {
          border-color: oklch(0.65 0.12 80);
        }
      `}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {/* Gallery */}
        <div>
          {/* Main image */}
          <div
            style={{
              borderRadius: "1rem",
              overflow: "hidden",
              background: "oklch(0.97 0.03 95)",
              border: "1.5px solid oklch(0.3 0.02 80)",
              boxShadow: "0 8px 32px oklch(0.18 0.02 80 / 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "500px",
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{ color: "oklch(0.6 0.03 80)", fontSize: "0.875rem" }}
              >
                No image available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1rem",
                overflowX: "auto",
                paddingBottom: "4px",
              }}
            >
              {imageUrls.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`thumb-btn ${selectedImage === image ? "active" : ""}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "oklch(0.97 0.03 95)",
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Category */}
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "oklch(0.55 0.2 300)",
              animation: "categoryGlow 2.4s ease-in-out infinite",
            }}
          >
            {product.category}
          </p>

          {/* Name */}
          <h1
            className="font-display"
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              color: "var(--ink)",
              marginTop: "0.5rem",
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <p
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--ink)",
              marginTop: "1.25rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            ৳ {parseFloat(product.price).toLocaleString()}
          </p>

          {/* Quantity */}
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.9rem",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Available:{" "}
            <span
              style={{
                color: "oklch(0.5 0.22 27)",
                fontWeight: 700,
                animation: "quantityGlow 2.4s ease-in-out infinite",
              }}
            >
              {product.quantity} {product.quantity === 1 ? "piece" : "pieces"}
            </span>
          </p>

          {/* Description box */}
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "oklch(0.5 0.04 80)",
              marginTop: "1.5rem",
              marginBottom: "0.4rem",
              marginLeft: "0.5rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            Description
          </p>
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderRadius: "1rem",
              background: "var(--cream)",
              border: "1px solid var(--border)",
              boxShadow:
                "0 4px 20px oklch(0.18 0.02 80 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.6)",
              lineHeight: 1.75,
              fontSize: "0.925rem",
              color: "oklch(0.35 0.03 80)",
              fontFamily: "var(--font-sans)",
              minHeight: "80px",
              width: "70%",
            }}
          >
            {product.description || "No description available."}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2.5rem",
              paddingTop: "0",
              justifyContent: "flex-start",
            }}
          >
            <button
              onClick={handleAddToCartClick}
              className="product-btn"
              disabled={product.quantity === 0}
              style={{ flex: 1, maxWidth: "180px" }}
            >
              {product.quantity > 0 ? "Add To Cart" : "Out of Stock"}
            </button>

            <button
              onClick={handleOrderClick}
              className="product-btn"
              disabled={product.quantity === 0}
              style={{ flex: 1, maxWidth: "180px" }}
            >
              Order
            </button>
          </div>
        </div>
      </div>

      {/* 📊 INTERACTIVE QUANTITY POPUP ELEMENT */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "oklch(0.18 0.02 80 / 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--cream)",
              border: "1px solid var(--border)",
              borderRadius: "1.5rem",
              width: "100%",
              maxWidth: "360px",
              padding: "1.75rem",
              boxShadow: "0 8px 40px oklch(0.18 0.02 80 / 0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                {modalMode === "cart" 
                  ? "How many would you like?" 
                  : "Review Direct Order Quantity"}
              </h3>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "oklch(0.5 0.04 80)",
                  marginTop: "0.35rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {product.name}
              </p>
            </div>

            {/* Counter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.5rem",
              }}
            >
              <button
                type="button"
                disabled={chosenQuantity <= 1}
                onClick={() => setChosenQuantity((prev) => prev - 1)}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                  background: "var(--butter)",
                  color: "var(--ink)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: chosenQuantity <= 1 ? "not-allowed" : "pointer",
                  opacity: chosenQuantity <= 1 ? 0.3 : 1,
                  fontFamily: "var(--font-sans)",
                }}
              >
                −
              </button>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                  minWidth: "2rem",
                  textAlign: "center",
                }}
              >
                {chosenQuantity}
              </span>
              <button
                type="button"
                disabled={chosenQuantity >= product.quantity}
                onClick={() => setChosenQuantity((prev) => prev + 1)}
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                  background: "var(--butter)",
                  color: "var(--ink)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor:
                    chosenQuantity >= product.quantity
                      ? "not-allowed"
                      : "pointer",
                  opacity: chosenQuantity >= product.quantity ? 0.3 : 1,
                  fontFamily: "var(--font-sans)",
                }}
              >
                +
              </button>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--border)",
                  background: "var(--butter)",
                  color: "oklch(0.5 0.04 80)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "box-shadow 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 18px 6px oklch(0.25 0.25 27 / 0.5 )")
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDone}
                disabled={isSyncing}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: isSyncing
                    ? "oklch(0.72 0.12 80)"
                    : "oklch(0.35 0.08 60)",
                  color: "var(--butter)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: isSyncing ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "box-shadow 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSyncing) {
                    e.currentTarget.style.background = "oklch(0.28 0.08 60)";
                    e.currentTarget.style.boxShadow =
                      "0 0 14px 4px oklch(0.45 0.1 60 / 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSyncing) {
                    e.currentTarget.style.background = "oklch(0.35 0.08 60)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {isSyncing 
                  ? "Adding..." 
                  : modalMode === "cart" 
                    ? "Confirm" 
                    : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification block */}
      {successToast && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 200,
            background: "var(--cream)",
            border: "1px solid var(--mustard)",
            borderRadius: "1rem",
            padding: "1rem 1.5rem",
            boxShadow: "0 8px 32px oklch(0.18 0.02 80 / 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--font-sans)",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <span style={{ fontSize: "1.25rem" }}>🛒</span>
          <div>
            <p style={{ fontWeight: 700, color: "var(--ink)", fontSize: "0.875rem" }}>
              Added to cart!
            </p>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.5 0.04 80)", marginTop: "0.1rem" }}>
              {chosenQuantity} × {product.name}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}