const CART_KEY = 'shopping_cart';

// Get cart items from localStorage
const getCartItems = () => {
  try {
    const cartItems = localStorage.getItem(CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Error getting cart items from localStorage:", error);
    return [];
  }
};

// Add item to cart
const addToCart = (product, quantity = 1) => {
  try {
    if (!product || !product._id) {
      console.error("Invalid product provided to addToCart:", product);
      return getCartItems(); // Return current cart without changes
    }
    
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
        title: product.title || 'Unknown Product',
        price: product.price || 0,
        image: product.image || '',
        quantity
      });
    }
    
    // Save to localStorage
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    console.log(`Added/updated product ${product._id} in cart, quantity: ${quantity}`);
    
    return cartItems;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return getCartItems(); // Return current cart without changes
  }
};

// Update cart item quantity
const updateCartItemQuantity = (productId, quantity) => {
  try {
    if (!productId) {
      console.error("Invalid productId provided to updateCartItemQuantity");
      return getCartItems();
    }
    
    const cartItems = getCartItems();
    
    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    
    localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
    console.log(`Updated product ${productId} quantity to ${quantity}`);
    
    return updatedItems;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return getCartItems();
  }
};

// Remove item from cart
const removeFromCart = (productId) => {
  try {
    if (!productId) {
      console.error("Invalid productId provided to removeFromCart");
      return getCartItems();
    }
    
    const cartItems = getCartItems();
    
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    
    localStorage.setItem(CART_KEY, JSON.stringify(updatedItems));
    console.log(`Removed product ${productId} from cart`);
    
    return updatedItems;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return getCartItems();
  }
};

// Clear cart
const clearCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
    console.log("Cart cleared");
    return [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    return getCartItems();
  }
};

// Calculate cart total
const getCartTotal = () => {
  try {
    const cartItems = getCartItems();
    
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  } catch (error) {
    console.error("Error calculating cart total:", error);
    return 0;
  }
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