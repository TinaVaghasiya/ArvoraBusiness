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

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers(currentPage, search);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
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
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>

      {/* Search Bar */}
      <div className={`rounded-xl shadow-lg p-6 mb-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="relative">
          <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 left-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search users..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="text-center">Loading...</div>
        </div>
      ) : (
        <div className={`rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-4 px-6">Name</th>
                  <th className="text-left py-4 px-6">Email</th>
                  <th className="text-left py-4 px-6">Phone</th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-left py-4 px-6">Created</th>
                  <th className="text-left py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} hover:${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">{user.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isVerified ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-6">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                          <FaEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-6">
            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-96 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit User</h3>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={editUser?.name || ''}
                onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <input
                type="email"
                placeholder="Email"
                value={editUser?.email || ''}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <input
                type="text"
                placeholder="Phone"
                value={editUser?.phone || ''}
                onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                className={`w-full p-2 rounded border ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
              />
              <div className="flex space-x-2">
                <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Save
                </button>
                <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
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
