"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth(); 

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Login failed."
        );
      }

      
      login(result.token, result.user);

      setSuccessMessage(
        "Logged in successfully! Redirecting..."
      );

      const redirectPath =
        localStorage.getItem(
          "redirectAfterLogin"
        );

      setTimeout(() => {
        if (
          result.user.role === "admin"
        ) {
          window.location.href =
            "/admin";
        } else if (redirectPath) {
          localStorage.removeItem(
            "redirectAfterLogin"
          );

          window.location.href =
            redirectPath;
        } else {
          window.location.href =
            "/";
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
  <div
    className="min-h-screen flex items-center justify-center px-4 py-12"
    style={{ background: "var(--butter)" }}
  >
    {/* Heartbeat glow wrapper */}
    <div
      style={{
        animation: "heartbeat 2.4s ease-in-out infinite",
        borderRadius: "1.25rem",
        padding: "3px",
        background: "transparent",
        boxShadow: "0 0 0 0 oklch(0.78 0.15 80 / 0.5)",
      }}
    >
      <style>{`
        @keyframes heartbeat {
          0%   { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
          14%  { box-shadow: 0 0 55px 20px oklch(0.78 0.15 80 / 0.65); }
          28%  { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
          42%  { box-shadow: 0 0 48px 16px oklch(0.78 0.15 80 / 0.55); }
          70%  { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.35); }
          100% { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
        }
        .mohor-input {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          background: oklch(0.96 0.03 85);
          color: var(--ink);
          outline: none;
          font-family: var(--font-sans);
          transition: all 0.2s;
        }
        .mohor-input::placeholder {
          color: oklch(0.65 0.04 80);
        }
        .mohor-input:focus {
          border-color: var(--mustard);
          box-shadow: 0 0 0 3px oklch(0.78 0.15 80 / 0.15);
          background: oklch(0.96 0.03 85);
        }
        .mohor-input:-webkit-autofill,
        .mohor-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 30px oklch(0.96 0.03 85) inset !important;
          -webkit-text-fill-color: var(--ink) !important;
        }
      `}</style>

      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: "var(--cream)",
          border: "1px solid var(--border)",
          minWidth: "380px",
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl font-black mb-3 font-display"
            style={{ color: "var(--mustard)" }}
          >
            Mohor
          </h1>
          <h2 className="text-3xl font-black" style={{ color: "var(--ink)" }}>
            Welcome Back
          </h2>
          <p
            className="text-sm font-medium mt-1"
            style={{ color: "oklch(0.55 0.1 80)" }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div
            className="p-3 mb-4 text-sm rounded-xl"
            style={{
              color: "oklch(0.4 0.12 50)",
              background: "oklch(0.97 0.04 80)",
              border: "1px solid oklch(0.88 0.08 80)",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            className="p-3 mb-4 text-sm rounded-xl"
            style={{
              color: "oklch(0.35 0.1 80)",
              background: "oklch(0.95 0.06 90)",
              border: "1px solid var(--mustard)",
            }}
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: "var(--ink)" }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mohor-input"
              placeholder="+8801XXXXXXXXX"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label
              className="block text-xs font-bold uppercase mb-1"
              style={{ color: "var(--ink)" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mohor-input"
              placeholder="••••••••"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            suppressHydrationWarning
            style={{
              width: "100%",
              background: loading ? "oklch(0.72 0.12 80)" : "var(--mustard)",
              color: "var(--ink)",
              fontWeight: 700,
              padding: "0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              transition: "background 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.background = "oklch(0.72 0.15 80)")
            }
            onMouseLeave={(e) =>
              !loading && (e.target.style.background = "var(--mustard)")
            }
          >
            {loading ? "Verifying Credentials..." : "Sign In"}
          </button>
        </form>

        <div
          className="mt-6 text-center text-sm"
          style={{ color: "oklch(0.5 0.04 80)" }}
        >
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            style={{ color: "var(--mustard)", fontWeight: 700 }}
          >
            Create One
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}
