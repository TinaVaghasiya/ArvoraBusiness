import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import { adminAuthAPI} from "../services/api";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

      useEffect(() => {
        if (!email || !otp) {
          navigate("/forgot-password");
        }
      }, [email, otp, navigate]);

    const validatePassword = () => {
        const newErrors = {};

        if (!newPassword) {
            newErrors.newPassword = "Password is required";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdatePassword = async (e) => {
  e.preventDefault();

  if (!validatePassword()) {
    return;
  }

  setLoading(true);

  try {
    console.log("Sending data:", { email, otp, newPassword }); 
    const response = await adminAuthAPI.resetPassword(email, otp, newPassword);
    
    console.log("Response:", response.data); 
    
    if (response.data.success) {
      alert("Password updated successfully!");
      navigate("/");
    } else {
      setErrors({ newPassword: response.data.message || "Failed to update password" });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    console.error("Error response:", error.response?.data);
    setErrors({ 
      newPassword: error.response?.data?.message || "Failed to update password. Please try again." 
    });
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex md:items-center md:justify-center px-6 ">
            <div className="md:w-full w-auto max-w-md md:h-auto p-4 min-h-auto mt-28 md:mt-0">
                <div className="bg-white rounded-2xl shadow-xl md:p-8 p-10 relative">
                    <div className="text-center mb-8">
                        <div className="md:w-16 w-12 h-12 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiCheckCircle className="md:w-8 w-6 h-6 md:h-8 text-blue-600" />
                        </div>
                        <h1 className="md:text-2xl text-lg font-bold text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-gray-600 md:text-sm text-xs">
                            Create a new password for your account
                        </p>
                    </div>

                    <form onSubmit={handleUpdatePassword}>
                        <div className="mb-5">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute items-center justify-center left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setErrors({ ...errors, newPassword: "" });
                                    }}
                                    placeholder="Enter new password"
                                    className={`w-full pl-11 pr-12 md:py-3 py-2 border ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none bg-white text-black text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute items-center justify-center right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
                                >
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute items-center justify-center left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrors({ ...errors, confirmPassword: "" });
                                    }}
                                    placeholder="Confirm new password"
                                    className={`w-full pl-11 pr-12 md:py-3 py-2 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        } rounded-lg focus:outline-none bg-white text-black text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute items-center justify-center right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium  md:py-3 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}