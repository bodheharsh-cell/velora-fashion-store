import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

function Wishlist() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useShop();

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Heart size={48} strokeWidth={1} className="text-gray-300 mb-6" />
        <h1 className="text-3xl font-light tracking-tight uppercase mb-6">Your Wishlist is Empty</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Save your favorite pieces here to easily find them later or add them to your bag.</p>
        <Link 
          to="/shop" 
          className="border border-black px-12 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
        >
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-light tracking-tight uppercase mb-12">Wishlist</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
          {wishlistItems.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block relative aspect-[3/4] bg-white overflow-hidden mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              
              <button 
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <Heart size={20} fill="black" color="black" />
              </button>

              <h3 className="text-sm font-semibold tracking-wide uppercase mb-1">{product.name}</h3>
              <p className="text-gray-500 font-light mb-4">${product.price}</p>
              
              <button 
                onClick={() => moveToCart(product)}
                className="w-full flex items-center justify-center gap-2 border border-black py-3 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
              >
                <ShoppingBag size={16} />
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
