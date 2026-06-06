"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold"
        >
          Mohor
        </Link>

        <div className="flex items-center gap-6">
          <button>About Us</button>
          <button>Settings</button>

          <button>
            <ShoppingCart />
          </button>

          {user ? (
            <button>Profile</button>
          ) : (
            <Link
              href="/login"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}