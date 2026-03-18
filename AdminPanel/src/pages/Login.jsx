import { useEffect, useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import loginimage from "../assets/loginimage.jpeg";
import { useNavigate } from "react-router-dom";
import { adminAuthAPI } from "../services/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigator = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigator("/dashboard");
    }
  }, [navigator]);
  const login = async () => {
  try {
    const response = await adminAuthAPI.login(email, password);
    const token = response.data.token;
    const username = response.data.admin?.username || "Admin";
    const role = response.data.admin?.role || "user_manager";
    
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUsername", username);
    localStorage.setItem("adminRole", role);

    navigator("/dashboard");
  } catch (error) {
    alert("Login failed");
    console.error(error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 relative flex md:items-center md:justify-center items-start overflow-hidden px-4 py-4">
      <div className="relative z-10 w-full max-w-4xl mt-24 md:mt-0 bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-2">
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white ">
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome</h2>
            <p className="text-gray-600 text-xs md:text-xs">Sign in to access your admin dashboard</p>
          </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 md:left-4 top-3 text-blue-500 text-sm md:text-base" />
                    <input
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl py-2 md:py-2 pl-10 md:pl-11 pr-4 bg-white focus:bg-blue-50/30 outline-none text-black text-sm md:text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 md:left-4 top-3 text-blue-500 text-sm md:text-base" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl py-2 md:py-2 pl-10 md:pl-11 pr-4 bg-white focus:bg-blue-50/30 outline-none text-black text-sm md:text-sm transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 md:right-4 top-3.5 md:top-3.5 text-blue-500 hover:text-blue-600 transition text-base md:text-base"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <p onClick={() => navigator("/forgot-password")} className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer hover:underline transition font-medium">
                  Forgot password?
                </p>
              </div>

              <button
                type="button"
                onClick={login}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.01] text-sm md:text-base"
              >
                Sign In
              </button>
        </div>
        <div className="hidden md:flex md:w-1/2">
          <img
            src={loginimage}
            alt="illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}