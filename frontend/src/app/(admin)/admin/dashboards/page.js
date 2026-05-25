export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Operations Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-400 uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-400 uppercase">Active Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-400 uppercase">Inventory Stock</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">0 Items</p>
        </div>
      </div>
    </div>
  );
}