import React from 'react';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../lib/orderService';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { error } = await updateOrderStatus(orderId, newStatus);
      if (error) {
        toast.error('Failed to update status');
      } else {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-lg sm:text-2xl font-light tracking-tight uppercase">Orders</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 outline-none focus:border-black transition-colors rounded-sm"
            />
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            {filteredOrders.length} Orders
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="px-3 sm:px-6 py-4">Order ID</th>
                <th className="px-3 sm:px-6 py-4">Date</th>
                <th className="px-3 sm:px-6 py-4">Customer</th>
                <th className="px-3 sm:px-6 py-4">Total</th>
                <th className="px-3 sm:px-6 py-4">Status</th>
                <th className="px-3 sm:px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs text-gray-500">
                        {order.id.split('-')[0]}...
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-400">{order.customer_email}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`text-xs font-semibold px-2 py-1 rounded-sm outline-none border cursor-pointer disabled:opacity-50 transition-colors ${
                            order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700 focus:border-green-500' :
                            order.status === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700 focus:border-red-500' :
                            order.status === 'Shipped' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:border-blue-500' :
                            'bg-orange-50 border-orange-200 text-orange-700 focus:border-orange-500'
                          }`}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-gray-400 hover:text-black transition-colors flex items-center justify-end w-full"
                        >
                          {expandedOrderId === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan="6" className="px-3 sm:px-6 py-4 sm:py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <div>
                              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-900">Order Items</h4>
                              <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-4">
                                    <div className="w-12 h-16 bg-white flex-shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                      <div className="text-xs text-gray-500">Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''} {item.selectedColor ? `| Color: ${item.selectedColor}` : ''}</div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-gray-900">Shipping Details</h4>
                              {order.shipping_address ? (
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                                  <p>{order.shipping_address.address}</p>
                                  <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
                                  <p>{order.shipping_address.country}</p>
                                  <p className="pt-2">Phone: {order.shipping_address.phone}</p>
                                  <p>Payment: {order.payment_method.toUpperCase()}</p>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No shipping details provided.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
