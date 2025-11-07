// ✅ Use Catalyst's built-in serverless routing (no CORS issues)
export const API_CONFIG = {
  // For Slate frontend - use /api direct path (Catalyst proxies it)
  BACKEND_HOST: window.location.origin,  // Same origin
  API_BASE: '/api',  // Relative path - Catalyst will proxy to backend_function
  
  // Derived URLs
  get AUTH_URL() {
    return `${this.API_BASE}/auth`;
  },
  
  get BLOGS_URL() {
    return `${this.API_BASE}/blogs`;
  },
  
  // Image URL builder
  getImageUrl(imagePath) {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    let path = imagePath.replace(/\\/g, '/');
    if (!path.startsWith('/')) path = '/' + path;
    
    // Use relative path for images too
    return `/api/uploads${path}`;
  }
};

console.log('📍 API Config (Catalyst Proxy):', {
  BACKEND_HOST: API_CONFIG.BACKEND_HOST,
  API_BASE: API_CONFIG.API_BASE,
  AUTH_URL: API_CONFIG.AUTH_URL,
  BLOGS_URL: API_CONFIG.BLOGS_URL
});
