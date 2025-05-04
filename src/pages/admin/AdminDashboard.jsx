import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products
        const productsResponse = await productService.getAllProducts(null, true);
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }
        
        // Fetch orders
        const ordersResponse = await orderService.getAllOrders();
        if (ordersResponse.success) {
          // Sort orders by date (newest first)
          const sortedOrders = [...ordersResponse.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sortedOrders);
        }
      } catch (err) {
        setError('Error loading data. Please try again later.');
        console.error('Error fetching admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await productService.deleteProduct(productId);
        if (response.success) {
          setProducts(products.filter(product => product._id !== productId));
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        alert('Error deleting product');
        console.error('Error deleting product:', err);
      }
    }
  };

  // Handle update order status
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, status);
      if (response.success) {
        // Update orders list
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: status } 
            : order
        ));
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      alert('Error updating order status');
      console.error('Error updating order status:', err);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
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
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
        
        {activeTab === 'products' ? (
          <div className="admin-products">
            <div className="admin-header">
              <h2 className="section-title">Manage Products</h2>
              <Link to="/admin/products/add" className="btn">
                Add New Product
              </Link>
            </div>
            
            <div className="product-list">
              <div className="product-list-header">
                <div className="product-col image">Image</div>
                <div className="product-col title">Title</div>
                <div className="product-col category">Category</div>
                <div className="product-col price">Price</div>
                <div className="product-col stock">Stock</div>
                <div className="product-col actions">Actions</div>
              </div>
              
              {products.length === 0 ? (
                <div className="empty-list">No products found</div>
              ) : (
                products.map(product => (
                  <div key={product._id} className="product-list-item">
                    <div className="product-col image">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="product-col title">{product.title}</div>
                    <div className="product-col category">{product.category}</div>
                    <div className="product-col price">{formatPrice(product.price)}</div>
                    <div className="product-col stock">
                      <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="product-col actions">
                      <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit-btn">
                        Edit
                      </Link>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="admin-orders">
            <h2 className="section-title">Manage Orders</h2>
            
            <div className="order-list">
              <div className="order-list-header">
                <div className="order-col id">Order ID</div>
                <div className="order-col customer">Customer</div>
                <div className="order-col date">Date</div>
                <div className="order-col total">Total</div>
                <div className="order-col status">Status</div>
                <div className="order-col actions">Actions</div>
              </div>
              
              {orders.length === 0 ? (
                <div className="empty-list">No orders found</div>
              ) : (
                orders.map(order => (
                  <div key={order._id} className="order-list-item">
                    <div className="order-col id">{order._id}</div>
                    <div className="order-col customer">{order.user}</div>
                    <div className="order-col date">{formatDate(order.createdAt)}</div>
                    <div className="order-col total">{formatPrice(order.totalAmount)}</div>
                    <div className="order-col status">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="order-col actions">
                      <Link to={`/admin/orders/${order._id}`} className="action-btn view-btn">
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;