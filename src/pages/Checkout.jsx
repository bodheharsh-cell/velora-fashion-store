import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../lib/orderService';
import { validateCartStock, decrementStockForOrder } from '../lib/productService';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useShop();

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    instructions: ''
  });

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal > 0 ? subtotal + shipping + tax : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    // ── Stock validation (live DB check) ─────────────────────────────────────
    const { valid, blockedItems } = await validateCartStock(cartItems);
    if (!valid) {
      const names = blockedItems.map(i => i.name).join(', ');
      toast.error(`Insufficient stock for: ${names}. Please update your cart.`);
      setIsSubmitting(false);
      return;
    }

    const orderData = {
      user_id: user?.id || null,
      customer_name: formData.fullName,
      customer_email: formData.email,
      items: cartItems,
      total: total,
      status: 'Pending',
      payment_method: paymentMethod,
      shipping_address: {
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        instructions: formData.instructions
      }
    };

    const { data: orderResult, error } = await createOrder(orderData);

    if (error) {
      toast.error(error.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // ── Decrement stock after successful order ────────────────────────────────
    // Fire-and-forget — never block the success UX on stock sync
    decrementStockForOrder(cartItems);

    setIsSubmitting(false);
    toast.success('Order placed successfully!');
    clearCart();
    navigate('/order-confirmation');
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-12">Checkout</h1>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* Customer & Shipping Information */}
            <section>
              <h2 className="text-sm font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-200">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="sm:col-span-2">
                  <input type="text" name="fullName" placeholder="Full Name" required
                    value={formData.fullName} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="email" name="email" placeholder="Email Address" required
                    value={formData.email} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="tel" name="phone" placeholder="Phone Number" required
                    value={formData.phone} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <input type="text" name="address" placeholder="Address Line" required
                    value={formData.address} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" name="city" placeholder="City" required
                    value={formData.city} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" name="state" placeholder="State / Province" required
                    value={formData.state} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" name="postalCode" placeholder="Postal Code" required
                    value={formData.postalCode} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" name="country" placeholder="Country" required
                    value={formData.country} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-2 mt-4">
                  <textarea name="instructions" placeholder="Delivery Instructions (Optional)" rows="3"
                    value={formData.instructions} onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors resize-none"></textarea>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-sm font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-200">Payment Method</h2>
              <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>
              
              <div className="space-y-4">
                {/* Razorpay Option */}
                <label className={`block relative border p-6 cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="razorpay" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-600" />
                      <span className="text-sm font-semibold tracking-wide uppercase">Credit Card / Debit / Netbanking</span>
                    </div>
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 ml-8 text-sm text-gray-500 font-light">
                      After clicking "Continue to Payment", you will be redirected to Razorpay to complete your purchase securely.
                    </div>
                  )}
                </label>

                {/* UPI Option */}
                <label className={`block relative border p-6 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="upi" 
                      checked={paymentMethod === 'upi'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <Wallet size={20} className="text-gray-600" />
                      <span className="text-sm font-semibold tracking-wide uppercase">UPI</span>
                    </div>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 ml-8 text-sm text-gray-500 font-light">
                      Pay instantly using any UPI app (GPay, PhonePe, Paytm, etc.).
                    </div>
                  )}
                </label>

                {/* COD Option */}
                <label className={`block relative border p-6 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-black bg-white' : 'border-gray-200 bg-transparent hover:border-gray-300'}`}>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <Truck size={20} className="text-gray-600" />
                      <span className="text-sm font-semibold tracking-wide uppercase">Cash on Delivery</span>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="mt-4 ml-8 text-sm text-gray-500 font-light">
                      Pay with cash upon delivery. An additional fee may apply.
                    </div>
                  )}
                </label>
              </div>
            </section>

          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 bg-white p-8 border border-gray-200 shadow-sm">
              <h2 className="text-sm font-semibold tracking-widest uppercase mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              
              {/* Items List */}
              <div className="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 flex-shrink-0 bg-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <h3 className="text-xs font-semibold tracking-wide uppercase mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-xs font-semibold flex items-center">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex mb-8 border border-gray-300 focus-within:border-black transition-colors">
                <input 
                  type="text" 
                  placeholder="Gift card or discount code" 
                  className="w-full bg-transparent px-4 py-3 text-sm placeholder-gray-400 outline-none"
                />
                <button type="button" className="bg-gray-100 px-6 text-sm font-semibold tracking-widest uppercase hover:bg-gray-200 transition-colors">
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-6 mb-8">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button type="submit" disabled={isSubmitting || cartItems.length === 0} className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Checkout;
