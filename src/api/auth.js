import axios from "axios";

// ✅ Dynamic BASE_URL for development and production
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9000/api/auth";

// Login function
export const login = ({ email, password }) =>
  axios.post(`${BASE_URL}/login`, { email, password });

// Signup function
export const signup = ({ email, password }) =>
  axios.post(`${BASE_URL}/register`, { email, password });
