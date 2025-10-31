// ✅ Get token from localStorage
export const getToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('🔑 Token found:', token.substring(0, 20) + '...');
  } else {
    console.log('❌ No token in localStorage');
  }
  return token;
};

// ✅ Save token to localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
  console.log('💾 Token saved to localStorage');
};

// ✅ Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
  console.log('🗑️ Token removed from localStorage');
};
