import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateRegistration } from "../utils/validators";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateRegistration(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    try {
      setLoading(true);
      setApiError('');
      setSuccess('');
      
      await register(formData);
      setSuccess('Registration successful! You can now login.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: ''
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setApiError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2 className="form-title">Create an Account</h2>
        
        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'input-error' : ''}`}
              placeholder="Create a password"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          
          <button 
            type="submit" 
            className="form-submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="form-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;