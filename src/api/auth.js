import axios from "axios";

const BASE_URL = "http://localhost:5000/api/auth";

// Login function
export const login = ({ email, password }) =>
  axios.post(`${BASE_URL}/login`, { email, password });

// Signup function
export const signup = ({ email, password }) =>
  axios.post(`${BASE_URL}/register`, { email, password });
