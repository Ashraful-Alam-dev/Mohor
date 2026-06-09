"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "@/services/api";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { cart, cartTotal } = useCart();
  const { processCheckout, orderLoading } = useOrder();

  const directProductId = searchParams.get("product_id");
  const directQty = parseInt(searchParams.get("qty")) || 1;

  const [directProduct, setDirectProduct] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);

  const [name, setName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || ""); 
      setShippingAddress(user.address || user.shipping_address || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (directProductId) {
      setDirectLoading(true);
      api
        .get(`/products/${directProductId}`)
        .then((res) => {
          if (res.data?.success) setDirectProduct(res.data.product);
        })
        .catch(() =>
          toast.error("Failed to parse direct purchase product lines."),
        )
        .finally(() => setDirectLoading(false));
    }
  }, [directProductId]);

  const isDirect = !!directProductId;

  const activeItems = isDirect
    ? directProduct
      ? [{ ...directProduct, selected_quantity: directQty }]
      : []
    : cart;

  const activeTotal = isDirect
    ? directProduct
      ? parseFloat(directProduct.price) * directQty
      : 0
    : cartTotal;

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();

    if (!activeItems.length)
      return toast.error("No items mapped inside order workflow parameters.");

    if (!shippingAddress.trim() || !phone.trim())
      return toast.error(
        "Please input a valid phone and shipping delivery point.",
      );

    try {
      const payload = {
        items: activeItems.map((item) => ({
          product_id: item.id || item.product_id,
          selected_quantity: item.selected_quantity,
        })),
        shippingAddress,
        phone,
        paymentMethod,
        clearCart: !isDirect,
      };

      await processCheckout(payload);
      toast.success("🎉 Order successfully generated!");
      router.push("/");
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
    <div className="min-h-screen py-10 px-4 flex items-center justify-center">
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
      .checkout-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        background: oklch(0.96 0.03 85);
        color: var(--ink);
        outline: none;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
      }
      .checkout-input:focus {
        border-color: var(--mustard);
        box-shadow: 0 0 0 3px oklch(0.78 0.15 80 / 0.15), 0 6px 20px oklch(0.18 0.02 80 / 0.1);
        transform: translateY(-2px);
      }
      .checkout-input:-webkit-autofill,
      .checkout-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px oklch(0.96 0.03 85) inset !important;
        -webkit-text-fill-color: var(--ink) !important;
      }
      .field-label {
        display: block;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: oklch(0.5 0.04 80);
        margin-bottom: 0.4rem;
        font-family: var(--font-sans);
        text-transform: uppercase;
      }
      .brown-btn {
        background: oklch(0.35 0.08 60);
        color: var(--butter);
        border: none;
        border-radius: 0.75rem;
        font-weight: 700;
        font-family: var(--font-sans);
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
      }
      .brown-btn:hover {
        background: oklch(0.28 0.08 60);
        animation: btnGlow 2.4s ease-in-out infinite;
        transform: translateY(-2px);
      }
      .brown-btn:disabled {
        background: oklch(0.75 0.02 80);
        color: oklch(0.55 0.02 80);
        cursor: not-allowed;
        animation: none;
        transform: none;
      }
       .summary-item {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 0.75rem 0.5rem;
        border-bottom: 1px solid var(--border);
        transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        border-radius: 0.75rem;
        background: var(--cream);
        margin-bottom: 0.4rem;
        box-shadow: 0 2px 8px oklch(0.18 0.02 80 / 0.06);
        }
       .summary-item:hover {
        background: oklch(0.985 0.03 95);
         transform: translateX(4px);
         box-shadow: 0 4px 16px oklch(0.18 0.02 80 / 0.12);
       }
    `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "56rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          background: "var(--cream)",
          backdropFilter: "blur(12px)",
          padding: "2.5rem",
          borderRadius: "1.5rem",
          border: "1px solid var(--border)",
          boxShadow:
            "0 8px 40px oklch(0.18 0.02 80 / 0.12), 0 0 35px 8px oklch(0.78 0.15 80 / 0.25)",
          animation: "fadeInUp 0.4s ease-out",
        }}
      >
        {/* LEFT — Delivery Form */}
        <div>
          <h2
            className="font-display"
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              color: "var(--ink)",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Delivery Details
          </h2>

          <form
            onSubmit={handlePlaceOrderSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label className="field-label">Receiver Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Receiver name"
                className="checkout-input"
                required
              />
            </div>

            <div>
              <label className="field-label">Contact Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801XXXXXXXXX"
                className="checkout-input"
                required
              />
            </div>

            <div>
              <label className="field-label">Destination Address</label>
              <textarea
                rows="3"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="checkout-input"
                style={{ resize: "none" }}
                required
              />
            </div>

            <div>
              <label className="field-label">Payment Reference</label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="COD or transaction ID"
                className="checkout-input"
                required
              />
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "oklch(0.6 0.03 80)",
                  marginTop: "0.4rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Enter "COD" for cash on delivery, or transaction ID for mobile
                banking
              </p>
            </div>

            <button
              type="submit"
              className="brown-btn"
              disabled={orderLoading || !activeItems.length}
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
              }}
            >
              {orderLoading
                ? "Processing..."
                : `Place Order • ৳ ${activeTotal}`}
            </button>
          </form>
        </div>

        {/* RIGHT — Summary */}
        <div
          style={{
            background: "var(--butter)",
            border: "1px solid var(--border)",
            borderRadius: "1.25rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 4px 20px oklch(0.18 0.02 80 / 0.08)",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "oklch(0.45 0.12 60)",
                fontFamily: "var(--font-sans)",
                marginBottom: "1rem",
                animation: "categoryGlow 2.4s ease-in-out infinite",
              }}
            >
              Order Summary
            </p>

            <div
              style={{
                maxHeight: "280px",
                overflowY: "auto",
                paddingRight: "0.25rem",
              }}
            >
              {activeItems.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <div>
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "oklch(0.5 0.04 80)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {item.selected_quantity} × ৳{item.price}
                    </p>
                  </div>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    ৳{parseFloat(item.price) * item.selected_quantity}
                  </span>
                </div>
              ))}

              {!activeItems.length && (
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "oklch(0.6 0.03 80)",
                    textAlign: "center",
                    padding: "2rem 0",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  No items in cart.
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: "1rem",
                color: "var(--ink)",
              }}
            >
              Grand Total
            </span>
            <span
              style={{
                fontWeight: 900,
                fontSize: "1.75rem",
                color: "oklch(0.55 0.15 80)",
                fontFamily: "var(--font-sans)",
              }}
            >
              ৳ {activeTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
