import axios from 'axios';
import { getToken } from '../utils/getToken';

// If using Vite proxy, use relative URLs
const API = '/api/products';

const getAllProducts = async(category=null, includeOutOfStock=false) => {
    try {
        const params = {};

        if(category) params.category = category;
        if(includeOutOfStock) params.includeOutOfStock = true;

        console.log(`Fetching products with params:`, params);
        const response = await axios.get(API, {params});
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        
        // Return a standardized error response
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch products",
            data: [] // Return empty array for better fallback
        };
    }
};

const getProductById = async(productId) => {
    try {
        const response = await axios.get(`${API}/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch product details",
            data: null
        };
    }
};

const createProduct = async(productData) => {
    try {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Authentication required"
            };
        }
        
        const response = await axios.post(
            API,
            productData,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to create product"
        };
    }
};

const updateProduct = async(productId, productData) => {
    try {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Authentication required"
            };
        }
        
        const response = await axios.put(
            `${API}/${productId}`,
            productData,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to update product"
        };
    }
};

const deleteProduct = async(productId) => {
    try {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Authentication required"
            };
        }
        
        const response = await axios.delete(
            `${API}/${productId}`,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to delete product"
        };
    }
};

const productService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productService;