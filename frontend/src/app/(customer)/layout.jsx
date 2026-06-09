import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext"; 
import { OrderProvider } from "@/context/OrderContext";
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
        
        <AuthProvider>
          
          <CartProvider>
            <OrderProvider>
              <div
                className="min-h-screen flex flex-col"
                style={{
                  background: "var(--butter)",
                  backgroundImage:
                    "radial-gradient(oklch(0.18 0.02 80 / 0.08) 1px, transparent 1px)",
                  backgroundSize: "8px 4px",
                }}
              >
                <Navbar />
                <main className="flex-grow">{children}</main>

                <Footer />
              </div>

              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "oklch(0.985 0.03 95)",
                    color: "oklch(0.18 0.02 80)",
                    border: "1px solid oklch(0.78 0.15 80)",
                    borderRadius: "1rem",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    boxShadow: "0 8px 32px oklch(0.18 0.02 80 / 0.2)",
                    padding: "1rem 1.5rem",
                  },
                  success: {
                    iconTheme: {
                      primary: "oklch(0.78 0.15 80)",
                      secondary: "oklch(0.18 0.02 80)",
                    },
                  },
                  error: {
                    style: { border: "1px solid oklch(0.55 0.2 27)" },
                    iconTheme: {
                      primary: "oklch(0.55 0.2 27)",
                      secondary: "white",
                    },
                  },
                }}
              />
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
