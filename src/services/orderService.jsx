import axios from 'axios';
import { getToken } from '../utils/getToken';

const API_URL = 'http://localhost:8008/api/orders';

const getAllOrders = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      API_URL, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/${orderId}`, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Server error' };
  }
};

const getMyOrders = async () => {
  try {
    const token = getToken();
    const response = await axios.get(
      `${API_URL}/myorders`, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createOrder = async (orderData) => {
  try {
    const token = getToken();
    const response = await axios.post(
      API_URL, 
      orderData, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
        console.error(error);
        throw error;  
  }
};

const updateOrderStatus = async (orderId, status) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `${API_URL}/${orderId}`, 
      { orderId, status }, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteOrder = async (orderId) => {
  try {
    const token = getToken();
    const response = await axios.delete(
      `${API_URL}/${orderId}`, 
      { headers: { Authorization: `Bearer ${token}` }}
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const orderService = {
  getAllOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

export default orderService;