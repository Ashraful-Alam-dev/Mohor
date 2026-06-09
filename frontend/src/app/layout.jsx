import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
export const metadata = {
  title: "Mohor Premium Storefront",
  description: "Exquisite catalog curation lines tailored perfectly.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth" 
      suppressHydrationWarning
    >
      <body
        className="transition-colors duration-300"
        style={{
          background: "var(--butter)",
          backgroundImage:
            "radial-gradient(oklch(0.18 0.02 80 / 0.08) 1px, transparent 1px)",
          backgroundSize: "8px 4px",
          minHeight: "100vh",
        }}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
