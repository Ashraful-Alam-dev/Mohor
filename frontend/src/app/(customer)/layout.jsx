import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mohor",
  description: "Modern Ecommerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
        <body className="transition-colors duration-300">
          {children}
        </body>
      <Footer />
    </>    
  );
}
