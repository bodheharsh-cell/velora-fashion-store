import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../lib/orderService';
import { formatPrice } from '../utils/formatPrice';
import { Package, Clock } from 'lucide-react';

function UserProfile() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    const data = await getUserOrders(user.id);
    setOrders(data);
    setLoadingOrders(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="pt-24 min-h-screen px-4 max-w-7xl mx-auto pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-light tracking-widest uppercase">My Profile</h1>
          <button 
            onClick={handleSignOut}
            className="text-sm font-semibold tracking-widest uppercase text-gray-500 hover:text-black transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Details */}
          <div className="md:col-span-1">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 text-gray-900">Account Details</h2>
            <div className="bg-gray-50 p-6 rounded-sm space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
              {profile?.full_name && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Name</p>
                  <p className="text-sm font-medium">{profile.full_name}</p>
                </div>
              )}
              {profile?.role === 'admin' && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button 
                    onClick={() => navigate('/admin')}
                    className="w-full bg-black text-white py-3 text-xs font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
                  >
                    Go to Admin Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 text-gray-900">Order History</h2>
            
            {loadingOrders ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-gray-50 p-8 text-center rounded-sm">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-sm text-gray-500 mb-6">When you place an order, it will appear here.</p>
                <button 
                  onClick={() => navigate('/shop')}
                  className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order Placed</p>
                        <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order #</p>
                        <p className="text-sm font-mono text-gray-900">{order.id.split('-')[0]}</p>
                      </div>
                    </div>
                    <div className="px-6 py-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className={order.status === 'Delivered' ? 'text-green-500' : 'text-orange-500'} />
                          <span className="text-sm font-semibold tracking-wide uppercase">{order.status}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-6">
                            <div className="w-20 h-24 bg-gray-50 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
                              <p className="text-xs text-gray-500 mb-2">
                                {item.selectedSize ? `Size: ${item.selectedSize}` : ''} 
                                {item.selectedSize && item.selectedColor ? ' | ' : ''}
                                {item.selectedColor ? `Color: ${item.selectedColor}` : ''}
                              </p>
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <span className="text-sm font-medium">{formatPrice(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
