export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-800">
      {/* Navbar Container */}
      <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="font-black text-xl tracking-wider text-emerald-800">MOHOR</span>
        <div className="space-x-6 text-sm font-bold text-neutral-700">
          <a href="/" className="hover:text-emerald-700 transition">Shop</a>
          <a href="/cart" className="hover:text-emerald-700 transition">Cart</a>
          <a href="/login" className="hover:text-emerald-700 transition">Get Started</a>
        </div>
      </nav>

      {/* Main Screen Target Wrapper */}
      <main className="flex-grow">{children}</main>

      <footer className="bg-neutral-900 text-neutral-400 text-center py-6 text-xs">
        &copy; {new Date().getFullYear()} Mohor E-Commerce. All rights reserved.
      </footer>
    </div>
  );
}