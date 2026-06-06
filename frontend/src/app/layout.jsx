import './globals.css';
import { AuthProvider } from "@/context/AuthContext";
export const metadata = {
  title: 'Mohor Premium Storefront',
  description: 'Exquisite catalog curation lines tailored perfectly.',
};

export default function RootLayout({ children }) {
  return (
    <html 
      lang="en" 
      className="scroll-smooth" 
      data-scroll-behavior="smooth" // Add this line
      suppressHydrationWarning
    >
      <body className="transition-colors duration-300">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}