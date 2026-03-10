import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaUsers, FaIdCard, FaEye } from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../services/api";

function Dashboard() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCards: 0,
    todaysScans: 0,
    todaysSignups: 0
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
        adminAPI.getRecentUsers()
      ]);
      
      setStats(statsResponse.data);
      setRecentUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: FaUsers,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Cards",
      value: stats.totalCards,
      icon: FaIdCard,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Today's Scans",
      value: stats.todaysScans,
      icon: FaEye,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Today's Signups",
      value: stats.todaysSignups,
      icon: HiUserAdd,
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-lg transition-colors ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Users</h2>
          <button onClick={() => navigate('/users')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View All Users
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index} className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
