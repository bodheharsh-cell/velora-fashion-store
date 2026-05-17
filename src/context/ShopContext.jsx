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
    // Enforce out-of-stock guard
    if (!product.stock || product.stock <= 0) {
      toast.error('This product is out of stock.');
      return;
    }

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item =>
        item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItemIndex >= 0) {
        const existingQty = prev[existingItemIndex].quantity;
        const maxStock = product.stock ?? Infinity;
        const newQty = existingQty + quantity;

        if (newQty > maxStock) {
          toast.error(`Only ${maxStock} units available for this item.`);
          // Clamp to max available
          const newItems = [...prev];
          newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity: maxStock };
          return newItems;
        }

        toast.success('Added to bag');
        const newItems = [...prev];
        newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity: newQty };
        return newItems;
      }

      // New item — cap quantity at stock
      const maxStock = product.stock ?? Infinity;
      const clampedQty = Math.min(quantity, maxStock);
      if (clampedQty < quantity) {
        toast.error(`Only ${maxStock} units available. Added ${clampedQty} to your bag.`);
      } else {
        toast.success('Added to bag');
      }

      const cartItemId = `${product.id}-${size}-${color}`;
      return [...prev, { ...product, cartItemId, quantity: clampedQty, selectedSize: size, selectedColor: color }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
    toast.success('Removed from bag');
  };

  /**
   * updateQuantity — delta-based (+1 / -1).
   * Clamps to [1, item.stock] to prevent invalid quantities.
   */
  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId !== cartItemId) return item;

      const maxStock = item.stock ?? Infinity;
      const newQty = item.quantity + delta;

      if (newQty < 1) return { ...item, quantity: 1 };

      if (newQty > maxStock) {
        toast.error(`Only ${maxStock} units available for this item.`);
        return { ...item, quantity: maxStock };
      }

      return { ...item, quantity: newQty };
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
