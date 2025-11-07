import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { setToken } from '../utils/authtoken';
import { login } from '../api/auth'; // ✅ Use auth.js function

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔐 Login attempt with:', { email, password: '***' });

    if (!email || !password) {
      console.log('❌ Missing email or password');
      showError('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Sending login request to backend...');
      const response = await login({ email, password }); // ✅ Use auth.js

      console.log('✅ Login response:', response.data);

      const token = response.data.token;
      setToken(token);

      showSuccess('Login successful! 🎉');

      setTimeout(() => {
        console.log('👉 Redirecting to /admin/post');
        navigate('/admin/post');
      }, 1000);

    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Login failed';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email 
            </label>
            <input
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..." 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 font-semibold hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
