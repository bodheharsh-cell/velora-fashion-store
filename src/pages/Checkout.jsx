import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wallet, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const { cartItems, cartTotal } = useShop();

  const subtotal = cartTotal;
  const shipping = 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    // In the future, initiate Razorpay or other payment gateways here based on `paymentMethod`
    console.log('Initiating checkout with method:', paymentMethod);
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
                  <input type="text" placeholder="Full Name" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="email" placeholder="Email Address" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="tel" placeholder="Phone Number" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-2">
                  <input type="text" placeholder="Address Line" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" placeholder="City" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" placeholder="State / Province" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" placeholder="Postal Code" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-1">
                  <input type="text" placeholder="Country" required
                    className="w-full bg-transparent border-b border-gray-300 pb-3 text-sm placeholder-gray-400 outline-none focus:border-black transition-colors" />
                </div>
                <div className="sm:col-span-2 mt-4">
                  <textarea placeholder="Delivery Instructions (Optional)" rows="3"
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
                      ${item.price * item.quantity}
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-6 mb-8">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button type="submit" className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors shadow-md hover:shadow-lg">
                Continue to Payment
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Checkout;
