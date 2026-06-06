"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth(); // Destructure the login function from context

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

      // Use context to manage local state and auth token storage
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-emerald-700 mb-3">
            Mohor
          </h1>

          <h2 className="text-3xl font-black text-neutral-900">
            Welcome Back
          </h2>

          <p className="text-sm text-emerald-800 font-medium mt-1">
            Sign in to your account
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-50 border border-red-100 rounded-xl">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Phone Number
            </label>

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              placeholder="+8801XXXXXXXXX"
              suppressHydrationWarning
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              placeholder="••••••••"
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
            suppressHydrationWarning
          >
            {loading
              ? "Verifying Credentials..."
              : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          Don't have an account yet?{" "}
          <Link
            href="/signup"
            className="text-emerald-700 font-bold"
          >
            Create One
          </Link>
        </div>
      </div>
    </div>
  );
}
