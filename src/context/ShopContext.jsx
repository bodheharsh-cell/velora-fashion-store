import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const ShopContext = createContext();

export const useShop = () => {
  return useContext(ShopContext);
};

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1, size = '', color = '') => {
    setCartItems(prev => {
      // Check if product with same id, size, and color exists
      const existingItemIndex = prev.findIndex(item => 
        item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      toast.success('Added to bag');

      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      // Add a unique key combining id, size, color for easy mapping
      const cartItemId = `${product.id}-${size}-${color}`;
      return [...prev, { ...product, cartItemId, quantity, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    toast.success('Removed from bag');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  // --- Wishlist Actions ---
  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        toast.success('Removed from wishlist');
        return prev.filter(item => item.id !== product.id);
      }
      toast.success('Added to wishlist');
      return [...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
    toast.success('Removed from wishlist');
  };

  const moveToCart = (product) => {
    // Default to first size/color if not specified
    const size = product.sizes?.[0] || '';
    const color = product.colors?.[0] || '';
    addToCart(product, 1, size, color);
    removeFromWishlist(product.id);
  };

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id);

  // --- Derived State ---
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistItemCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    removeFromWishlist,
    moveToCart,
    isInWishlist,
    cartItemCount,
    wishlistItemCount,
    cartTotal
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
