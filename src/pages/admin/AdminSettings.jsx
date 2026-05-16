import { useState } from 'react';
import { Save, Store, Mail, Truck, DollarSign, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'ÉLÉGANCE',
    supportEmail: 'support@elegance.com',
    shippingFee: '150',
    freeShippingThreshold: '5000',
    currency: 'INR',
    orderPrefix: 'ELG-',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light tracking-tight uppercase">Store Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Settings */}
        <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
            <Store size={18} className="text-gray-400" />
            <h2 className="text-sm font-semibold tracking-widest uppercase">General Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Store Name</label>
              <input 
                type="text" name="storeName" value={settings.storeName} onChange={handleChange} required
                className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Support Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" name="supportEmail" value={settings.supportEmail} onChange={handleChange} required
                  className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-black rounded-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Order ID Prefix</label>
              <input 
                type="text" name="orderPrefix" value={settings.orderPrefix} onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black rounded-sm uppercase"
              />
            </div>
          </div>
        </section>

        {/* E-commerce Settings */}
        <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
            <Truck size={18} className="text-gray-400" />
            <h2 className="text-sm font-semibold tracking-widest uppercase">Shipping & Currency</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Currency</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select 
                  name="currency" value={settings.currency} onChange={handleChange}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-black rounded-sm bg-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Standard Shipping Fee</label>
              <input 
                type="number" name="shippingFee" value={settings.shippingFee} onChange={handleChange} min="0"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Free Shipping Threshold</label>
              <input 
                type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} min="0"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black rounded-sm"
              />
            </div>
          </div>
        </section>

        {/* Branding placeholder */}
        <section className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-2">
            <ImageIcon size={18} className="text-gray-400" />
            <h2 className="text-sm font-semibold tracking-widest uppercase">Branding Assets</h2>
          </div>
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <ImageIcon size={32} className="mx-auto text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">Click to upload store logo</p>
              <p className="text-xs text-gray-500">SVG, PNG, or JPG (max 2MB)</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-black text-white px-8 py-3 text-sm font-semibold tracking-widest uppercase flex items-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Saving...</>
            ) : (
              <><Save size={18} /> Save Settings</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminSettings;
