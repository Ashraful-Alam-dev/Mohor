"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function SignupPage() {
  const { login } = useAuth(); // Context integration

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!formData.phone.startsWith("+880")) {
        throw new Error("Use phone format +8801XXXXXXXXX");
      }

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
      }

      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        formData.phone,
        window.recaptchaVerifier,
      );

      setConfirmationResult(confirmation);
      setSuccessMessage("OTP sent successfully.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const userCredential = await confirmationResult.confirm(otpCode);
      const firebaseToken = await userCredential.user.getIdToken();

      // 1. Register User
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseToken,
            name: formData.name,
            password: formData.password,
            address: formData.address,
          }),
        },
      );

      const registerResult = await registerResponse.json();

      if (!registerResult.success) {
        throw new Error(registerResult.message || "Registration failed");
      }

      // 2. Auto Login (Maintains structural styling keys like your login layout)
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.phone,
            password: formData.password,
          }),
        },
      );

      const loginResult = await loginResponse.json();

      if (!loginResult.success) {
        throw new Error("Login after registration failed");
      }

      // Pass exact token payload directly down to your context provider
      login(loginResult.token, loginResult.user);

      setSuccessMessage("Account created successfully!");

      setTimeout(() => {
        if (loginResult.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message || "Registration failed");
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
              Create Account
            </h2>
            <p
              className="text-sm font-medium mt-1"
              style={{ color: "oklch(0.55 0.1 80)" }}
            >
              Join Mohor Community
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

          <div id="recaptcha-container" />

          {/* Input shared style */}
          <style>{`
          .mohor-input {
           width: 100%;
           padding: 0.875rem;
           border: 1px solid var(--border);
            border-radius: 0.75rem;
            background: oklch(0.96 0.03 85);  /* Light cream/yellow background */
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
          background: oklch(0.96 0.03 85);  /* Keep same background on focus */
        }
        .mohor-input:-webkit-autofill,
         .mohor-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 30px oklch(0.96 0.03 85) inset !important;
       -webkit-text-fill-color: var(--ink) !important;
         }
        `}</style>

          {!confirmationResult ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="mohor-input"
                suppressHydrationWarning
              />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+8801XXXXXXXXX"
                className="mohor-input"
                suppressHydrationWarning
              />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                rows={2}
                className="mohor-input"
                suppressHydrationWarning
              />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="mohor-input"
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                style={{
                  width: "100%",
                  background: loading
                    ? "oklch(0.72 0.12 80)"
                    : "var(--mustard)",
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
                  !loading &&
                  (e.target.style.background = "oklch(0.72 0.15 80)")
                }
                onMouseLeave={(e) =>
                  !loading && (e.target.style.background = "var(--mustard)")
                }
              >
                {loading ? "Sending OTP..." : "Send Verification OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="mohor-input"
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  letterSpacing: "0.25em",
                }}
                suppressHydrationWarning
              />
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                style={{
                  width: "100%",
                  background: loading ? "oklch(0.35 0.02 80)" : "var(--ink)",
                  color: "var(--butter)",
                  fontWeight: 700,
                  padding: "0.875rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                  transition: "background 0.2s",
                }}
              >
                {loading ? "Verifying..." : "Confirm & Complete Registration"}
              </button>
            </form>
          )}

          <div
            className="mt-6 text-center text-sm"
            style={{ color: "oklch(0.5 0.04 80)" }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "var(--mustard)", fontWeight: 700 }}
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
