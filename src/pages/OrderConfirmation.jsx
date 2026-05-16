import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function OrderConfirmation() {
  return (
    <div className="pt-32 min-h-screen bg-white flex flex-col items-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle className="text-green-500 w-24 h-24" strokeWidth={1} />
        </div>
        
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase mb-4">Order Confirmed</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for your purchase. We've received your order and will begin processing it right away. 
            You will receive an email confirmation shortly.
          </p>
        </div>

        <div className="pt-8 flex flex-col space-y-4">
          <Link 
            to="/profile" 
            className="w-full bg-black text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors inline-block"
          >
            View Order History
          </Link>
          <Link 
            to="/shop" 
            className="w-full bg-white text-black border border-black py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-50 transition-colors inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
