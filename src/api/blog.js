import axios from "axios";
import { getToken } from "../utils/authtoken";

// ✅ HARDCODED Catalyst Backend URL
const BASE_URL = "https://backend-60056722056.development.catalystserverless.in/server/backend_function/api/blogs";

// console.log('📍 Blog API URL:', BASE_URL);

export const getAllBlogs = async () => {
  try {
    console.log('📚 Fetching all blogs from:', BASE_URL);
    const response = await axios.get(BASE_URL, { timeout: 10000 });
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
    const response = await axios.get(url, { timeout: 10000 });
    console.log('✅ Blog fetched successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    throw error;
  }
};

export const uploadPost = (formData) => {
  try {
    console.log('📤 Uploading blog post...');
    return axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      console.log('✅ Blog uploaded successfully');
      return response;
    }).catch(error => {
      console.error('❌ Upload error:', error.response?.data || error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    throw error;
  }
};

export const updateBlog = (id, formData) => {
  try {
    return axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(response => {
      console.log('✅ Blog updated successfully');
      return response;
    }).catch(error => {
      console.error('❌ Update error:', error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Update error:', error.message);
    throw error;
  }
};

export const deleteBlog = (id) => {
  try {
    return axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(response => {
      console.log('✅ Blog deleted successfully');
      return response;
    }).catch(error => {
      console.error('❌ Delete error:', error.message);
      throw error;
    });
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    throw error;
  }
};
