"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [blockedMsg, setBlockedMsg] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orders, setOrders] = useState([]);
  const [logoutToast, setLogoutToast] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
  if (user && user.role === "admin") {
    setBlockedMsg(true);

    const timer = setTimeout(() => {
      router.replace("/");
    }, 1200); 

    return () => clearTimeout(timer);
  }
}, [user, router]);

 useEffect(() => {
  if (!user) return;
  
  if (user.role === "admin") {
    setLoading(false);
    return;
  }

  const load = async () => {
    try {
      const [meRes, orderRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/orders/my-orders"),
      ]);

      if (meRes.data?.success) {
        setProfile(meRes.data.user);
      }

      if (orderRes.data?.success) {
        setOrders(orderRes.data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  load();
}, [user]);

  const updateProfile = async () => {
    setSaving(true);
    try {
      await api.put("/auth/profile/update", profile);
      toast.success("Profile updated");
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      return toast.error("Fill all password fields");
    }

    setChangingPassword(true);
    try {
      await api.patch("/auth/profile/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading profile...
      </div>
    );
  }

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
    <div className="min-h-screen p-6">
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
      .profile-card {
        background: var(--cream);
        border: 1px solid var(--border);
        border-radius: 1.25rem;
        padding: 1.5rem;
        box-shadow: 0 4px 20px oklch(0.18 0.02 80 / 0.15);
        transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s;
      }
      .profile-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px oklch(0.18 0.02 80 / 0.7);
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
        box-shadow: 0 0 16px 5px oklch(0.45 0.1 60 / 0.5);
        transform: translateY(-2px);
      }
      .brown-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .mohor-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        background: oklch(0.96 0.03 85);
        color: var(--ink);
        outline: none;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .mohor-input:focus {
        border-color: var(--mustard);
        box-shadow: 0 0 0 3px oklch(0.78 0.15 80 / 0.15);
      }
      .mohor-input:-webkit-autofill,
      .mohor-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px oklch(0.96 0.03 85) inset !important;
        -webkit-text-fill-color: var(--ink) !important;
      }
      .security-zone {
        background: var(--cream);
        border: 1px solid var(--border);
        border-radius: 1.25rem;
        padding: 1.5rem;
        box-shadow: 0 4px 20px oklch(0.18 0.02 80 / 0.08);
        transition: box-shadow 0.3s, transform 0.3s cubic-bezier(0.2,0.8,0.2,1);
      }
      .security-zone:hover {
        box-shadow: 0 0 24px 6px oklch(0.45 0.2 27 / 0.2);
        transform: translateY(-4px);
      }
    `}</style>

      {/* Toast */}
      {logoutToast && (
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
            minWidth: "220px",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>👋</span>
          <div>
            <p
              style={{
                fontWeight: 700,
                color: "var(--ink)",
                fontSize: "0.875rem",
              }}
            >
              Logged out successfully
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 80)",
                marginTop: "0.1rem",
              }}
            >
              See you again soon!
            </p>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
       
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{ fontSize: "2rem", fontWeight: 900, color: "var(--ink)" }}
            >
              My Profile
            </h1>
            <p
              style={{
                fontSize: "0.8rem",
                color: "oklch(0.5 0.04 80)",
                marginTop: "0.25rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              Manage account, orders & security
            </p>
          </div>
          <button
            className="brown-btn"
            onClick={() => router.push("/")}
            style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem" }}
          >
            Back to Shop
          </button>
        </div>
        
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40% 1fr",
            gap: "1.5rem",
          }}
        >
          
          <div
            className="profile-card"
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Profile Info
              </h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="brown-btn"
                  style={{ padding: "0.35rem 0.9rem", fontSize: "0.8rem" }}
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(false)}
                  style={{
                    padding: "0.35rem 0.9rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    borderRadius: "0.75rem",
                    border: "none",
                    background: "oklch(0.95 0.04 27)",
                    color: "oklch(0.4 0.2 27)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 12px 4px oklch(0.35 0.25 27 / 0.5)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  Cancel
                </button>
              )}
            </div>

            {!editMode ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  fontSize: "1rem",
                  color: "var(--ink)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.7,
                }}
              >
                <p>
                  <span style={{ fontWeight: 700 }}>Name:</span> {profile.name}
                </p>
                <p>
                  <span style={{ fontWeight: 700 }}>Phone:</span>{" "}
                  {profile.phone}
                </p>
                <p>
                  <span style={{ fontWeight: 700 }}>Address:</span>{" "}
                  {profile.address}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <input
                  className="mohor-input"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Name"
                />
                <input
                  className="mohor-input"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="Phone"
                />
                <textarea
                  className="mohor-input"
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  placeholder="Address"
                  rows={3}
                  style={{ resize: "none" }}
                />
                <button
                  className="brown-btn"
                  onClick={updateProfile}
                  disabled={saving}
                  style={{
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                    width: "100%",
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="security-zone">
            <h2
              style={{
                fontWeight: 900,
                fontSize: "1.1rem",
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                marginBottom: "1.25rem",
              }}
            >
              Security Zone
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="password"
                className="mohor-input"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="mohor-input"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={changePassword}
                disabled={changingPassword}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "oklch(0.45 0.2 27)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: changingPassword ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-sans)",
                  opacity: changingPassword ? 0.6 : 1,
                  transition:
                    "background 0.2s, box-shadow 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!changingPassword) {
                    e.currentTarget.style.background = "oklch(0.38 0.22 27)";
                    e.currentTarget.style.boxShadow =
                      "0 0 16px 5px oklch(0.35 0.25 27 / 0.5)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "oklch(0.45 0.2 27)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {changingPassword ? "Updating..." : "Change Password"}
              </button>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  className="brown-btn"
                  onClick={() => {
                    setLogoutToast(true);
                    setTimeout(() => {
                      setLogoutToast(false);
                      logout();
                    }, 1500);
                  }}
                  style={{ padding: "0.875rem 2.5rem", fontSize: "0.95rem" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER HISTORY — now full width below */}
        <div className="profile-card" style={{ width: "100%" }}>
          <h2
            style={{
              fontWeight: 900,
              fontSize: "1.1rem",
              color: "var(--ink)",
              fontFamily: "var(--font-sans)",
              marginBottom: "1rem",
            }}
          >
            Order History
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              maxHeight: "420px",
              overflowY: "auto",
            }}
          >
            {orders.map((order) => (
              <div
                key={order.order_id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "0.875rem",
                  padding: "1rem",
                  background: "var(--butter)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px oklch(0.18 0.02 80 / 0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      Order #{order.order_id.slice(0, 8)}
                    </p>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "oklch(0.5 0.04 80)",
                        marginTop: "0.2rem",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {new Date(order.ordertime).toLocaleString()}
                    </p>
                  </div>

                  <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.35rem",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                      margin: 0,
                    }}
                  >
                    ৳ {parseFloat(order.total_price).toLocaleString()}
                  </p>

                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      fontFamily: "var(--font-sans)",
                      textTransform: "capitalize",
                      background:
                        order.status === "delivered"
                          ? "oklch(0.92 0.08 145)"
                          : order.status === "cancelled"
                          ? "oklch(0.94 0.05 27)"
                          : order.status === "processing"
                          ? "oklch(0.95 0.07 80)"
                          : "oklch(0.93 0.03 80)",
                      color:
                        order.status === "delivered"
                          ? "oklch(0.45 0.12 145)"
                          : order.status === "cancelled"
                          ? "oklch(0.45 0.18 27)"
                          : order.status === "processing"
                          ? "oklch(0.42 0.09 80)"
                          : "var(--ink)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                  }}
                >
                  {(typeof order.items === "string"
                    ? JSON.parse(order.items)
                    : order.items
                  ).map((item, idx) => (
                    <p
                      key={idx}
                      style={{
                        fontSize: "0.8rem",
                        color: "oklch(0.4 0.03 80)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      • {item.product_name} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "oklch(0.6 0.03 80)",
                  padding: "2.5rem 0",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                No orders yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
