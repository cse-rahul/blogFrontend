import axios from "axios";
import { getToken } from "../utils/authtoken";

const BASE_URL = "http://localhost:5000/api/blogs";

// ✅ Upload new blog post with image using FormData
export const uploadPost = (formData) =>
  axios.post(BASE_URL, formData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

// ✅ NEW: Get all blog posts (NO AUTH needed - public)
export const getAllBlogs = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// ✅ NEW: Get single blog post by ID (NO AUTH needed - public)
export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};
