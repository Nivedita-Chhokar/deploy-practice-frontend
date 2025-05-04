import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './assets/index.css';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:8009';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);