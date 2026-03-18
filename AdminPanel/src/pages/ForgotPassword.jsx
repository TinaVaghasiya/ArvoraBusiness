import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import { adminAuthAPI } from "../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading]= useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await adminAuthAPI.sendOTP(email);
      
      if (response.data.success) {
        navigate("/verify-otp", { state: { email } });
      } else {
        setError(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex md:items-center md:justify-center px-6 ">
            <div className="md:w-auto w-auto max-w-md md:h-auto p-4 min-h-auto mt-28 md:mt-0">
                <div className="bg-white rounded-2xl shadow-xl md:p-8 p-10 relative">
                    <button
                        onClick={() => navigate("/")}
                        className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <FiArrowLeft className="md:w-5 w-4 h-4 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
                    </button>
                    <div className="text-center mb-8 ">
                        <div className="md:w-16 w-12 h-12 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMail className="md:w-8 w-6 h-6 md:h-8 text-blue-600" />
                        </div>
                        <h1 className="md:text-2xl text-lg font-bold text-gray-900 mb-2">Forgot Password</h1>
                        <p className="text-gray-600 md:text-sm text-xs">
                            Enter your email address and we'll send you an OTP to reset your password
                        </p>
                    </div>

                    <form onSubmit={handleSendOTP}>
                        <div className="mb-6">
                            <div className="relative">
                                <FiMail className="absolute items-center justify-center left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter your email"

                                    className={`md:w-full w-full pl-11 md:py-3 p-2 border ${error ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none text-black text-sm md:text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                />
                            </div>
                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium  md:py-3 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}