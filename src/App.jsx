import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/login";
import SignupForm from "./components/signUp";
import PostBlog from "./components/postblog";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";
import { ToastProvider } from "./context/ToastContext";
import { getToken } from "./utils/authtoken";

// ✅ PROTECTED ROUTE - Only logged-in users can access
const PrivateRoute = ({ children }) => {
  const token = getToken();
  
  console.log('🔒 PrivateRoute check:');
  console.log('   Token exists:', token ? '✅ Yes' : '❌ No');
  
  if (!token) {
    console.log('   👉 Redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('   👉 Access granted');
  return children;
};

function App() {
  useEffect(() => {
    console.log('🎯 App initialized');
  }, []);

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/blogs" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          
          {/* ✅ PROTECTED ROUTE */}
          <Route
            path="/admin/post"
            element={
              <PrivateRoute>
                <PostBlog />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/blogs" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
