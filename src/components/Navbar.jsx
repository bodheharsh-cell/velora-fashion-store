import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart } from 'lucide-react';
import SearchModal from './SearchModal';
import { useShop } from '../context/ShopContext';

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItemCount, wishlistItemCount } = useShop();

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button className="text-gray-900 hover:text-gray-600 transition-colors">
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start w-full lg:w-auto">
              <Link to="/" className="text-2xl font-bold tracking-tighter uppercase">
                ÉLÉGANCE
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <Link to="/" className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 uppercase transition-colors">Home</Link>
              <Link to="/shop" className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 uppercase transition-colors">Shop</Link>
              <Link to="/collections" className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 uppercase transition-colors">Collections</Link>
              <Link to="/about" className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 uppercase transition-colors">About</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6 hidden sm:flex">
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-900 hover:text-gray-500 transition-colors">
                <Search size={20} strokeWidth={1.5} />
              </button>
              <Link to="/login" className="text-gray-900 hover:text-gray-500 transition-colors">
                <User size={20} strokeWidth={1.5} />
              </Link>
              <Link to="/wishlist" className="text-gray-900 hover:text-gray-500 transition-colors relative">
                <Heart size={20} strokeWidth={1.5} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{wishlistItemCount}</span>
                )}
              </Link>
              <Link to="/cart" className="text-gray-900 hover:text-gray-500 transition-colors relative">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartItemCount}</span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Navbar;
