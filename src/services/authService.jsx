import axios from 'axios';

const API = import.meta.env.API_URL;

const register = async(userData) => {
    try {
        const response = await axios.post(`${API}/register`, userData);
        return response.data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const login = async(userData) => {
    try {
        const response = await axios.post(`${API}/login`, userData);
        if(response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error){
        console.error(error);
        throw error;
    }
}

const logout = async() => {
    try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;

        if(token) {
            await axios.post(
                `${API}/logout`,
                {},
                {headers: {Authorization: `Bearer ${token}`}}
            );
        }

        localStorage.removeItem('user');

    } catch (error) {
        console.error(error);
        throw error;
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
