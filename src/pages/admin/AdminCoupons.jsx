import { useState } from 'react';
import { Tag, Plus, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminCoupons() {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', discount: 10, expiry: '2026-12-31', active: true },
    { id: 2, code: 'SUMMER20', discount: 20, expiry: '2026-08-31', active: true },
    { id: 3, code: 'VIP50', discount: 50, expiry: '2025-12-31', active: false },
  ]);

  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiry: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiry) {
      toast.error('Please fill all fields');
      return;
    }
    
    const coupon = {
      id: Date.now(),
      code: newCoupon.code.toUpperCase(),
      discount: Number(newCoupon.discount),
      expiry: newCoupon.expiry,
      active: true
    };

    setCoupons([coupon, ...coupons]);
    setNewCoupon({ code: '', discount: '', expiry: '' });
    setIsAdding(false);
    toast.success('Coupon created successfully');
  };

  const toggleStatus = (id) => {
    setCoupons(coupons.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    ));
    toast.success('Status updated');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light tracking-tight uppercase">Coupons</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-black text-white px-4 py-2 text-sm font-semibold tracking-widest uppercase flex items-center gap-2 hover:bg-gray-900 transition-colors"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm mb-8">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-4 border-b border-gray-100 pb-2">Create New Coupon</h2>
          <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Code</label>
              <input 
                type="text" 
                value={newCoupon.code}
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                placeholder="e.g. SALE20"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black uppercase"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Discount (%)</label>
              <input 
                type="number" 
                min="1" max="100"
                value={newCoupon.discount}
                onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
                placeholder="20"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">Expiry Date</label>
              <input 
                type="date" 
                value={newCoupon.expiry}
                onChange={e => setNewCoupon({...newCoupon, expiry: e.target.value})}
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-900 transition-colors">
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold tracking-widest uppercase text-gray-500">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Expiry Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(coupon => (
              <tr key={coupon.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono font-medium text-gray-900 flex items-center gap-2">
                  <Tag size={14} className="text-gray-400" />
                  {coupon.code}
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {coupon.discount}% OFF
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(coupon.expiry).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleStatus(coupon.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-sm border ${coupon.active ? 'text-gray-600 border-gray-300 hover:bg-gray-100' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                  >
                    {coupon.active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCoupons;
