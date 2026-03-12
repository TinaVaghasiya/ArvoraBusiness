import { ThemeProvider, useTheme } from './context/ThemeContext';
import React from 'react';
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
  
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <Sidebar />
        <div className="ml-64">
          <Navbar />
          <main className="p-6">
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
