import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import { uploadPost, getBlogById, updateBlog } from '../api/blog';
import { useToast } from '../context/ToastContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { removeToken } from '../utils/authtoken';
import { API_CONFIG } from '../config/api'; // ✅ Add this import

function PostBlog() {
  const [heading, setHeading] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerAlt, setBannerAlt] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [contentUpdated, setContentUpdated] = useState(false);
  const [editId, setEditId] = useState(null);
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loadedRef = useRef(false);

  // ✅ FIXED: TipTap Editor Setup with all heading levels
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // ✅ Disable default heading
      }),
      // ✅ Manually add Heading with ALL levels
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6], // ✅ All levels enabled
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContentUpdated(!contentUpdated);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-96 px-6 py-4 text-gray-800',
      },
    },
  });

  // ✅ Load blog data if editing
  useEffect(() => {
    const blogId = searchParams.get('edit');
    if (blogId && editor && !loadedRef.current) {
      console.log('🔍 Edit mode detected:', blogId);
      loadedRef.current = true;
      loadBlogForEdit(blogId);
    }
  }, [searchParams, editor]);

  // ✅ Load existing blog for editing
  const loadBlogForEdit = async (blogId) => {
    try {
      setPageLoading(true);
      console.log('📖 Loading blog for edit:', blogId);
      const data = await getBlogById(blogId);
      console.log('✅ Blog loaded:', data);

      setEditId(blogId);
      setHeading(data.heading || '');
      setMetaDescription(data.metaDescription || '');
      setMetaKeywords(data.metaKeywords || '');
      setBannerAlt(data.bannerAlt || '');
      
      // ✅ Setup editor with delay to ensure it's ready
      setTimeout(() => {
        if (editor && data.content) {
          console.log('📝 Setting editor content with delay...');
          try {
            editor.commands.clearContent(true);
            editor.commands.setContent(data.content);
            console.log('✅ Editor content loaded successfully');
          } catch (err) {
            console.error('❌ Failed to set editor content:', err);
          }
        }
      }, 500);

      // ✅ Fix image URL - Use API_CONFIG instead of localhost
      if (data.bannerImage) {
        const fullUrl = API_CONFIG.getImageUrl(data.bannerImage);  // ✅ FIXED
        console.log('✅ Full image URL:', fullUrl);
        setImagePreview(fullUrl);
      }

      showSuccess('Blog loaded for editing');
      setPageLoading(false);
    } catch (error) {
      console.error('❌ Error loading blog:', error);
      showError('Failed to load blog for editing');
      setPageLoading(false);
    }
  };

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

  // ✅ Calculate reading time
  const calculateReadingTime = (html) => {
    if (!html) return 1;
    const text = html.replace(/<[^>]*>/g, '');
    const cleaned = text.trim().replace(/\s+/g, ' ');
    const words = cleaned.split(' ').filter(word => word.length > 0);
    return Math.max(1, Math.ceil(words / 200));
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

  // ✅ Word count function
  const getWordCount = (html) => {
    if (!html || html === '<p></p>' || html === '') {
      return 0;
    }
    let text = html.replace(/<[^>]*>/g, '');
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    text = text.trim().replace(/\s+/g, ' ');
    if (!text) return 0;
    const words = text.split(' ').filter(word => word.length > 0);
    return words.length;
  };

  // ✅ SEO Validation
  const validateForm = () => {
    if (!heading.trim()) {
      showWarning('Please enter a blog title');
      return false;
    }

    if (heading.length < 30) {
      showWarning('Title should be at least 30 characters');
      return false;
    }

    if (heading.length > 60) {
      showWarning('Title should be max 60 characters');
      return false;
    }

    if (!metaDescription.trim()) {
      showWarning('Please enter a meta description');
      return false;
    }

    if (metaDescription.length < 120) {
      showWarning('Meta description should be at least 120 characters');
      return false;
    }

    if (metaDescription.length > 160) {
      showWarning('Meta description should be max 160 characters');
      return false;
    }

    if (!editor?.getHTML()) {
      showWarning('Please write blog content');
      return false;
    }

    const contentWordCount = getWordCount(editor.getHTML());
    if (contentWordCount < 300) {
      showWarning(
        `Content should be at least 300 words (currently ${contentWordCount} words)`
      );
      return false;
    }

    if (!editId && !bannerImage) {
      showWarning('Please upload a banner image');
      return false;
    }

    if (!bannerAlt.trim()) {
      showWarning('Please enter alt text for banner image');
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
    formData.append('metaDescription', metaDescription.trim());
    formData.append('metaKeywords', metaKeywords.trim());
    formData.append('bannerAlt', bannerAlt.trim());
    formData.append('content', editor.getHTML());
    formData.append('readingTime', calculateReadingTime(editor.getHTML()));

    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }

    try {
      let response;
      
      if (editId) {
        console.log('✏️ Updating blog:', editId);
        response = await updateBlog(editId, formData);
        showSuccess('Blog updated successfully! 🎉');
      } else {
        console.log('📤 Creating new blog');
        response = await uploadPost(formData);
        showSuccess('Blog posted successfully! 🎉');
      }

      setTimeout(() => {
        const blogId = response.data._id || editId;
        window.open(`/blog/${blogId}`, '_blank');
        navigate('/blogs');
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to save blog. Please try again.';
      showError(errorMessage);
      console.error('Error saving blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (heading || editor?.getHTML() !== '' || bannerImage) {
      const confirmed = window.confirm('Are you sure? All changes will be lost.');
      if (confirmed) {
        navigate('/blogs');
      }
    } else {
      navigate('/blogs');
    }
  };

  if (!editor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-semibold">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white font-semibold">Loading blog...</p>
        </div>
      </div>
    );
  }

  const editorContent = editor.getHTML();
  const wordCount = getWordCount(editorContent);
  const readingTime = calculateReadingTime(editorContent);
  const isTitleValid = heading.length >= 30 && heading.length <= 60;
  const isMetaValid = metaDescription.length >= 120 && metaDescription.length <= 160;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* ✅ Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📝</div>
            <h1 className="text-2xl font-bold text-white">
              {editId ? '✏️ Edit Blog' : '✨ Create Blog'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/blogs"
              className="text-gray-200 hover:text-white font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            >
              📚 View Blogs
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg"
            >
              Logout 👋
            </button>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8">
              <h2 className="text-4xl font-bold text-white mb-2">
                {editId ? '✏️ Edit Your Blog' : '✨ Create SEO-Optimized Blog'}
              </h2>
              <p className="text-blue-100">
                {editId ? 'Update your blog post' : 'Publish content that ranks on Google 🚀'}
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. Blog Title */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-lg font-bold text-gray-900">
                      🎯 Blog Title {isTitleValid ? '✅' : ''}
                    </label>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      isTitleValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {heading.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    placeholder="Enter SEO-friendly title (30-60 chars)..."
                    maxLength="60"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2">💡 Optimal: 30-60 characters. Include your main keyword.</p>
                </div>

                {/* 2. Meta Description */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-lg font-bold text-gray-900">
                      🔍 Meta Description {isMetaValid ? '✅' : ''}
                    </label>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      isMetaValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="This appears in Google search results (120-160 chars)..."
                    maxLength="160"
                    rows="2"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                  />
                  <p className="text-sm text-gray-600 mt-2">💡 Users see this in search results. Make it compelling!</p>
                </div>

                {/* 3. Keywords */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">
                    🏷️ Keywords
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="e.g., react, javascript, web development (comma-separated)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <p className="text-sm text-gray-600 mt-2">💡 Use 5-10 relevant keywords separated by commas.</p>
                </div>

                {/* 4. Banner Image */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">
                    🖼️ Banner Image {editId && !bannerImage ? '(Keep existing)' : ''}
                  </label>
                  <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-3 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-all bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="space-y-4 text-center">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-64 w-auto rounded-lg object-cover shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setBannerImage(null);
                              setImagePreview(null);
                            }}
                            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="text-gray-700 font-semibold">Drag and drop your image</div>
                          <label className="relative cursor-pointer">
                            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
                              Choose Image
                            </span>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              className="sr-only"
                            />
                          </label>
                          <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP up to 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Banner Alt Text */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">
                    ♿ Banner Alt Text
                  </label>
                  <input
                    type="text"
                    value={bannerAlt}
                    onChange={(e) => setBannerAlt(e.target.value)}
                    placeholder="Describe the image for accessibility and SEO..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                  <p className="text-sm text-gray-600 mt-2">💡 Example: 'A laptop showing React code on a desk'</p>
                </div>

                {/* 6. Editor Toolbar */}
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    ✍️ Blog Content {wordCount >= 300 ? '✅' : ''}
                  </label>

                  {/* Toolbar */}
                  <div className="mb-2 bg-gray-100 p-3 rounded-t-lg border-2 border-b-0 border-gray-300 flex flex-wrap gap-2">
                    {/* Headings */}
                    <div className="flex gap-1 border-r pr-2">
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => {
                            console.log('🎯 Setting H' + level);
                            editor.chain().focus().toggleHeading({ level }).run();
                          }}
                          className={`px-3 py-1 rounded font-semibold text-sm transition-all ${
                            editor.isActive('heading', { level })
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-200'
                          }`}
                          title={`Heading ${level}`}
                        >
                          H{level}
                        </button>
                      ))}
                    </div>

                    {/* Text Formatting */}
                    <div className="flex gap-1 border-r pr-2">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-3 py-1 rounded font-bold transition-all ${
                          editor.isActive('bold')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-3 py-1 rounded italic transition-all ${
                          editor.isActive('italic')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`px-3 py-1 rounded line-through transition-all ${
                          editor.isActive('strike')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Strikethrough"
                      >
                        S
                      </button>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-3 py-1 rounded transition-all ${
                          editor.isActive('bulletList')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-3 py-1 rounded transition-all ${
                          editor.isActive('orderedList')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Ordered List"
                      >
                        1. List
                      </button>
                    </div>
                  </div>

                  {/* Editor */}
                  <div className="border-2 border-gray-300 rounded-b-lg bg-white overflow-hidden">
                    <EditorContent 
                      editor={editor}
                      className="tiptap-editor"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-600">
                      💡 Use H1 for main title, H2-H3 for sections. Minimum 300 words for good SEO.
                    </p>
                    <div className="flex gap-3 text-sm font-semibold">
                      <span className={`${wordCount >= 300 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} px-3 py-1 rounded-full`}>
                        📝 {wordCount} words
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                        ⏱️ {readingTime} min read
                      </span>
                    </div>
                  </div>
                </div>

                {/* SEO Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">💡 SEO Checklist</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✅ Title: {isTitleValid ? '✅ Perfect!' : heading.length < 30 ? '❌ Too short (min 30)' : '❌ Too long (max 60)'}</li>
                    <li>✅ Meta: {isMetaValid ? '✅ Perfect!' : metaDescription.length < 120 ? '❌ Too short (min 120)' : '❌ Too long (max 160)'}</li>
                    <li>✅ Content: {wordCount >= 300 ? `✅ Great (${wordCount} words)!` : `❌ Need ${300 - wordCount} more words`}</li>
                    <li>✅ Keywords: {metaKeywords ? '✅ Added' : '❌ Add keywords'}</li>
                    <li>✅ Image: {imagePreview ? '✅ Added' : '❌ Add image'}</li>
                    <li>✅ Alt Text: {bannerAlt ? '✅ Added' : '❌ Add alt text'}</li>
                    <li>✅ Reading Time: {readingTime} min</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-300">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editId ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        {editId ? '💾 Save Changes' : '🚀 Publish Blog'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-8 py-4 border-2 border-gray-400 hover:border-gray-600 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* TipTap Styles */}
      <style jsx>{`
        .tiptap-editor {
          padding: 16px 24px;
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }
        .tiptap-editor h1 {
          font-size: 32px;
          font-weight: bold;
          margin: 20px 0 10px;
          color: #1f2937;
        }
        .tiptap-editor h2 {
          font-size: 24px;
          font-weight: bold;
          margin: 15px 0 8px;
          color: #374151;
        }
        .tiptap-editor h3 {
          font-size: 20px;
          font-weight: bold;
          margin: 12px 0 6px;
          color: #1f2937;
        }
        .tiptap-editor h4 {
          font-size: 18px;
          font-weight: bold;
          margin: 10px 0 5px;
          color: #1f2937;
        }
        .tiptap-editor h5 {
          font-size: 16px;
          font-weight: bold;
          margin: 8px 0 4px;
          color: #1f2937;
        }
        .tiptap-editor h6 {
          font-size: 14px;
          font-weight: bold;
          margin: 6px 0 3px;
          color: #1f2937;
        }
        .tiptap-editor p {
          margin: 10px 0;
        }
        .tiptap-editor strong {
          font-weight: bold;
        }
        .tiptap-editor em {
          font-style: italic;
        }
        .tiptap-editor ul,
        .tiptap-editor ol {
          margin-left: 20px;
          margin: 10px 0;
        }
        .tiptap-editor li {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
}

export default PostBlog;
