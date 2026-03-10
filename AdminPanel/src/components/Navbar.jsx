import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { LuMoon } from "react-icons/lu";
import { IoSunnySharp } from "react-icons/io5";
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const [search, setSearch] = useState("");
  const { isDarkMode, setIsDarkMode } = useTheme();
  
  return (
    <div className={`shadow px-6 py-4 flex justify-between items-center transition-colors ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
     <div className="relative">
        <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 left-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} size={16}/>
        <input
          type="text"
          placeholder="Search..."
          className={`pl-10 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 w-96 ${isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-slate-200 text-black"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button onClick={() => setSearch("")}
          className={`absolute top-1/2 transform -translate-y-1/2 right-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaTimes size={15} />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 border rounded-full transition-colors ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}>
          {isDarkMode ? (
            <IoSunnySharp size={16} className="text-yellow-400 cursor-pointer" />
          ) : (
            <LuMoon size={14} className="text-gray-600 cursor-pointer" />
          )}
        </button>
        <div className="flex items-center justify-center">
          <FaCircleUser size={28} className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
