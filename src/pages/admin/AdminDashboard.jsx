import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/productService';
import { getAllOrders } from '../../lib/orderService';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../utils/formatPrice';
import { Package, ShoppingBag, Users, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const products = await getProducts();
      
      // Fetch Orders
      const orders = await getAllOrders();
      
      // Fetch Customers (Profiles)
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'customer');
      const customersCount = profiles ? profiles.length : 0;

      // Calculate Stats
      const revenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
      
      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customersCount,
      });

      // Stock alerts: products with stock < 10 (includes 0)
      const alertProducts = products
        .filter(p => p.stock < 10)
        .sort((a, b) => a.stock - b.stock) // most critical first
        .slice(0, 6);
      setLowStockProducts(alertProducts);

      // Recent Orders
      setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-lg sm:text-2xl font-light tracking-tight uppercase">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Total Revenue</h3>
            <DollarSign size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-light tracking-tight">{formatPrice(stats.totalRevenue)}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Total Orders</h3>
            <ShoppingBag size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-light tracking-tight">{stats.totalOrders}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Total Customers</h3>
            <Users size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-light tracking-tight">{stats.totalCustomers}</p>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold tracking-widest text-gray-500 uppercase">Total Products</h3>
            <Package size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-light tracking-tight">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm min-w-0">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold tracking-widest uppercase">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-gray-500 hover:text-black">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-3 sm:px-6 py-3 font-medium">Order ID</th>
                  <th className="px-3 sm:px-6 py-3 font-medium">Customer</th>
                  <th className="px-3 sm:px-6 py-3 font-medium">Status</th>
                  <th className="px-3 sm:px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs text-gray-500">{order.id.split('-')[0]}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">{order.customer_name}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right font-medium">{formatPrice(order.total)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 sm:px-6 py-8 text-center text-gray-500">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2 text-red-600">
              <AlertCircle size={16} /> Stock Alerts
            </h2>
            <Link to="/admin/products" className="text-xs text-gray-500 hover:text-black">Manage</Link>
          </div>
          <div className="p-4 sm:p-6 flex-1">
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex gap-3 items-center min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-9 h-11 object-cover bg-gray-50 flex-shrink-0 rounded-sm"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    {product.stock === 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        {product.stock} left
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  ✓ All products are well stocked.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
