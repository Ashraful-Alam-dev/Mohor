"use client";

import Link from "next/link";
import { ShoppingCart, Settings, Info, User, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        @keyframes navGlow {
          0%   { box-shadow: 0 0 6px 1px oklch(0.25 0.15 80 / 0.4); }
          14%  { box-shadow: 0 0 14px 4px oklch(0.25 0.15 80 / 0.45); }
          28%  { box-shadow: 0 0 6px 1px oklch(0.25 0.15 80 / 0.29); }
          42%  { box-shadow: 0 0 10px 3px oklch(0.25 0.15 80 / 0.35); }
          70%  { box-shadow: 0 0 6px 1px oklch(0.25 0.15 80 / 0.15); }
          100% { box-shadow: 0 0 6px 1px oklch(0.25 0.15 80 / 0.2); }
        }
        @keyframes textPulse {
          0%   { color: oklch(0.45 0.15 80); }
          14%  { color: oklch(0.30 0.18 80); }
          28%  { color: oklch(0.45 0.15 80); }
          42%  { color: oklch(0.35 0.17 80); }
          70%  { color: oklch(0.45 0.15 80); }
          100% { color: oklch(0.45 0.15 80); }
        }
        @keyframes logoGlow {
          0%   { text-shadow: 0 0 8px oklch(0.18 0.02 80 / 0.4), 0 0 20px oklch(0.18 0.02 80 / 0.2); }
          14%  { text-shadow: 0 0 16px oklch(0.18 0.02 80 / 0.8), 0 0 40px oklch(0.18 0.02 80 / 0.5); }
          28%  { text-shadow: 0 0 8px oklch(0.18 0.02 80 / 0.4), 0 0 20px oklch(0.18 0.02 80 / 0.2); }
          42%  { text-shadow: 0 0 12px oklch(0.18 0.02 80 / 0.6), 0 0 30px oklch(0.18 0.02 80 / 0.35); }
          70%  { text-shadow: 0 0 8px oklch(0.18 0.02 80 / 0.3), 0 0 20px oklch(0.18 0.02 80 / 0.15); }
          100% { text-shadow: 0 0 8px oklch(0.18 0.02 80 / 0.4), 0 0 20px oklch(0.18 0.02 80 / 0.2); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--ink);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          padding: 6px 10px;
          border-radius: 0.5rem;
          transition: background 0.2s;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-item:hover {
          background: oklch(0.78 0.15 80 / 0.25);
          animation: navGlow 2.4s ease-in-out infinite, textPulse 2.4s ease-in-out infinite;
        }
        .nav-item svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--ink);
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          transition: background 0.2s, box-shadow 0.2s;
          text-decoration: none;
          width: 100%;
        }
        .mobile-nav-item:hover {
          background: oklch(0.78 0.15 80 / 0.2);
          box-shadow: 0 0 12px 3px oklch(0.25 0.15 80 / 0.2);
        }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          transition: "background 0.3s, backdrop-filter 0.3s",
          background: scrolled
            ? "oklch(89.27% 0.06963 98.666 / 0.55)"
            : "oklch(89.27% 0.06963 98.666 / 0.98)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display"
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--mustard)",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              animation: "logoGlow 2.4s ease-in-out infinite",
            }}
          >
            Mohor
          </Link>

          {/* Desktop Nav */}
          <div
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <style>{`
              @media (max-width: 767px) { .desktop-nav { display: none !important; } }
            `}</style>

            <Link href="/about" className="nav-item">
              <Info size={18} />
                About Us
            </Link>

            <Link href="/settings" className="nav-item">
              <Settings size={18} />
                Settings
            </Link>

            <Link
              href="/cart"
              className="nav-item"
              style={{ padding: "6px 10px", display: "flex", alignItems: "center" }}
            >
              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "oklch(0.55 0.2 27)",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 900,
                    borderRadius: "99px",
                    minWidth: "14px",
                    height: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    fontFamily: "var(--font-sans)",
                    boxShadow: "0 2px 8px oklch(0.55 0.2 27 / 0.4)",
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span style={{ marginLeft: cartCount > 0 ? "8px" : "0px" }}>Cart</span>
            </Link>

            {user ? (
              <Link href="/profile" className="nav-item">
                <User size={18} />
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  background: "var(--mustard)",
                  padding: "6px 16px",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  transition: "background 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.72 0.15 80)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--mustard)")}
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "0.5rem",
              color: "var(--ink)",
              transition: "background 0.2s",
            }}
          >
            <style>{`
              @media (max-width: 767px) { .hamburger-btn { display: flex !important; align-items: center; justify-content: center; } }
            `}</style>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div
            style={{
              background: "oklch(89.27% 0.06963 98.666 / 0.98)",
              backdropFilter: "blur(12px)",
              borderTop: "1px solid var(--border)",
              padding: "0.75rem 1.25rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              animation: "slideDown 0.2s ease-out",
            }}
          >
            <Link
              href="/about"
              className="mobile-nav-item"
              onClick={() => setMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              href="/settings"
              className="mobile-nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </Link>

            <Link
              href="/cart"
              className="mobile-nav-item"
              onClick={() => setMenuOpen(false)}
            >
              <div style={{ position: "relative", display: "inline-flex" }}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "oklch(0.55 0.2 27)",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 900,
                    borderRadius: "99px",
                    minWidth: "14px",
                    height: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    fontFamily: "var(--font-sans)",
                  }}>
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="mobile-nav-item"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--ink)",
                  background: "var(--mustard)",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  transition: "background 0.2s",
                  marginTop: "0.25rem",
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}