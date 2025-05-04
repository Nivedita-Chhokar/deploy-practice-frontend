import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateLogin } from '../utils/validators';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
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
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Validate form
        const validation = validateLogin(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        try {
            setLoading(true);
            setApiError('');
            
            await login(formData);
            navigate('/');
        } catch (error) {
            setApiError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="form-container">
                <h2 className="form-title">Login to Your Account</h2>
                
                {apiError && (
                    <div className="alert alert-error">
                        {apiError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="auth-form">
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
                            placeholder="Enter your password"
                        />
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="form-submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="form-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;