import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"; // 🛒 Import the Cart Provider
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mohor",
  description: "Modern Ecommerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="transition-colors duration-300">
        {/* 1. Auth context sits at the root level */}
        <AuthProvider>
          {/* 2. Cart context sits inside Auth so it can listen to login/logout states safely */}
          <CartProvider>
            
            <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950">
              <Navbar />
              
              {/* This ensures your page contents flex grow to keep footer pinned at bottom */}
              <main className="flex-grow">
                {children}
              </main>
              
              <Footer />
            </div>

            <Toaster position="bottom-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}