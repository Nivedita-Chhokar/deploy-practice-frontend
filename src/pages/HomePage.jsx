import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import '../assets/home.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [shoesProducts, setShoesProducts] = useState([]);
  const [shirtsProducts, setShirtsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching all products...');
        // Direct API call to debug
        const allProductsResponse = await axios.get('http://localhost:8008/api/products');
        console.log('All products response:', allProductsResponse);
        
        if (allProductsResponse.data && allProductsResponse.data.success) {
          // Sort by highest rating for featured
          const sortedProducts = [...allProductsResponse.data.data].sort(
            (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)
          );
          console.log('Featured products:', sortedProducts.slice(0, 4));
          setFeaturedProducts(sortedProducts.slice(0, 4));
        } else {
          console.error('Invalid response format for all products:', allProductsResponse.data);
          setError('Failed to load products. Unexpected response format.');
        }
        
        console.log('Fetching shoes products...');
        // Direct API call to debug
        const shoesResponse = await axios.get('http://localhost:8008/api/products?category=shoes');
        console.log('Shoes response:', shoesResponse);
        
        if (shoesResponse.data && shoesResponse.data.success) {
          console.log('Shoes products:', shoesResponse.data.data.slice(0, 4));
          setShoesProducts(shoesResponse.data.data.slice(0, 4));
        } else {
          console.error('Invalid response format for shoes:', shoesResponse.data);
        }
        
        console.log('Fetching shirts products...');
        // Direct API call to debug
        const shirtsResponse = await axios.get('http://localhost:8008/api/products?category=shirts');
        console.log('Shirts response:', shirtsResponse);
        
        if (shirtsResponse.data && shirtsResponse.data.success) {
          console.log('Shirts products:', shirtsResponse.data.data.slice(0, 4));
          setShirtsProducts(shirtsResponse.data.data.slice(0, 4));
        } else {
          console.error('Invalid response format for shirts:', shirtsResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error details:', err.response || err.message);
        setError('Failed to load products. Please check console for details.');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <div>
            <h3>Troubleshooting Steps:</h3>
            <ol>
              <li>Make sure your backend server is running on port 8008</li>
              <li>Check if MongoDB is connected</li>
              <li>Verify that products were seeded correctly</li>
              <li>Check browser console for detailed errors</li>
            </ol>
          </div>
          <button onClick={() => window.location.reload()} className="btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Add debugging information
  const noProductsMessage = (
    <div className="debug-info" style={{margin: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px'}}>
      <h3>No Products Found</h3>
      <p>If you're not seeing any products, try these steps:</p>
      <ul>
        <li>Check if your backend server is running</li>
        <li>Verify MongoDB connection</li>
        <li>Run the seeder script: <code>node seedDatabase.js</code></li>
        <li>Check browser console for API errors</li>
      </ul>
    </div>
  );

  return (
    <div className="home-page">
      {/* Show debugging info if no products found */}
      {featuredProducts.length === 0 && noProductsMessage}
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Quality Fashion at Affordable Prices</h1>
            <p>Find the perfect style that defines you from our wide collection of shoes and shirts.</p>
            <div className="hero-buttons">
              <Link to="/products/category/shoes" className="btn">
                Shop Shoes
              </Link>
              <Link to="/products/category/shirts" className="btn btn-outline">
                Shop Shirts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-4-cols">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p>No featured products found</p>
          )}
          <div className="view-all">
            <Link to="/products" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          
          <div className="category-container">
            <div className="category-card">
              <div className="category-image shoes-bg"></div>
              <div className="category-content">
                <h3>Shoes Collection</h3>
                <p>Step up your style with our premium shoe collection.</p>
                <Link to="/products/category/shoes" className="btn">
                  Shop Shoes
                </Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image shirts-bg"></div>
              <div className="category-content">
                <h3>Shirts Collection</h3>
                <p>Refresh your wardrobe with our stylish shirt collection.</p>
                <Link to="/products/category/shirts" className="btn">
                  Shop Shirts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Shoes */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Popular Shoes</h2>
          {shoesProducts.length > 0 ? (
            <div className="grid grid-4-cols">
              {shoesProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p>No shoes products found</p>
          )}
          <div className="view-all">
            <Link to="/products/category/shoes" className="btn btn-outline">
              View All Shoes
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Shirts */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Popular Shirts</h2>
          {shirtsProducts.length > 0 ? (
            <div className="grid grid-4-cols">
              {shirtsProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p>No shirts products found</p>
          )}
          <div className="view-all">
            <Link to="/products/category/shirts" className="btn btn-outline">
              View All Shirts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;