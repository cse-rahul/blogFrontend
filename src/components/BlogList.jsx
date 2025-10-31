import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../api/blog';
import { useNavigate } from 'react-router-dom';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getAllBlogs();
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Latest Blog Posts
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            onClick={() => handleBlogClick(blog._id)}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
          >
            <div className="h-56 overflow-hidden">
              <img
                src={`http://localhost:5000/${blog.bannerImage}`}
                alt={blog.heading}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                {blog.heading}
              </h2>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {truncateContent(blog.content)}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <button className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          No blogs found. Create your first blog post!
        </div>
      )}
    </div>
  );
}

export default BlogList;
