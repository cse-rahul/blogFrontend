import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { setToken } from "../utils/authtoken";
import { signup } from "../api/auth"; // ✅ Use auth.js function

const SignupForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📝 Signup attempt with:', { email: form.email, password: '***' });

    if (!form.email || !form.password || !form.confirmPassword) {
      console.log('❌ Missing fields');
      showError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      console.log('❌ Passwords do not match');
      showError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      console.log('❌ Password too short');
      showError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Sending signup request to backend...');
      const res = await signup({
        email: form.email,
        password: form.password,
      }); // ✅ Use auth.js

      console.log('✅ Signup response:', res.data);
      showSuccess("Account created successfully! 🎉");

      setTimeout(() => {
        console.log('👉 Redirecting to /login');
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || "Signup failed!";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Create Account
        </h2>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Email 
          </label>
          <input
            type="email" 
            name="email" 
            required
            placeholder="Enter your email..." 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={form.email} 
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Create a password (min 6 chars)..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm your password..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <Link to="/login" className="text-blue-600 ml-2 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
