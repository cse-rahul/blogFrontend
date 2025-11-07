import axios from "axios";
import { getToken } from "../utils/authtoken";
import { API_CONFIG } from "../config/api";

const BASE_URL = API_CONFIG.BLOGS_URL;

console.log('📚 Blog API Base URL:', BASE_URL);

export const getAllBlogs = async () => {
  try {
    console.log('📚 Fetching all blogs from:', BASE_URL);
    const response = await axios.get(BASE_URL, { timeout: 30000 });
    console.log('✅ Blogs fetched successfully:', response.data.length, 'blogs');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const url = `${BASE_URL}/${id}`;
    console.log('🔍 Fetching blog from:', url);
    const response = await axios.get(url, { timeout: 30000 });
    console.log('✅ Blog fetched successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    throw error;
  }
};

export const uploadPost = (formData) => {
  try {
    console.log('📤 Uploading blog post to:', BASE_URL);
    return axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000
    }).then(response => {
      console.log('✅ Blog uploaded successfully');
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

export const updateBlog = (id, formData) => {
  try {
    const url = `${BASE_URL}/${id}`;
    console.log('✏️ Updating blog:', url);
    return axios.put(url, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000
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

export const deleteBlog = (id) => {
  try {
    const url = `${BASE_URL}/${id}`;
    console.log('🗑️ Deleting blog:', url);
    return axios.delete(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
      timeout: 30000
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
