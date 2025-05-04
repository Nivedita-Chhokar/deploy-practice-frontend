import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopApp
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/products/category/shoes" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Shoes
            </Link>
          </li>
          
          <li className="nav-item">
            <Link to="/products/category/shirts" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Shirts
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </Link>
              </li>
              
              {isAdmin() && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
              
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
          
          <li className="nav-item cart-item">
            <Link to="/cart" className="nav-link cart-link" onClick={() => setMobileMenuOpen(false)}>
              Cart
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;