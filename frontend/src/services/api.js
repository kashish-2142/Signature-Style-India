// API service for making HTTP requests to the backend
import axios from "axios";

// Base URL for all API requests
const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API calls
export const authAPI = {
  // User login
  login: (email, password) => api.post("/auth/login", { email, password }),

  // User signup
  signup: (name, email, password) =>
    api.post("/auth/signup", { name, email, password }),

  // Get current user info
  getMe: () => api.get("/auth/me"),
};

// Product API calls
export const productAPI = {
  // Get all products (with optional category or fit filter)
  getProducts: (category = "", fit = "") => {
    let url = "/products";
    const params = [];

    if (category) {
      params.push(`category=${category}`);
    }

    if (fit) {
      params.push(`fit=${fit}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return api.get(url);
  },

  // Get single product by ID
  getProduct: (id) => api.get(`/products/${id}`),

  // Add new product (admin only)
  addProduct: (productData) => api.post("/products", productData),

  // Update product (admin only)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),

  // Delete product (admin only)
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Order API calls
export const orderAPI = {
  // Create new order
  createOrder: (orderData) => api.post("/orders", orderData),

  // Get user's orders
  getOrders: () => api.get("/orders"),

  // Get specific order
  getOrder: (id) => api.get(`/orders/${id}`),

  // Update order status
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),
};

export default api;
