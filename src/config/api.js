// ✅ FINAL FIX - Direct Backend URL
export const API_CONFIG = {
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

console.log('📍 API Config (Direct URLs):', API_CONFIG);
