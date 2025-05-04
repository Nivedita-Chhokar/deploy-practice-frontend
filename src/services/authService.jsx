import axios from 'axios';

const API_URL = 'http://localhost:8009/api/auth';

const register = async(userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;

    } catch (error) {
        console.error(error);
        throw error.response?.data || { message: 'Server error' };
    }
}

const login = async(userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        if(response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error){
        console.error(error);
        throw error.response?.data || { message: 'Server error' };
    }
}

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

    } catch (error) {
        console.error(error);
        throw error.response?.data || { message: 'Server error' };
    }
}

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