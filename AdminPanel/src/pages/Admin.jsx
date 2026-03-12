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
      <div
        className={`p-6 rounded-xl shadow-md ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 mt-16 rounded-xl shadow-md ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <h1 className="text-2xl font-bold mb-8">Admin List</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead
            className={`${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100"
            }`}
          >
            <tr>
              <th className="px-4 py-3">Sr. No</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created Date</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {admins.length > 0 ? (
              admins.map((admin, index) => (
                <tr
                  key={admin._id}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 font-medium">{admin.username}</td>

                  <td className="px-4 py-3">{admin.email}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        admin.role === "superadmin"
                          ? "bg-red-100 text-red-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
