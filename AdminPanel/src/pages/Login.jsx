import { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import loginimage from "../assets/loginimage.jpeg";
import { useNavigate } from "react-router-dom";
import { adminAuthAPI } from "../services/api";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigator = useNavigate();
  const login = async () => {
    try {
      const response = await adminAuthAPI.login(email, password);
      const token = response.data.token;
      localStorage.setItem("adminToken", token);
      navigator("/dashboard");
    } catch (error) {
      alert("Login failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 relative flex items-center justify-center overflow-hidden px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-3 font-semibold transition-all ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`pb-3 font-semibold transition-all ${activeTab === "signup" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {activeTab === "login" ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 bg-gray-50 outline-none text-gray-900 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-12 bg-gray-50 outline-none text-gray-900 focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
              </div>

              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 bg-gray-50 outline-none text-gray-900 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 bg-gray-50 outline-none text-gray-900 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full border-2 border-gray-200 rounded-xl py-3 pl-12 pr-12 bg-gray-50 outline-none text-gray-900 focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Right side - Image */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10 text-center text-white">
            <img
              src={loginimage}
              alt="Admin Illustration"
              className="w-full max-w-md rounded-2xl shadow-2xl mb-6"
            />
            <h3 className="text-2xl font-bold mb-3">Welcome Back!</h3>
            <p className="text-blue-100">Manage your business with powerful admin tools</p>
          </div>
        </div>
      </div>
    </div>
  );
}
