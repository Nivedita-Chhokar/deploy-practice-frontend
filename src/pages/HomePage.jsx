import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

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
        
        // Get all products for featured section
        const allProductsResponse = await productService.getAllProducts();
        if (allProductsResponse.success) {
          // Sort by highest rating for featured
          const sortedProducts = [...allProductsResponse.data].sort(
            (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0)
          );
          setFeaturedProducts(sortedProducts.slice(0, 4));
        }
        
        // Get shoes products
        const shoesResponse = await productService.getAllProducts('shoes');
        if (shoesResponse.success) {
          setShoesProducts(shoesResponse.data.slice(0, 4));
        }
        
        // Get shirts products
        const shirtsResponse = await productService.getAllProducts('shirts');
        if (shirtsResponse.success) {
          setShirtsProducts(shirtsResponse.data.slice(0, 4));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
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
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
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
          <div className="grid grid-4-cols">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
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
      {shoesProducts.length > 0 && (
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">Popular Shoes</h2>
            <div className="grid grid-4-cols">
              {shoesProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="view-all">
              <Link to="/products/category/shoes" className="btn btn-outline">
                View All Shoes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Popular Shirts */}
      {shirtsProducts.length > 0 && (
        <section className="products-section">
          <div className="container">
            <h2 className="section-title">Popular Shirts</h2>
            <div className="grid grid-4-cols">
              {shirtsProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="view-all">
              <Link to="/products/category/shirts" className="btn btn-outline">
                View All Shirts
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;