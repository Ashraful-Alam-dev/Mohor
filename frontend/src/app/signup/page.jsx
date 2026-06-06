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
        }
      );

      const confirmation = await signInWithPhoneNumber(
        auth,
        formData.phone,
        window.recaptchaVerifier
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
        }
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
        }
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-md p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-emerald-700 mb-3">
            Mohor
          </h1>

          <h2 className="text-3xl font-black text-neutral-900">
            Create Account
          </h2>

          <p className="text-sm text-emerald-800 font-medium mt-1">
            Join Mohor Community
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

        <div id="recaptcha-container" />

        {!confirmationResult ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              suppressHydrationWarning
            />

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              suppressHydrationWarning
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              rows={2}
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              suppressHydrationWarning
            />

            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-600"
              suppressHydrationWarning
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
              suppressHydrationWarning
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
              className="w-full p-3.5 border border-neutral-200 rounded-xl text-center text-2xl tracking-widest focus:outline-none focus:border-neutral-950"
              suppressHydrationWarning
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-950 hover:bg-black text-white font-bold py-3.5 rounded-xl disabled:opacity-60"
              suppressHydrationWarning
            >
              {loading ? "Verifying..." : "Confirm & Complete Registration"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-700 font-bold">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
