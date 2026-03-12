import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { adminManagementAPI } from "../services/api";

function Admin() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);

      const usersResponse = await adminManagementAPI.getAdmins();

      console.log("Admins Response:", usersResponse.data);

      setAdmins(usersResponse.data.data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className={`rounded-2xl p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}>
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading admins...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:mt-6">
      <div className="mb-8">
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Admin Management
        </h1>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          View and manage admin accounts
        </p>
      </div>

      <div className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Sr. No</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Username</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Role</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Created Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr
                    key={admin._id}
                    className={`transition-colors ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                  >
                    <td className={`py-4 px-6 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>{index + 1}</td>
                    <td className={`py-4 px-6 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {admin.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{admin.username}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{admin.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.role === "superadmin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className={`py-4 px-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 px-6 text-center">
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No admins found
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
}

export default Admin;
