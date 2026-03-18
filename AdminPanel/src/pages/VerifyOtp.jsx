import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiShield, FiArrowLeft } from "react-icons/fi";
import { adminAuthAPI } from "../services/api";

export default function VerifyOTP() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

   useEffect(() => {
  let interval;
  
  if (timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  
  return () => {
    if (interval) clearInterval(interval);
  };
}, [timer]);
    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length; i++) {
            if (!isNaN(pastedData[i])) {
                newOtp[i] = pastedData[i];
            }
        }

        setOtp(newOtp);
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex].focus();
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        const otpValue = otp.join("");
        if (otpValue.length !== 6) {
            setError("Please enter complete 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await adminAuthAPI.verifyOTP(email, otpValue);

            if (response.data.success) {
                navigate("/reset-password", { state: { email, otp: otpValue } });
            } else {
                setError(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            setError(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError("");

        try {
            const response = await adminAuthAPI.sendOTP(email);

            if (response.data.success) {
                setOtp(["", "", "", "", "", ""]);
                setTimer(60);
                inputRefs.current[0].focus();
                alert("OTP resent successfully!");
            } else {
                setError(response.data.message || "Failed to resend OTP");
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
        } finally {
            setResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 flex md:items-center md:justify-center px-12">
            <div className="md:w-auto w-auto max-w-md md:h-auto p-4 min-h-auto  ">
                <div className="bg-white rounded-2xl shadow-xl md:p-8 p-6 top-24 md:top-0 relative">
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="absolute top-6 left-6 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <FiArrowLeft className="md:w-5 w-4 h-4 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
                    </button>
                    <div className="text-center mb-8">
                        <div className="md:w-16 w-12 h-12 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiShield className="md:w-8 w-6 h-6 md:h-8 text-blue-600" />
                        </div>
                        <h1 className="md:text-2xl text-lg font-bold text-gray-900 mb-2">Verify OTP</h1>
                        <p className="text-gray-600 md:text-sm text-xs">
                            Enter the 6-digit OTP sent to
                        </p>
                        <p className="text-blue-600 font-medium text-xs md:text-sm mt-1">{email}</p>
                    </div>

                    
                    <form onSubmit={handleVerifyOTP}>
                        <div className="mb-2">
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={`w-8 h-8 md:w-12 md:h-12 text-center text-sm md:text-xl font-semibold border ${error ? "border-red-500" : "border-gray-400"
                                            } rounded-lg focus:outline-none bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
                            )}
                        </div>

                        <div className="mb-4 flex justify-end">
                        {timer > 0 ? (
                            <p className="md:text-sm text-xs text-gray-600">
                                Resend OTP in{" "}
                                <span className="font-semibold text-blue-600">{formatTime(timer)}</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResendOTP}
                                disabled={resending}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:text-blue-400 disabled:hover:text-blue-400"
                            >
                                {resending ? "Resending.." : "Resend OTP"}
                            </button>
                        )}
                    </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium md:py-3 py-1 rounded-lg transition-colors shadow-md hover:shadow-lg"
                        >
                            Verify OTP
                        </button>
                    </form>

                    {/* <div className="mt-2 md:mt-4 text-center">
                        <p className="text-gray-600 text-xs md:text-sm">
                            Didn't receive the code?{" "}
                            <button
                                onClick={handleResendOTP}
                                disabled={resending}
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}