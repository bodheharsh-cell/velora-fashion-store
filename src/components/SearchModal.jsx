import { X, Search } from 'lucide-react';

function SearchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-white/95 backdrop-blur-md transition-opacity duration-300">
      <div className="w-full max-w-4xl mx-auto px-4 pt-32 relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={32} strokeWidth={1} />
        </button>
        
        <div className="relative border-b-2 border-black pb-4 mb-12 flex items-center">
          <Search size={32} className="text-gray-400 mr-4" strokeWidth={1} />
          <input 
            type="text" 
            placeholder="Search products, collections..." 
            className="w-full text-3xl md:text-5xl font-light tracking-tight bg-transparent border-none outline-none placeholder-gray-300 text-black"
            autoFocus
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-6">Trending Searches</h3>
          <ul className="space-y-4">
            <li><button className="text-xl md:text-2xl font-light hover:text-gray-500 transition-colors">Minimalist Black Dress</button></li>
            <li><button className="text-xl md:text-2xl font-light hover:text-gray-500 transition-colors">Leather Accessories</button></li>
            <li><button className="text-xl md:text-2xl font-light hover:text-gray-500 transition-colors">Fall Collection</button></li>
            <li><button className="text-xl md:text-2xl font-light hover:text-gray-500 transition-colors">Essential Shirts</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
