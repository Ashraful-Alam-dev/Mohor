export default function CustomerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="font-black text-xl tracking-wider text-indigo-900">MOHOR</span>
        <div className="space-x-6 text-sm font-medium text-gray-600">
          <a href="/" className="hover:text-indigo-600">Shop</a>
          <a href="/cart" className="hover:text-indigo-600">Cart</a>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs">
        &copy; {new Date().getFullYear()} Mohor E-Commerce. All rights reserved.
      </footer>
    </div>
  );
}