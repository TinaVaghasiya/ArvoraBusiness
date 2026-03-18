import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { adminManagementAPI } from "../services/api";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Admin() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [submitting, setSubmitting] = useState(false);
  const [currentAdminRole, setCurrentAdminRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("adminRole");
    setCurrentAdminRole(role);
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const usersResponse = await adminManagementAPI.getAdmins();
      setAdmins(usersResponse.data.data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminManagementAPI.createAdmin(formData);
      setShowModal(false);
      setFormData({ username: "", email: "", password: "", role: "admin" });
      fetchAdminProfile();
      alert("Admin added successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await adminManagementAPI.deleteAdmin(adminId);
        fetchAdminProfile();
        alert("Admin deleted successfully");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete admin");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div
          className={`rounded-2xl p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Loading admins...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:mt-6 mt-3">
      <div className="mb-3 md:mb-6 flex justify-between items-center">
        <div>
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            Admin Management
          </h1>
          <p
            className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            View and manage admin accounts
          </p>
        </div>
        {currentAdminRole === "superadmin" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white md:px-4 px-2 md:py-1 mr-2 rounded-lg md:text-sm text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="text-lg">+</span> ADD
          </button>
        )}
      </div>

      <div
        className={`rounded-lg md:rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                <th
                  className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Sr. No
                </th>
                <th
                  className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Username
                </th>
                <th
                  className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </th>
                <th
                  className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Role
                </th>
                <th
                  className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Created Date
                </th>
                {currentAdminRole === "superadmin" && (
                  <th
                    className={`text-left py-2 px-4 md:py-4 md:px-6 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody
              className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
            >
              {admins.length > 0 ? (
                admins.map((admin, index) => (
                  <tr
                    key={admin._id}
                    className={`transition-colors ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                  >
                    <td
                      className={`py-3 px-4 md:py-3 md:px-6 text-xs ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`py-3 px-4 md:py-3 md:px-6 text-xs ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="md:w-8 md:h-8 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
                          {admin.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-xs">
                          {admin.username}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`py-2 px-4 md:py-4 md:px-6 text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {admin.email}
                    </td>
                    <td className="py-2 px-4 md:py-4 md:px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.role === "superadmin" ? isDarkMode ? "bg-purple-900/30 text-purple-500" : "bg-purple-100 text-purple-700"
                          : admin.role === "usermanager" ? isDarkMode ? "bg-green-900/30 text-green-500" : "bg-green-100 text-green-700"
                          : admin.role === "cardmanager" ? isDarkMode ? "bg-yellow-900/30 text-yellow-500" : "bg-yellow-100 text-yellow-700"
                          : isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                        }`} >
                        {admin.role}
                      </span>
                    </td>
                    <td
                      className={`py-2 px-4 md:py-4 md:px-6 text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    {currentAdminRole === "superadmin" && (
                      <td className="py-2 px-4 md:py-4 md:px-6">
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className={`p-2 rounded-lg transition-colors ${isDarkMode ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "hover:bg-red-200 bg-red-100 text-red-700"}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentAdminRole === "superadmin" ? "6" : "5"} className="py-8 px-6 text-center">
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      No admins found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg p-6 w-full max-w-md mx-4 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Add New Admin
            </h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Username
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    maxLength={15}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full px-3 py-2 pr-10 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-2.5 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-blue-500"} transition`}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Role
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                >
                  <option value="">Select Role</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="usermanager">User Manager</option>
                  <option value="cardmanager">Card Manager</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      username: "",
                      email: "",
                      password: "",
                      role: "usermanager",
                    });
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
