// ✅ Direct Backend URL - NO relative paths
export const API_CONFIG = {
  // Hardcoded backend URL
  BACKEND_HOST: 'https://backend-60056722056.development.catalystserverless.in/server/backend_function',
  API_BASE: 'https://backend-60056722056.development.catalystserverless.in/server/backend_function/api',
  
  get AUTH_URL() {
    return `${this.API_BASE}/auth`;
  },
  
  get BLOGS_URL() {
    return `${this.API_BASE}/blogs`;
  },
  
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    let path = imagePath.replace(/\\/g, '/');
    if (!path.startsWith('/')) path = '/' + path;
    
    return `${this.BACKEND_HOST}${path}`;
  }
};

console.log('📍 API Config (Direct URLs):', {
  BACKEND_HOST: API_CONFIG.BACKEND_HOST,
  API_BASE: API_CONFIG.API_BASE,
  AUTH_URL: API_CONFIG.AUTH_URL,
  BLOGS_URL: API_CONFIG.BLOGS_URL
});
