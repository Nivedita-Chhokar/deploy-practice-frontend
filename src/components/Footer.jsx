import '../assets/footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">ShopApp</h3>
          <p className="footer-text">Your one-stop shop for quality clothing and footwear.</p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/products/category/shoes">Shoes</a></li>
            <li><a href="/products/category/shirts">Shirts</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-links">
            <li>Email: info@shopapp.com</li>
            <li>Phone: +91 9876543210</li>
            <li>Address: 123 Shop Street, Bengaluru</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} ShopApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;