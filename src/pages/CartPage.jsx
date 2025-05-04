import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import '../assets/cart.css';

const CartPage = () => {
  const { cartItems, updateCartItem, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      updateCartItem(productId, quantity);
    }
  };
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };
  
  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Shopping Cart</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            <div className="cart-header">
              <div className="cart-header-product">Product</div>
              <div className="cart-header-price">Price</div>
              <div className="cart-header-quantity">Quantity</div>
              <div className="cart-header-subtotal">Subtotal</div>
              <div className="cart-header-actions"></div>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-product">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="cart-item-image" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  <div className="cart-item-details">
                    <Link to={`/product/${item.productId}`} className="cart-item-title">
                      {item.title}
                    </Link>
                  </div>
                </div>
                
                <div className="cart-item-price">{formatPrice(item.price)}</div>
                
                <div className="cart-item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                      className="quantity-input"
                    />
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="cart-item-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </div>
                
                <div className="cart-item-actions">
                  <button 
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            
            <button 
              className="checkout-btn"
              onClick={handleProceedToCheckout}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
            
            <div className="cart-actions">
              <Link to="/" className="continue-shopping">
                Continue Shopping
              </Link>
              <button className="clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;