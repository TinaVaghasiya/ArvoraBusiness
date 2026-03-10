import { NavLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { LiaIdCardSolid } from "react-icons/lia";
import { TbLayoutDashboard } from "react-icons/tb";
import { CgLogOut } from "react-icons/cg";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`w-64 h-screen p-6 transition-colors fixed ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
      <h2 className="text-xl font-bold mb-3 mt-2">Admin Panel</h2>
      <hr className={`mb-6 border-1 shadow transition-colors duration-100 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-4 hover:text-blue-500 hover:border-b-2 hover:font-semibold transition-colors ${isActive ? "text-blue-600 border-b-2 font-semibold" : ""}`
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
              `flex items-center gap-4 hover:text-blue-500 hover:border-b-2 hover:font-semibold transition-colors ${isActive ? "text-blue-600 border-b-2 font-semibold" : ""}`
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
              `flex items-center gap-4 hover:text-blue-500 hover:border-b-2 hover:font-semibold transition-colors ${isActive ? "text-blue-600 border-b-2 font-semibold" : ""}`
            }
          >
            <LiaIdCardSolid size={20} />
            Cards
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 text-red-600 hover:text-red-500 hover:border-b-2 hover:font-semibold transition-colors ${isActive ? "text-blue-600 border-b-2 font-semibold" : ""}`
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
