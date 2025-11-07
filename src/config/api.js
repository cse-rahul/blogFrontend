// ✅ Dynamic API configuration from Catalyst Slate environment variables
// These variables are set in Catalyst Slate Console (not in .env file)

export const API_CONFIG = {
  // Backend base URL (for uploads, images)
  // Set in Catalyst Slate Console as: VITE_BACKEND_HOST
  BACKEND_HOST: import.meta.env.VITE_BACKEND_HOST || "http://localhost:9000",
  
  // API base URL (for API calls)
  // Set in Catalyst Slate Console as: VITE_API_URL
  API_BASE: import.meta.env.VITE_API_URL || "http://localhost:9000/api",
  
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
    
    return `${this.BACKEND_HOST}${path}`;
  }
};

console.log('📍 API Config (from Catalyst Slate Console):', {
  BACKEND_HOST: API_CONFIG.BACKEND_HOST,
  API_BASE: API_CONFIG.API_BASE,
  AUTH_URL: API_CONFIG.AUTH_URL,
  BLOGS_URL: API_CONFIG.BLOGS_URL
});
