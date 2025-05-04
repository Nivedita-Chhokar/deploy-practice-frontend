import axios from 'axios';
import { getToken } from '../utils/getToken';
const API = 'http://localhost:8009/api/products'

const getAllProducts = async(category=null, includeOutOfStock=false) => {
    try {
        const params = {};

        if(category) params.category=category;
        if(includeOutOfStock) params.includeOutOfStock = true;

        const response = await axios.get(API, {params});
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getProductById = async(productId) => {
    try {
        const response = await axios.get(`${API}/${productId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const createProduct = async(productData) => {
    try {
        const token = getToken();
        const response = await axios.post(
            API,
            productData,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

const updateProduct = async(productId, productData) => {
    try {
        const token = getToken();
        const response = await axios.put(
            `${API}/${productId}`,
            productData,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const deleteProduct = async(productId) => {
    try {
        const token = getToken();
        const response = await axios.delete(
            `${API}/${productId}`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

const productService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productService;
