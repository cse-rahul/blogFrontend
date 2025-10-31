import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../api/blog';
import { useToast } from '../context/ToastContext';
import { getToken } from '../utils/authtoken';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  // ✅ Check if user is logged in
  const isAdmin = !!getToken();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('📖 Fetching blog with ID:', id);
        const data = await getBlogById(id);
        console.log('✅ Blog loaded:', data);
        setBlog(data);
      } catch (error) {
        console.error('❌ Error fetching blog:', error);
        showError('Failed to load blog');
        setTimeout(() => navigate('/blogs'), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, navigate, showError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-semibold">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Blog not found</p>
          <button
            onClick={() => navigate('/blogs')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  // ✅ FIX: Generate banner image URL properly
  const getBannerImageUrl = () => {
    if (!blog.bannerImage) return null;
    
    console.log('🖼️ Raw banner image:', blog.bannerImage);
    
    if (blog.bannerImage.startsWith('http')) {
      return blog.bannerImage;
    }
    
    let imagePath = blog.bannerImage.replace(/\\/g, '/');
    
    if (!imagePath.startsWith('/')) {
      imagePath = '/' + imagePath;
    }
    
    const fullUrl = `http://localhost:5000${imagePath}`;
    console.log('✅ Full banner URL:', fullUrl);
    
    return fullUrl;
  };

  const bannerImageUrl = getBannerImageUrl();

  // ✅ Handle Delete Blog
const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this blog?')) {
    try {
      console.log('🗑️ Delete initiated');
      console.log('Blog ID:', id);
      console.log('Token:', getToken() ? 'Present' : 'Missing');
      
      await deleteBlog(id);
      showSuccess('Blog deleted!');
      setTimeout(() => navigate('/blogs'), 1500);
    } catch (error) {
      console.error('❌ Full error:', error);
      console.error('Response:', error.response);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      showError('Failed to delete');
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/blogs')}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            ← Back to Blogs
          </button>
          
          {/* ✅ Show Admin Actions Only if Logged In */}
          {isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/admin/post?edit=${id}`)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* ✅ Full-width Banner Image */}
        {bannerImageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg bg-gray-200">
            <img
              src={bannerImageUrl}
              alt={blog.bannerAlt || blog.heading}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                console.error('❌ Image failed to load:', bannerImageUrl);
                e.target.style.display = 'none';
                const errorDiv = document.createElement('div');
                errorDiv.className = 'w-full h-96 bg-gray-300 flex items-center justify-center text-gray-600 text-center p-4';
                errorDiv.innerHTML = `
                  <div>
                    <p style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">📷 Image not available</p>
                  </div>
                `;
                e.target.parentElement.appendChild(errorDiv);
              }}
              onLoad={() => {
                console.log('✅ Image loaded successfully:', bannerImageUrl);
              }}
            />
          </div>
        )}

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {blog.heading}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm border-b border-gray-200 pb-4">
            <span>📅 {new Date(blog.createdAt).toLocaleDateString('en-IN')}</span>
            <span>⏱️ {blog.readingTime || 5} min read</span>
            <span>📝 {blog.content ? Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length) : 0} words</span>
          </div>
        </div>

        {/* ✅ Render HTML content properly */}
        <div className="prose prose-lg max-w-none mb-12">
          <div 
            className="text-gray-800 leading-relaxed space-y-4 blog-content"
            dangerouslySetInnerHTML={{ 
              __html: blog.content || '<p>No content available</p>'
            }}
          />
        </div>

        {/* Meta Info */}
        {blog.metaDescription && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8">
            <h3 className="font-bold text-gray-900 mb-2">📋 About this post</h3>
            <p className="text-gray-700 text-sm">{blog.metaDescription}</p>
            {blog.metaKeywords && (
              <div className="mt-3 flex flex-wrap gap-2">
                {blog.metaKeywords.split(',').map((keyword, index) => (
                  <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => navigate('/blogs')}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition-colors"
          >
            ← Read More Blogs
          </button>
          
          {/* ✅ Show "Write Blog" only for Admin */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/post')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              ✍️ Write Blog
            </button>
          )}
        </div>
      </article>

      {/* Blog Content Styling */}
      <style>{`
        .blog-content {
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
        }
        .blog-content h1 {
          font-size: 32px;
          font-weight: bold;
          margin: 30px 0 20px;
          color: #1f2937;
        }
        .blog-content h2 {
          font-size: 24px;
          font-weight: bold;
          margin: 25px 0 15px;
          color: #374151;
        }
        .blog-content h3 {
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0 12px;
          color: #4b5563;
        }
        .blog-content p {
          margin: 15px 0;
        }
        .blog-content strong {
          font-weight: 700;
        }
        .blog-content em {
          font-style: italic;
        }
        .blog-content ul {
          list-style-type: disc;
          margin-left: 30px;
          margin: 20px 0;
        }
        .blog-content ol {
          list-style-type: decimal;
          margin-left: 30px;
          margin: 20px 0;
        }
        .blog-content li {
          margin: 10px 0;
        }
        .blog-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .blog-content img {
          max-width: 100%;
          margin: 20px 0;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default BlogDetail;
