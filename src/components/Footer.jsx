import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter uppercase inline-block mb-6">
              ÉLÉGANCE
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Redefining modern luxury. Minimalist aesthetics for the contemporary wardrobe.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-6">Shop</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">Women</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">Men</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-white text-sm transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-6">Assistance</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex border-b border-gray-700 pb-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
              />
              <button type="button" className="text-sm font-semibold uppercase tracking-wider hover:text-gray-300 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">© 2026 ÉLÉGANCE. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
