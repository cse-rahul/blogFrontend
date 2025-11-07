import axios from "axios";
import { getToken } from "../utils/authtoken";

// ✅ Dynamic BASE_URL for Catalyst
// Since VITE_API_URL already has /api, add /blogs to it
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/blogs`
  : "http://localhost:9000/api/blogs";

console.log('📍 Blog API URL:', BASE_URL);

// ✅ Upload new blog post with image using FormData
export const uploadPost = (formData) => {
  try {
    console.log('📤 Uploading blog post...');
    console.log('🔑 Token:', getToken() ? '✅ Present' : '❌ Missing');
    
    // Log form data for debugging
    for (let pair of formData.entries()) {
      if (pair[0] === 'bannerImage') {
        console.log(`📷 ${pair[0]}: File (${pair[1].name}, ${pair[1].size} bytes)`);
      } else if (pair[0] === 'content') {
        console.log(`📝 ${pair[0]}: ${pair[1].substring(0, 50)}...`);
      } else {
        console.log(`✍️ ${pair[0]}: ${pair[1]}`);
      }
    }

    return axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      console.log('✅ Blog uploaded successfully');
      console.log('📍 Response:', response.data);
      return response;
    }).catch(error => {
      console.error('❌ Upload error:', error.response?.data || error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Upload error (catch):', error.message);
    throw error;
  }
};

// ✅ Get all blog posts (NO AUTH needed - public)
export const getAllBlogs = async () => {
  try {
    console.log('📚 Fetching all blogs from:', BASE_URL);
    
    const response = await axios.get(BASE_URL, {
      timeout: 10000,
    });
    
    console.log('✅ Blogs fetched successfully:', response.data.length, 'blogs');
    console.log('📋 Blogs:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    console.error('📍 URL attempted:', BASE_URL);
    console.error('⚠️ Response status:', error.response?.status);
    console.error('⚠️ Response data:', error.response?.data);
    throw error;
  }
};

// ✅ Get single blog post by ID (NO AUTH needed - public)
export const getBlogById = async (id) => {
  try {
    const url = `${BASE_URL}/${id}`;
    console.log('🔍 Fetching blog from:', url);
    
    const response = await axios.get(url, {
      timeout: 10000,
    });
    
    console.log('✅ Blog fetched successfully:', response.data._id);
    console.log('📖 Blog data:', response.data);
    console.log('🖼️ Banner image:', response.data.bannerImage);
    console.log('📝 Content length:', response.data.content.length, 'chars');
    
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    console.error('📍 URL attempted:', `${BASE_URL}/${id}`);
    console.error('⚠️ Response status:', error.response?.status);
    console.error('⚠️ Response data:', error.response?.data);
    
    if (error.response?.status === 404) {
      console.error('❌ Blog not found with ID:', id);
    } else if (error.response?.status === 500) {
      console.error('❌ Server error - check backend logs');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to backend - make sure it\'s running');
    }
    
    throw error;
  }
};

// ✅ Update blog post
export const updateBlog = (id, formData) => {
  try {
    console.log('✏️ Updating blog:', id);
    
    return axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      console.log('✅ Blog updated successfully');
      return response;
    }).catch(error => {
      console.error('❌ Update error:', error.response?.data || error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Update error (catch):', error.message);
    throw error;
  }
};

// ✅ Delete blog post
export const deleteBlog = (id) => {
  try {
    console.log('🗑️ Deleting blog:', id);
    
    return axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }).then(response => {
      console.log('✅ Blog deleted successfully');
      return response;
    }).catch(error => {
      console.error('❌ Delete error:', error.response?.data || error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Delete error (catch):', error.message);
    throw error;
  }
};

// ✅ Health check - verify backend is running
export const healthCheck = async () => {
  try {
    console.log('🏥 Checking backend health...');
    const response = await axios.get(BASE_URL, {
      timeout: 5000,
    });
    console.log('✅ Backend is running');
    return true;
  } catch (error) {
    console.error('❌ Backend is not responding');
    return false;
  }
};
