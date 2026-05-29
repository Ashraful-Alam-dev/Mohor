import './globals.css'; // Imports your global Tailwind styles

export const metadata = {
  title: 'Mohor E-Commerce',
  description: 'High-performance decoupled e-commerce marketplace platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* This children parameter represents your active pages and nested layouts */}
        {children}
      </body>
    </html>
  );
}