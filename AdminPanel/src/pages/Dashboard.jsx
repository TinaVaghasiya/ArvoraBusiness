import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaUsers, FaIdCard, FaEye, FaArrowUp } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

export default function Dashboard() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    todaysScans: 0,
    todaysSignups: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentUsers(),
      ]);

      console.log("User Api Response:", usersResponse.data);

      setStats(statsResponse.data.data || {});
      setRecentUsers(usersResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      gradient: "from-blue-900 to-blue-600",
      lightBg: "bg-blue-50",
      darkBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      trend: "+12%",
    },
    {
      title: "Total Cards",
      value: stats.totalCards,
      icon: FaIdCard,
      gradient: "from-emerald-500 to-emerald-600",
      lightBg: "bg-emerald-50",
      darkBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      trend: "+8%",
    },
    {
      title: "Today's Scans",
      value: stats.todaysScans,
      icon: FaEye,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      darkBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      trend: "+23%",
    },
    {
      title: "Today's Signups",
      value: stats.todaysSignups,
      icon: HiUserAdd,
      gradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      darkBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      trend: "+5%",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className={`h-6 w-40 rounded ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}></div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-16 md:h-24 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}></div>
            ))}
          </div>
          <div className={`h-80 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:mt-6 mt-3">
      <div className="mb-4">
        <h1 className={`text-xl md:text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Dashboard Overview
        </h1>
        <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Track your business metrics
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            onClick={() => {
              if (stat.title === "Total Users") navigate("/users");
              else if (stat.title === "Total Cards") navigate("/cards");
              else if (stat.title === "Today's Scans") navigate("/cards?filter=todayScans");
              else if (stat.title === "Today's Signups") navigate("/users?filter=todaySignups");
            }}
            className={`relative overflow-hidden rounded-lg p-2.5 md:p-5 hover:shadow-lg hover:translate-y-1 cursor-pointer ${
              isDarkMode 
                ? "bg-gray-800 shadow hover:shadow-gray-400/30 hover:shadow-md" 
                : "bg-white shadow-sm hover:shadow-blue-400/30 hover:shadow-md"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 md:mb-5">
              <div className={`p-1.5 md:p-2.5 rounded-md ${isDarkMode ? stat.darkBg : stat.lightBg}`}>
                <stat.icon className={`w-3.5 h-3.5 md:w-5 md:h-5 ${stat.iconColor}`} />
              </div>
              <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs font-semibold text-green-600">
                <FaArrowUp className="w-2 h-2 md:w-2.5 md:h-2.5" />
                <span>{stat.trend}</span>
              </div>
            </div>
            
            <div>
              <p className={`text-[10px] md:text-sm text-xs font-medium mb-0.5 md:mb-1 leading-tight ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.title}
              </p>
              <p className={`text-base md:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {stat.value?.toLocaleString() || 0}
              </p>
            </div>

            <div className={`absolute bottom-0 right-0 w-10 h-10 md:w-20 md:h-20 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-tl-full`}></div>
          </div>
        ))}
      </div>

      <div className={`rounded-lg overflow-hidden ${
        isDarkMode 
          ? "bg-gray-800 shadow" 
          : "bg-white shadow-sm"
      }`}>
        <div className={`px-4 py-3 md:py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-base md:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Recent Users
              </h2>
              <p className={`text-[10px] md:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Latest registered users
              </p>
            </div>
            <button
              onClick={() => navigate("/users")}
              className="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase tracking-wide ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  User
                </th>
                <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase  tracking-wide ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email
                </th>
                <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-bold uppercase  tracking-wide ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Phone
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {Array.isArray(recentUsers) && recentUsers.length > 0 ? (
                recentUsers.map((user, index) => (
                  <tr
                    key={user._id || index}
                    className={`transition-colors ${
                      isDarkMode 
                        ? "hover:bg-gray-700/30" 
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className={`py-2.5 px-3 md:px-4 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      <div className="flex items-center gap-2 md:gap-2.5">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-[10px] md:text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-xs md:text-sm truncate max-w-[80px] md:max-w-none">
                            {user.name || 'N/A'}
                          </span>
                        </div>
                    </td>
                    <td className={`py-2 md:py-4 px-4 md:px-6 text-xs md:text-sm  sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {user.email || 'N/A'}
                    </td>
                    <td className={`py-2 md:py-4 px-4 md:px-6 text-xs md:text-sm  sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {user.phone || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 px-3 text-center">
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No recent users found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};