import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import { formatPrice } from '../utils/formatPrice';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getProductById(id);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError('Failed to load product details');
        }
      } catch (err) {
        setError('Error loading product. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    
    // Reset the "Added to cart" message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };
  
  const handleEditProduct = () => {
    navigate(`/admin/products/edit/${id}`);
  };
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/')} className="btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-details">
          <div className="product-image-container">
            <img 
              src={product.image} 
              alt={product.title} 
              className="product-detail-image" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
              }}
            />
          </div>
          
          <div className="product-info-container">
            <div className="breadcrumb">
              <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
              <span className="breadcrumb-separator">/</span>
              <span onClick={() => navigate(`/products/category/${product.category}`)} className="breadcrumb-link">{product.category}</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{product.title}</span>
            </div>
            
            <h1 className="product-title">{product.title}</h1>
            
            <div className="product-price">{formatPrice(product.price)}</div>
            
            {product.ratings && (
              <div className="product-ratings">
                <div className="stars">
                  {'★'.repeat(Math.floor(product.ratings.average))}
                  {'☆'.repeat(5 - Math.floor(product.ratings.average))}
                </div>
                <span className="ratings-count">({product.ratings.count} reviews)</span>
              </div>
            )}
            
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
            
            <div className="stock-status">
              <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            {product.inStock && (
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={decrementQuantity}>-</button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  className="quantity-input"
                />
                <button className="quantity-btn" onClick={incrementQuantity}>+</button>
              </div>
            )}
            
            <div className="product-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              {isAdmin() && (
                <button className="edit-product-btn" onClick={handleEditProduct}>
                  Edit Product
                </button>
              )}
            </div>
            
            {addedToCart && (
              <div className="added-to-cart-message">
                Product added to cart!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;