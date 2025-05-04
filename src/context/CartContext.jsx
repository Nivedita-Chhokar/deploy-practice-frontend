import { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Initialize cart from localStorage
  useEffect(() => {
    const storedItems = cartService.getCartItems();
    setCartItems(storedItems);
    updateCartTotal(storedItems);
  }, []);

  // Update cart total whenever items change
  const updateCartTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const updatedCart = cartService.addToCart(product, quantity);
    setCartItems(updatedCart);
    updateCartTotal(updatedCart);
  };

  // Update cart item quantity
  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    const updatedCart = cartService.updateCartItemQuantity(productId, quantity);
    setCartItems(updatedCart);
    updateCartTotal(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartService.removeFromCart(productId);
    setCartItems(updatedCart);
    updateCartTotal(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    cartService.clearCart();
    setCartItems([]);
    setCartTotal(0);
  };

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Cart context value
  const value = {
    cartItems,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};