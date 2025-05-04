const CART_KEY = 'shopping_cart';

// Get cart items from localStorage
const getCartItems = () => {
  const cartItems = localStorage.getItem(CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
};

// Add item to cart
const addToCart = (product, quantity = 1) => {
  const cartItems = getCartItems();
  
  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex(item => item.productId === product._id);
  
  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cartItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity
    });
  }
  
  // Save to localStorage
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  
  return cartItems;
};

// Update cart item quantity
const updateCartItemQuantity = (productId, quantity) => {
  const cartItems = getCartItems();
  
  const updatedItems = cartItems.map(item => {
    if (item.productId === productId) {
      return { ...item, quantity: quantity };
    }
    return item;
  });
  
  localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
  
  return updatedItems;
};

// Remove item from cart
const removeFromCart = (productId) => {
  const cartItems = getCartItems();
  
  const updatedItems = cartItems.filter(item => item.productId !== productId);
  
  localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
  
  return updatedItems;
};

// Clear cart
const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

// Calculate cart total
const getCartTotal = () => {
  const cartItems = getCartItems();
  
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

const cartService = {
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal
};

export default cartService;