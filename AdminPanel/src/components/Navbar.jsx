import { FaMoon, FaBell } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { LuMoon, LuSun } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

function Navbar({ toggleSidebar }) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className={`shadow-sm px-4 md:px-6 py-4 flex justify-between items-center fixed top-0 left-0 lg:left-64 right-0 z-20 transition-all duration-300 ${isDarkMode ? "bg-gray-900 border-b border-gray-800" : "bg-white border-b border-gray-200"}`}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`lg:hidden p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
        >
          <HiMenu size={24} className={isDarkMode ? "text-gray-300" : "text-gray-700"} />
        </button>
        <div>
          <h2 className={`text-base md:text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {getGreeting()}, Admin!
          </h2>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 md:p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-transparent hover:bg-gray-100"}`}
        >
          {isDarkMode ? (
            <LuSun size={18} className="relative z-10 hover:text-yellow-400 text-yellow-700 transition-transform duration-500 hover:rotate-180" />
          ) : (
            <LuMoon size={16} className="relative z-10 hover:text-gray-700 text-gray-500 transition-transform duration-500 hover:-rotate-12" />
          )}
        </button>

        {/* <button className={`hidden md:flex relative p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>
          <FaBell size={18} className={isDarkMode ? "text-gray-300" : "text-gray-600"} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        <div className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">A</span>
          </div>
          <span className={`hidden md:block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Admin</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
