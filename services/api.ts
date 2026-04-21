import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Determine base URL based on platform
// For Android emulator: 10.0.2.2 (special alias for localhost)
// For iOS simulator: localhost
// For physical device: your computer's local IP address
const getBaseUrl = () => {
  // You can manually set this based on your environment
  // For Android emulator:
  return "http://192.168.32.164:3000";
  // For iOS simulator: return "http://localhost:3000";
  // For physical device: return "http://192.168.x.x:3000"; (your computer's IP)
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
