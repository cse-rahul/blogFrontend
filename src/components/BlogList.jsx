import React, { useState, useEffect } from 'react';
import { getAllBlogs } from '../api/blog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { getToken } from '../utils/authtoken';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError } = useToast();

  // ✅ Check if user is logged in
  const isAdmin = !!getToken();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      console.log('📚 Fetching all blogs...');
      const data = await getAllBlogs();
      console.log('✅ Blogs fetched:', data.length);
      setBlogs(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching blogs:', error);
      showError('Failed to load blogs');
      setLoading(false);
    }
  };

  const handleBlogClick = (id) => {
    console.log('🔍 Navigating to blog:', id);
    navigate(`/blog/${id}`);
  };

  // ✅ FIX: Strip HTML tags from content
  const getPreviewText = (content) => {
    if (!content) return 'No content available';
    
    // Remove all HTML tags
    let text = content.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Remove extra whitespace
    text = text.trim().replace(/\s+/g, ' ');
    
    // Get first 150 characters
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  // ✅ FIX: Generate correct image URL
  const getBannerImageUrl = (bannerImage) => {
    if (!bannerImage) return 'https://via.placeholder.com/400x300?text=No+Image';
    
    // If already a full URL
    if (bannerImage.startsWith('http')) {
      return bannerImage;
    }
    
    // Convert backslashes to forward slashes
    let imagePath = bannerImage.replace(/\\/g, '/');
    
    // Ensure it starts with /
    if (!imagePath.startsWith('/')) {
      imagePath = '/' + imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-600 font-semibold">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">📚 Blog Hub</h1>
          
          {/* ✅ Show Write Blog Button Only if Logged In (Admin) */}
          {isAdmin ? (
            <button
              onClick={() => navigate('/admin/post')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              ✍️ Write Blog
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all"
            >
              🔐 Login to Post
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Blog Posts</h2>
          <p className="text-gray-600">Discover amazing stories from our creators</p>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg mb-4">No blogs found. Create your first blog post!</p>
            {isAdmin ? (
              <button
                onClick={() => navigate('/admin/post')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all inline-block"
              >
                ✍️ Write First Blog
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all inline-block"
              >
                🔐 Login to Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                onClick={() => handleBlogClick(blog._id)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              >
                {/* ✅ FIXED: Image Container with object-contain */}
                <div className="h-56 overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img
                    src={getBannerImageUrl(blog.bannerImage)}
                    alt={blog.heading}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('❌ Image failed:', getBannerImageUrl(blog.bannerImage));
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded:', blog.heading);
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.heading}
                  </h2>

                  {/* Preview - ✅ FIXED: No HTML visible */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {getPreviewText(blog.content)}
                  </p>

                  {/* Meta & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      📅 {new Date(blog.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      ⏱️ {blog.readingTime || 5} min
                    </span>
                    <button className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
