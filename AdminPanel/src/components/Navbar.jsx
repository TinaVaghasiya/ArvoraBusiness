import { FaMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };
  
  return (
    <div className={`shadow px-6 py-4 flex justify-between items-center top-0 left-64 right-0 z-50 fixed transition-colors ${isDarkMode ? "bg-gray-800 text-white" : "bg-[#144a86] text-white"}`}>
      <div>
        <h2 className="text-xl font-semibold">{getGreeting()}, Admin!</h2>
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 border rounded-full transition-colors ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-700'}`}>
          {isDarkMode ? (
            <IoSunnySharp size={16} className="text-yellow-400 cursor-pointer" />
          ) : (
            <FaMoon size={14} className="text-slate-100 cursor-pointer " />
          )}
        </button>
        
        <div className="flex items-center justify-center">
          <FaCircleUser size={28} className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-100'}`} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
