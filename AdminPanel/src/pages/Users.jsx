import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { adminAPI } from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiInfo } from "react-icons/fi";


export default function Users() {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const [userCardsModal, setUserCardsModal] = useState({show: false, cards: [], user: null, loading: false});
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await adminAPI.getUsers();
      console.log("User API", response.data);

      let allUsers = response.data.data.users;

      if (filter === "todaySignups") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        allUsers = allUsers.filter(user => {
          const createdDate = new Date(user.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        });
      }

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
    const formattedUser = {
      ...user,
      phone: validatePhone(user.phone || "")
    };
    setEditUser(formattedUser);
    setFieldErrors({ name: "", email: "", phone: "" });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!validateAllFields()) {
      return;
    }

    try {
      await adminAPI.updateUser(editUser._id, editUser);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleToggleStatus = async (user) => {
    const action = user.isActive ? "deactivate" : "activate";
    if (window.confirm(`Do you want to ${action} ${user.name}?`)) {
      try {
        await adminAPI.toggleUserStatus(user._id);
        fetchUsers();
      } catch (error) {
        console.error("Error toggling user status:", error);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const q = search.trim().replace(/\s+/g, " ").toLowerCase();
    const createdDate = new Date(user.createdAt).toLocaleDateString();
    return (
      user.name?.trim().replace(/\s+/g, " ").toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.includes(q) ||
      user.company?.toLowerCase().includes(q) ||
      createdDate.includes(q)
    );
  });

  const totalPagesCalculated = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  const validateName = (value) => {
    return value.replace(/[0-9]/g, '');
  };

  const validatePhone = (value) => {
    if (!value) return '';
    const numbers = value.split(/[\n,]/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .map(num => {
        const hasPlus = num.startsWith('+');
        const cleaned = num.replace(/[^0-9+\-\s()]/g, '');
        if (hasPlus && !cleaned.startsWith('+')) {
          return '+' + cleaned.replace(/\+/g, '');
        }
        return cleaned;
      });
    return numbers.join(', ');
  };

  const validateEmail = (value) => {
    return value.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };

    switch (fieldName) {
      case 'name':
        errors.name = !value?.trim() ? "Please enter a name" : "";
        break;
      case 'email':
        if (!value?.trim()) {
          errors.email = "Please enter an email";
        } else if (!validateEmailFormat(value)) {
          errors.email = "Please enter a valid email";
        } else {
          errors.email = "";
        }
        break;
      case 'phone':
        errors.phone = !value?.trim() ? "Please enter a phone number" : "";
        break;
    }

    setFieldErrors(errors);
  };

  const handleFieldChange = (fieldName, value) => {
    let processedValue = value;

    if (fieldName === 'name') {
      processedValue = validateName(value);
    } else if (fieldName === 'email') {
      processedValue = validateEmail(value);
    } else if (fieldName === 'phone') {
      processedValue = validatePhone(value);
    }

    setEditUser({ ...editUser, [fieldName]: processedValue });
    validateField(fieldName, processedValue);
  };

  const validateAllFields = () => {
    const errors = {};

    errors.name = !editUser?.name?.trim() ? "Please enter a name" : "";

    if (!editUser?.email?.trim()) {
      errors.email = "Please enter an email";
    } else if (!validateEmailFormat(editUser.email)) {
      errors.email = "Please enter a valid email";
    } else {
      errors.email = "";
    }

    errors.phone = !editUser?.phone?.trim() ? "Please enter a phone number" : "";

    setFieldErrors(errors);

    return !Object.values(errors).some(error => error !== "");
  };

  return (
    <div className="min-h-screen md:mt-6 mt-3">
      <div className="mb-3 md:mb-6">
        <h1
          className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {filter === "todaySignups" ? "Today's New Users" : "Users Management"}
        </h1>
        <p
          className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {filter === "todaySignups" ? "Users who signed up today" : "Manage and view all registered users"}
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
            className={`w-full pl-8 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl border-2 transition-all duration-300 font-medium ${isDarkMode
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

      {filter && (
        <div className={`mb-3 md:mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm ${isDarkMode ? "bg-blue-900/30 text-blue-300 border border-blue-800" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
          <FiInfo size={18} />
          <span>Showing today's signups</span>
        </div>
      )}

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
        <div className={`rounded-lg md:rounded-2xl  overflow-hidden ${isDarkMode ? "bg-gray-800 shadow-xl shadow-gray-900/50" : "bg-white shadow-lg"}`}>
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {search ? `No users found for "${search}"` : "No users found"}
              </p>
            </div>
          ) : (
            <div className={`rounded-lg md:rounded-t-2xl md:rounded-b-none  overflow-hidden ${isDarkMode ? "bg-gray-800 " : "bg-white "}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Name</th>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider  sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email</th>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider  lg:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Phone</th>
                      <th
                        className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider hidden md:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {" "}
                        Cards{" "}
                      </th>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Status</th>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider  md:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Created</th>
                      <th className={`text-left py-2 md:py-4 px-4 md:px-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
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
                            className={`py-2 md:py-4 px-4 md:px-6 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
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
                            className={`py-2 md:py-4 px-4 md:px-6 text-xs md:text-sm  sm:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                          >
                            {user.email}
                          </td>
                          <td
                            className={`py-2 md:py-4 px-4 md:px-6 text-xs md:text-sm  lg:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                          >
                            {user.phone}
                          </td>
                          <td className="py-2 md:py-4 px-4 md:px-6 hidden md:table-cell">
                            <button
                              onClick={() =>
                                navigate(
                                  `/cards?userId=${user._id}&userName=${encodeURIComponent(user.name)}`,
                                )
                              }
                              className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${isDarkMode ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/70 hover:underline" : "bg-blue-100 text-blue-700 hover:bg-blue-200 hover:underline"}`}
                            >
                              View {user.cardCount} Cards
                            </button>
                          </td>
                          <td className="py-2 md:py-4 px-4 md:px-6">
                            <button
                              onClick={() => handleToggleStatus(user)}
                              className="cursor-pointer"
                            >
                              <span
                                className={`px-1.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-semibold ${!user.isActive
                                    ? isDarkMode
                                      ? "bg-red-800/30 text-red-400"
                                      : "bg-red-100 text-red-700"
                                    : user.isVerified
                                      ? isDarkMode
                                        ? "bg-green-900/30 text-green-400"
                                        : "bg-green-100 text-green-700"
                                      : isDarkMode
                                        ? "bg-red-900/40 text-red-400"
                                        : "bg-red-100 text-red-500"
                                  }`}
                              >
                                {!user.isActive
                                  ? "Inactive"
                                  : user.isVerified
                                    ? "Active"
                                    : "Pending"}
                              </span>
                            </button>
                          </td>
                          <td
                            className={`py-2 md:py-4 px-4 md:px-6 text-xs md:text-sm  md:table-cell ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                          >
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2 md:py-4 px-4 md:px-6">
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
            </div>
          )}

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className={`flex items-center justify-center p-3 md:p-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} `}>
              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm
                ${currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  ← Back
                </button>
                {pages.map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium
                        ${isDarkMode ? "text-gray-300" : "text-gray-700"}
                        ${currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPagesCalculated))
                  }
                  disabled={currentPage === totalPagesCalculated}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm
                ${currentPage === totalPagesCalculated
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-800"
                    }`}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/*Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-10 md:p-4">
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
                    handleFieldChange('name', e.target.value)}
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.name ? "focus:ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                )}
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
                    handleFieldChange('email', e.target.value)
                  }
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.email ? "focus:ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
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
                    handleFieldChange('phone', e.target.value)
                  }
                  className={`w-full p-2 md:p-2 text-sm md:text-base rounded-lg md:rounded-xl border-2 focus:outline-none focus:ring-2 ${fieldErrors.phone ? "focus:ring-red-500" : "focus:ring-blue-500"} ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                )}
              </div>
              <div className="flex gap-2 md:gap-3 pt-3 md:pt-4">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 md:px-3 py-2 md:py-2 text-sm md:text-base rounded-lg md:rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 px-3 md:px-3 py-2 md:py-2 text-sm md:text-base rounded-lg md:rounded-xl font-medium transition-all ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {userCardsModal.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl w-full max-w-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-2xl`}
          >
            <div
              className={`flex justify-between items-center p-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div>
                <h3
                  className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  {userCardsModal.user?.name}'s Cards
                </h3>
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {userCardsModal.cards.length} card
                  {userCardsModal.cards.length !== 1 ? "s" : ""} uploaded
                </p>
              </div>
              <button
                onClick={() =>
                  setUserCardsModal({
                    show: false,
                    user: null,
                    cards: [],
                    loading: false,
                  })
                }
                className={`p-2 rounded-lg ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <FaTimes
                  size={13}
                  className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {userCardsModal.loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userCardsModal.cards.length === 0 ? (
                <p
                  className={`text-center text-sm py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No cards uploaded
                </p>
              ) : (
                <div className="space-y-2">
                  {userCardsModal.cards.map((card, i) => (
                    <div
                      key={card._id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
                    >
                      <span
                        className={`text-xs font-medium w-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {i + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {card.name || "—"}
                        </p>
                        <p
                          className={`text-[10px] truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {card.company || card.email || "—"}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] shrink-0 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {new Date(card.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};