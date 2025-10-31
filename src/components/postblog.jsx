import React, { useState } from 'react';
import { uploadPost } from '../api/blog';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/authtoken';

function PostBlog() {
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();

  // ✅ Logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      removeToken();
      showSuccess('Logged out successfully! 👋');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showWarning('Image size must be less than 5MB');
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        showWarning('Only JPG, PNG, GIF, WebP formats are allowed');
        return;
      }

      setBannerImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!heading.trim()) {
      showWarning('Please enter a blog title');
      return false;
    }

    if (heading.trim().length < 5) {
      showWarning('Blog title must be at least 5 characters');
      return false;
    }

    if (!content.trim()) {
      showWarning('Please enter blog content');
      return false;
    }

    if (content.trim().length < 20) {
      showWarning('Blog content must be at least 20 characters');
      return false;
    }

    if (!bannerImage) {
      showWarning('Please upload a banner image');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('heading', heading.trim());
    formData.append('content', content.trim());
    formData.append('bannerImage', bannerImage);

    try {
      const response = await uploadPost(formData);
      const newBlogId = response.data._id;

      showSuccess('Blog posted successfully! 🎉');

      setTimeout(() => {
        window.open(`/blog/${newBlogId}`, '_blank');
        window.location.reload();
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to post blog. Please try again.';
      showError(errorMessage);
      console.error('Error posting blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (heading || content || bannerImage) {
      const confirmed = window.confirm('Are you sure? All data will be lost.');
      if (confirmed) {
        setHeading('');
        setContent('');
        setBannerImage(null);
        setImagePreview(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ✅ NEW: Navbar with Logout */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600">📝 Blog Admin</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="/blogs"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              View Blogs
            </a>
            
            {/* ✅ Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md"
            >
              Logout 👋
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ Form Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create New Blog Post
              </h2>
              <p className="text-gray-600 text-sm">
                Share your thoughts with the world
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blog Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Enter your blog title (min 5 characters)..."
                  maxLength="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {heading.length}/100 characters
                </p>
              </div>

              {/* Blog Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here (min 20 characters)..."
                  rows="12"
                  maxLength="5000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length}/5000 characters
                </p>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-64 w-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Click X to remove</p>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Post Blog
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostBlog;
