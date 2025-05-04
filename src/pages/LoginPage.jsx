import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        await login(formData);
        navigate('/')
    }

    return (
        <div className='login-form'>
            <div>
               <h2>Login</h2> 
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
            <div className="form-link">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
        </div>
    )
}

export default LoginPage;
