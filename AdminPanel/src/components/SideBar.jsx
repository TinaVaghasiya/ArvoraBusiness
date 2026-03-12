import { useState } from 'react';
import { NavLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { LiaIdCardSolid } from "react-icons/lia";
import { TbLayoutDashboard } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`w-64 h-screen p-4 transition-colors fixed ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-[#144a86] text-white'}`}>
      <h2 className="text-2xl font-bold mb-3 mt-4 ml-2">Admin Panel</h2>
      <hr className={`mb-6 border-1 shadow-xl transition-colors duration-100 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
      <ul className="space-y-6">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 hover:text-white hover:underline hover:font-semibold transition-colors ${isActive ? "text-white border-b-2 font-semibold border-spacing-1 rounded-md p-2 bg-slate-500 " : ""}`
            }
          >
            <TbLayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-4 hover:text-white hover:underline hover:font-semibold transition-colors ${isActive ? "text-white border-b-2 font-semibold border-spacing-1 rounded-md p-2 bg-slate-500 " : ""}`
            }
          >
            <FaUserGroup size={20} />
            Users
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cards"
            className={({ isActive }) =>
              `flex items-center gap-4 hover:text-white hover:underline hover:font-semibold transition-colors ${isActive ? "text-white border-b-2 font-semibold border-spacing-1 rounded-md p-2 bg-slate-500 " : ""}`
            }
          >
            <LiaIdCardSolid size={20} />
            Cards
          </NavLink>
        </li>

        <li>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center justify-between w-full gap-4 transition-colors"
          >
            <div className="flex items-center gap-4 hover:underline hover:p-1 hover:rounded-md hover:font-semibold">
              <IoSettingsOutline size={20} />
              Settings
            
            {settingsOpen ? <FaChevronDown className="text-gray-400 mt-1" size={12} /> : <FaChevronRight className="text-gray-400 mt-1" size={12} />}
            </div>
          </button>

          {settingsOpen && (
            <ul className="ml-8 mt-4 space-y-2">
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
              `flex items-center gap-4 hover:text-white hover:underline hover:font-semibold transition-colors ${isActive ? "text-white border-b-2 font-semibold border-spacing-1 rounded-md p-2 bg-slate-500 " : ""}`
            }
                >
                  <MdAdminPanelSettings size={18} />
                  Admin
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 hover:text-red-500 hover:bg-red-50 hover:p-2 hover:rounded-md hover:font-semibold transition-colors ${isActive ? "text-white border-b-2 font-semibold border-spacing-1 rounded-md p-2 bg-slate-500 " : ""}`
            }
          >
            <CgLogOut size={20} />
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
