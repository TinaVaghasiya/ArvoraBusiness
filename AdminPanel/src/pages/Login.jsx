import { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
// import image1 from "../assets/image1.png";
import loginimage from "../assets/loginimage.jpeg";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const navigator = useNavigate();
  const login = () => {
    navigator("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-600 relative flex flex-col items-center overflow-hidden px-4">
      {/* <img src={image1} alt="illustration" className="absolute inset-0 w-full h-full object-cover" /> */}

      {/* Login Card */}

      <div className="relative z-10 w-auto md:w-auto max-w-5xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden justify-center mt-28 md:m-auto p-auto md:min-h-auto">

        {/* Left side */}

        <div className="w-full mt-2 md:w-1/2 p-10 md:p-16 h-auto md:min-h-[430px]">

          {/* Tabs */}

          <div className="flex gap-6 md:gap-10 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`pb-1 ${activeTab === "login" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`pb-1 ${activeTab === "signup"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Switch */}

          {activeTab === "login" ? (
            <>
              <div className="relative mb-4">
                <FiMail className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Email or phone number"
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 bg-gray-50 outline-none text-black"
                />
              </div>

              <div className="relative mb-2">
                <FiLock className="absolute left-4 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 bg-gray-50 outline-none text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <p className="text-xs ml-2 text-gray-500 mt-4 cursor-pointer hover:text-gray-700 transition">
                Forgot your password?
              </p>

              <button onClick={login} className="mt-6 w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition shadow-md">
                Login
              </button>
            </>
          ) : (
            <>
              <div className="relative mb-4">
                <FiUser className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 bg-gray-50 outline-none text-black"
                />
              </div>

              <div className="relative mb-4">
                <FiMail className="absolute left-4 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 bg-gray-50 outline-none text-black"
                />
              </div>

              <div className="relative mb-4">
                <FiLock className="absolute left-4 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 bg-gray-50 outline-none text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <button onClick={login} className="mt-6 w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition shadow-md">
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Right side */}

        <div className="hidden md:w-1/2  md:flex">
          <img src={loginimage} alt="illustration" className=" md:min-w-[300px] " />
          {/* <div className="text-black bottom-4 left-4 font-bold text-xl">Illustration</div> */}
        </div>

      </div>

    </div>
  );
}