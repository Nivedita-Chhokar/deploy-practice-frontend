import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './assets/index.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8008';

// Add request interceptor for debugging
axios.interceptors.request.use(
  config => {
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`Response error ${error.response.status} from ${error.config.url}:`, 
                   error.response.data);
    } else if (error.request) {
      console.error(`No response received for request to ${error.config.url}`);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);