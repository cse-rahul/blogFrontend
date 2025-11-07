import axios from "axios";

// ✅ HARDCODED Catalyst Backend URL
const BASE_URL = "https://backend-60056722056.development.catalystserverless.in/server/backend_function/api/auth";

console.log('📍 Auth API URL:', BASE_URL);

export const login = ({ email, password }) => {
  console.log('🔐 Login attempt:', email);
  return axios.post(`${BASE_URL}/login`, { email, password });
};

export const signup = ({ email, password }) => {
  console.log('📝 Signup attempt:', email);
  return axios.post(`${BASE_URL}/register`, { email, password });
};
