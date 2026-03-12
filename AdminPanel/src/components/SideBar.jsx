import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { LiaIdCardSolid } from "react-icons/lia";
import { TbLayoutDashboard } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

function Sidebar({ isOpen, setIsOpen }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`w-64 h-screen transition-all duration-300 fixed z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${isDarkMode ? "bg-gray-900 border-r border-gray-800" : "bg-white border-r border-gray-200"} shadow-xl overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Admin Panel
              </h2>
              <p
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Management System
              </p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 pb-6">
          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${isActive ? (isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-700/50" : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-800/50") : isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100 hover:shadow-lg"}`
            }
          >
            <TbLayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          <NavLink
            to="/users"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${isActive ? (isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-700/50" : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-800/50") : isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100 hover:shadow-lg"}`
            }
          >
            <FaUserGroup size={20} />
            <span className="font-medium">Users</span>
          </NavLink>

          <NavLink
            to="/cards"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${isActive ? (isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-700/50" : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-800/50") : isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100 hover:shadow-lg"}`
            }
          >
            <LiaIdCardSolid size={20} />
            <span className="font-medium">Cards</span>
          </NavLink>

          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <div className="flex items-center gap-3">
                <IoSettingsOutline size={20} />
                <span className="font-medium">Settings</span>
              </div>
              {settingsOpen ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>

            {settingsOpen && (
              <div className="ml-4 mt-2 space-y-1">
                <NavLink
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200  ${isActive ? (isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-700/50" : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-800/50") : isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100 hover:shadow-lg"}`
                  }
                >
                  <MdAdminPanelSettings size={18} />
                  <span className="text-sm font-medium">Admin</span>
                </NavLink>
              </div>
            )}
          </div>

          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t backdrop-blur-sm ${isDarkMode ? "border-gray-800/50" : "border-gray-200/50" }`}>
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 hover:shadow-xl ${
                isDarkMode
                  ? "text-red-300 hover:bg-red-900/30 hover:shadow-red-500/20"
                  : "text-red-700 hover:bg-orange-50 hover:shadow-red-500/20 hover:shadow-lg"
              }`}
            >
              <div className="p-2 rounded-lg bg-transparent group-hover:bg-red-400/10">
              <CgLogOut size={20} />
              </div>
              <span className="font-medium">Logout</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
