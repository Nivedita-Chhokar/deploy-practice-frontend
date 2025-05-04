import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import '../assets/productCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-img-container">
          <img 
            src={product.image} 
            alt={product.title} 
            className="product-img" 
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        
        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
          
          {product.ratings && (
            <div className="product-rating">
              <span className="stars">
                {'★'.repeat(Math.floor(product.ratings.average))}
                {'☆'.repeat(5 - Math.floor(product.ratings.average))}
              </span>
              <span className="rating-count">({product.ratings.count})</span>
            </div>
          )}
        </div>
      </Link>
      
      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={!product.inStock}
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;