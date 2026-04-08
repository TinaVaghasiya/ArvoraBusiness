import { ThemeProvider, useTheme } from './context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Cards from './pages/Cards';
import Admin from './pages/Admin';
import Notifications from './pages/Notifications';
import Navbar from './components/Navbar';
import Sidebar from './components/SideBar';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import { API_BASE_URL } from './services/api';

function Layout({ children }) {
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="lg:ml-64 transition-all duration-300">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="pt-20 px-4 md:px-6 pb-8">
            {children}
          </main>
        </div>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token || token === 'null' || token === 'undefined') {
        setIsAuthenticated(false);
        return;
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE_URL}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalid - clear and redirect
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('isLoggedIn');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
        <Route path="/cards" element={<ProtectedRoute><Layout><Cards /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Layout><Admin /></Layout></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
