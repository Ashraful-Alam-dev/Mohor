export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <div className="font-black text-xl tracking-widest text-indigo-400 mb-10">MOHOR CONTROL</div>
        <nav className="flex flex-col space-y-4 flex-grow text-sm font-medium text-gray-300">
          <a href="/admin/dashboard" className="hover:text-white py-2 border-b border-gray-800">Dashboard</a>
          <a href="/admin/products" className="hover:text-white py-2 border-b border-gray-800">Inventory</a>
          <a href="/admin/orders" className="hover:text-white py-2 border-b border-gray-800">Orders</a>
        </nav>
      </aside>
      <main className="flex-grow">{children}</main>
    </div>
  );
}