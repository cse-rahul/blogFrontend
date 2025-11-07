import axios from "axios";

// ✅ Dynamic BASE_URL - uses Catalyst env variable
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:9000/api/auth";

console.log('📍 Auth API URL:', BASE_URL);

// ✅ Login function
export const login = ({ email, password }) => {
  console.log('🔐 Login attempt:', email);
  return axios.post(`${BASE_URL}/login`, { email, password });
};

// ✅ Signup function
export const signup = ({ email, password }) => {
  console.log('📝 Signup attempt:', email);
  return axios.post(`${BASE_URL}/register`, { email, password });
};
