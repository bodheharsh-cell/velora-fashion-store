import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, Heart, X } from 'lucide-react';
import SearchModal from './SearchModal';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemCount, wishlistItemCount } = useShop();
  const { user } = useAuth();

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile menu button (Left) */}
            <div className="flex items-center lg:hidden flex-1">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-900 hover:text-gray-600 transition-colors">
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Logo (Center) */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start flex-1 lg:flex-none">
              <Link to="/" className="text-2xl font-bold tracking-tighter uppercase">
                ÉLÉGANCE
              </Link>
            </div>

            {/* Mobile Cart (Right) */}
            <div className="flex items-center justify-end lg:hidden flex-1">
              <Link to="/cart" className="text-gray-900 hover:text-gray-500 transition-colors relative">
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartItemCount}</span>
                )}
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
              <Link to={user ? "/profile" : "/login"} className="text-gray-900 hover:text-gray-500 transition-colors">
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

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] lg:hidden ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Slide-in Menu */}
        <div className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
              <span className="text-xl font-bold tracking-tighter uppercase">ÉLÉGANCE</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Mobile Search Trigger */}
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className="flex items-center justify-between w-full bg-gray-50 p-4 mb-8 text-left hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium tracking-widest uppercase text-gray-500">Search Products</span>
              <Search size={20} className="text-gray-400" strokeWidth={1.5} />
            </button>

            <div className="flex flex-col space-y-6 flex-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-wide uppercase hover:text-gray-500 transition-colors">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-wide uppercase hover:text-gray-500 transition-colors">Shop</Link>
              <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-wide uppercase hover:text-gray-500 transition-colors">Collections</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-light tracking-wide uppercase hover:text-gray-500 transition-colors">About</Link>
              
              <div className="pt-8 mt-auto border-t border-gray-100 flex flex-col space-y-6">
                <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors">
                  <User size={18} className="mr-4" /> {user ? "Profile" : "Account"}
                </Link>
                <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors">
                  <Heart size={18} className="mr-4" /> Wishlist ({wishlistItemCount})
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors">
                  <ShoppingCart size={18} className="mr-4" /> Cart ({cartItemCount})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
