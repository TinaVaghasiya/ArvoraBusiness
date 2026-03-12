import { ThemeProvider, useTheme } from './context/ThemeContext';
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Cards from './pages/Cards';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Sidebar from './components/SideBar';

function Layout({ children }) {
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/users" element={<Layout><Users /></Layout>} />
        <Route path="/cards" element={<Layout><Cards /></Layout>} />
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
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
