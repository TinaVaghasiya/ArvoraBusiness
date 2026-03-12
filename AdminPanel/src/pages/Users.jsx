import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { adminAPI } from "../services/api";

function Users() {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const usersPerPage = 10;

   // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users when debounced search or page changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getUsers();
      console.log("User API", response.data);

      const allUsers = response.data.data.users;

      setUsers(allUsers);

      const calculatedTotalPages = Math.ceil(allUsers.length / usersPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await adminAPI.updateUser(editUser._id, editUser);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPagesCalculated = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  return (
    <div className="min-h-screen md:mt-6">
      <div className="mb-3 md:mb-6">
        <h1
          className={`text-lg md:text-2xl lg:text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Users Management
        </h1>
        <p
          className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Manage and monitor all registered users
        </p>
      </div>

      <div
        className={`rounded-lg md:rounded-2xl p-3 md:p-6 mb-3 md:mb-6 transition-all duration-300 ${isDarkMode ? "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50" : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"}`}
      >
        <div className="relative group">
          <FaSearch
            className={`absolute top-1/2 transform -translate-y-1/2 left-3 text-xs md:text-base transition-colors duration-300 ${isDarkMode ? "text-gray-500 group-hover:text-blue-400" : "text-gray-400 group-hover:text-blue-500"}`}
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className={`w-full pl-8 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 transition-all duration-300 font-medium ${
              isDarkMode
                ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700"
                : "bg-gray-50 border-gray-200 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
            } focus:outline-none focus:shadow-lg focus:shadow-blue-500/20`}
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button
              onClick={clearSearch}
              className={`absolute top-1/2 transform -translate-y-1/2 right-4 p-2 rounded-lg transition-colors ${isDarkMode ? "text-gray-400 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div
          className={`rounded-lg md:rounded-2xl p-6 md:p-12 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2 md:mb-4"></div>
            <p
              className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Loading users...
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-lg md:rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                >
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Name
                  </th>
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Email
                  </th>
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden lg:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Phone
                  </th>
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden md:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Created
                  </th>
                  <th
                    className={`text-left py-2 md:py-4 px-2 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}
              >
                {Array.isArray(users) &&
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`transition-colors ${isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}`}
                    >
                      <td
                        className={`py-2 md:py-4 px-2 md:px-6 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                      >
                        <div className="flex items-center gap-1 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-[10px] md:text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-xs md:text-sm truncate max-w-[80px] md:max-w-none">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-2 md:py-4 px-2 md:px-6 text-xs md:text-sm hidden sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {user.email}
                      </td>
                      <td
                        className={`py-2 md:py-4 px-2 md:px-6 text-xs md:text-sm hidden lg:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {user.phone}
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-6">
                        <span
                          className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold ${user.isVerified ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-900/40 text-red-500"} ${isDarkMode ? "text-green-500 bg-green-900/30" : "text-green-600"}`}
                        >
                          {user.isVerified ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td
                        className={`py-2 md:py-4 px-2 md:px-6 text-xs md:text-sm hidden md:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 md:py-4 px-2 md:px-6">
                        <div className="flex gap-1 md:gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className={`p-1 md:p-2 rounded-lg  text-blue-600 transition-colors ${isDarkMode ? "hover:text-blue-600 bg-blue-900/40" : "hover:bg-blue-200 bg-blue-100 "}`}
                          >
                            <FaEdit size={12} className="md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className={`p-1 md:p-2 rounded-lg  transition-colors ${isDarkMode ? "bg-red-900/30 hover:text-red-900/50 text-red-400" : "hover:bg-red-200 bg-red-100 text-red-700"}`}
                          >
                            <FaTrash size={12} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-2 p-3 md:p-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <span
              className={`text-[10px] md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + usersPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </span>
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-base rounded-lg font-medium transition-all ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPagesCalculated),
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-base rounded-lg font-medium transition-all ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div
            className={`rounded-lg md:rounded-2xl p-4 md:p-6 w-full max-w-md ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform transition-all`}
          >
            <div className="flex justify-between items-center mb-4 md:mb-4">
              <h3
                className={`text-base md:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Edit User
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaTimes
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editUser?.name || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={editUser?.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div>
                <label
                  className={`block text-xs md:text-sm font-medium mb-1 md:mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={editUser?.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
              </div>
              <div className="flex gap-2 md:gap-3 pt-2 md:pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl font-medium transition-all ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
