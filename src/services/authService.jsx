import axios from 'axios';

// Using relative URL for API when using Vite proxy
const API_URL = '/api/auth';

const register = async(userData) => {
    try {
        console.log('Registration attempt with:', {...userData, password: '***'});
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle various error types
        if (error.response) {
            // The server responded with an error status code
            return error.response.data || { 
                success: false, 
                message: `Server error: ${error.response.status}` 
            };
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from server");
            return { 
                success: false, 
                message: "Server is unreachable. Please try again later." 
            };
        } else {
            // Something else caused the error
            return { 
                success: false, 
                message: "Failed to send request: " + error.message 
            };
        }
    }
};

const login = async(userData) => {
    try {
        console.log('Login attempt with:', {...userData, password: '***'});
        const response = await axios.post(`${API_URL}/login`, userData);
        if(response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        
        if (error.response) {
            return error.response.data || { 
                success: false, 
                message: `Server error: ${error.response.status}` 
            };
        } else if (error.request) {
            console.error("No response received from server");
            return { 
                success: false, 
                message: "Server is unreachable. Please try again later." 
            };
        } else {
            return { 
                success: false, 
                message: "Failed to send request: " + error.message 
            };
        }
    }
};

const logout = async() => {
    try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if(token) {
            await axios.post(
                `${API_URL}/logout`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );
        }

        localStorage.removeItem('user');
        return { success: true };

    } catch (error) {
        console.error("Logout error:", error);
        // Even if logout API fails, we should clear local storage
        localStorage.removeItem('user');
        return { success: true, message: "Logged out locally" };
    }
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser
};

export default authService;