import axios from "axios";
import { API_CONFIG } from "../config/api";

console.log('🔐 Auth module loaded with URL:', API_CONFIG.AUTH_URL);

export const login = ({ email, password }) => {
  console.log('🔐 Login attempt:', email);
  console.log('📍 Using AUTH_URL:', API_CONFIG.AUTH_URL);
  
  return axios.post(`${API_CONFIG.AUTH_URL}/login`, { email, password });
};

export const signup = ({ email, password }) => {
  console.log('📝 Signup attempt:', email);
  console.log('📍 Using AUTH_URL:', API_CONFIG.AUTH_URL);
  
  return axios.post(`${API_CONFIG.AUTH_URL}/register`, { email, password });
};
