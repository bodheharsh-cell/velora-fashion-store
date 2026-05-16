import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useShop();

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">It seems you haven't added any items to your cart yet.</p>
        <Link 
          to="/shop" 
          className="border border-black px-12 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-12">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm tracking-wide text-gray-500 uppercase">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2"></div>
            </div>

            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="py-8 flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4 sm:gap-6 border-b border-gray-100 last:border-0 relative">
                  {/* Mobile Layout */}
                  <div className="flex gap-4 sm:hidden w-full">
                     <div className="w-24 h-32 flex-shrink-0 bg-gray-50">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex flex-col flex-1 justify-between py-1">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-sm font-semibold tracking-wide uppercase mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-500">${item.price}</p>
                           </div>
                           <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-black transition-colors p-1 -mt-1 -mr-1">
                             <X size={20} strokeWidth={1} />
                           </button>
                        </div>
                        
                        <div className="flex justify-between items-end mt-auto">
                           <div className="flex items-center border border-gray-300 w-24 h-8">
                             <button onClick={() => updateQuantity(item.cartItemId, -1)} className="flex-1 flex justify-center text-gray-500 hover:text-black">
                               <Minus size={14} />
                             </button>
                             <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.cartItemId, 1)} className="flex-1 flex justify-center text-gray-500 hover:text-black">
                               <Plus size={14} />
                             </button>
                           </div>
                           <div className="text-sm font-semibold">
                             ${item.price * item.quantity}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:contents">
                    <div className="col-span-6 flex gap-6">
                      <div className="w-24 h-32 flex-shrink-0 bg-gray-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-sm font-semibold tracking-wide uppercase mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 w-24 h-10">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="flex-1 flex justify-center text-gray-500 hover:text-black">
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="flex-1 flex justify-center text-gray-500 hover:text-black">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right text-sm font-semibold">
                      ${item.price * item.quantity}
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button onClick={() => removeFromCart(item.cartItemId)} className="text-gray-400 hover:text-black transition-colors p-2 m-0">
                        <X size={20} strokeWidth={1} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-8">
              <h2 className="text-lg font-light tracking-tight uppercase mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-6 mb-8">
                <span>Total</span>
                <span>${cartTotal}</span>
              </div>

              <Link to="/checkout" className="block text-center w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors">
                Proceed to Checkout
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;
