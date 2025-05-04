import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import '../assets/checkout.css';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('Card');
  
  // Shipping address state
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: ''
  });
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Create order data
      const orderData = {
        products: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        paymentMethod,
        paymentStatus: 'Paid', 
        orderStatus: 'Processing',
        shippingAddress
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        setSuccess(true);
        clearCart();
        
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        setError(response.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };
  
  // If not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (success) {
    return (
      <div className="container">
        <div className="success-container">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. You'll be redirected to your orders page shortly.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <div className="checkout-container">
          <div className="checkout-form-container">
            <h2 className="section-title">Shipping Information</h2>
            
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="street" className="form-label">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your street address"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your city"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your state"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your ZIP code"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <h2 className="section-title">Payment Method</h2>
              
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <label htmlFor="card" className="payment-label">
                    <span className="payment-icon">💳</span>
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <label htmlFor="upi" className="payment-label">
                    <span className="payment-icon">📱</span>
                    <span>UPI Payment</span>
                  </label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={handlePaymentMethodChange}
                    className="payment-radio"
                  />
                  <label htmlFor="cod" className="payment-label">
                    <span className="payment-icon">💵</span>
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="checkout-btn"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2 className="section-title">Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="order-item">
                  <div className="order-item-info">
                    <div className="order-item-name">{item.title}</div>
                    <div className="order-item-quantity">x {item.quantity}</div>
                  </div>
                  <div className="order-item-price">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="order-subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              
              <div className="order-shipping">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="order-total">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;