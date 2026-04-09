import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

export default function Notifications() {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendTo, setSendTo] = useState('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('system');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from:', `${API_BASE_URL}/admin/users`);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      if (response.data.success) {
        console.log('Users data:', response.data.data);
        const usersArray = response.data.data.users || response.data.data;
        setUsers(Array.isArray(usersArray) ? usersArray : []);
        console.log('Set users to:', usersArray);
      } else {
        console.log('API returned success: false');
        setUsers([]);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      console.error('Error response:', error.response);
      setUsers([]);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      alert('Please fill in all fields');
      return;
    }

    if (sendTo === 'selected' && selectedUsers.length === 0) {
      alert('Please select at least one user');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_BASE_URL}/admin/notifications/send`,
        { title, message, type, sendTo, userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(response.data.message);
        setTitle('');
        setMessage('');
        setSelectedUsers([]);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (!Array.isArray(users)) return;
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  return (
    <div className="min-h-screen md:mt-6 mt-3">
      <div className="mb-3 md:mb-6">
        <h1 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Push Notifications
        </h1>
        <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Send notifications to users
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Send Form */}
        <div className={`rounded-lg md:rounded-2xl p-4 md:p-6 transition-all duration-300 ${isDarkMode ? "bg-gray-800/60 backdrop-blur-xl border border-gray-700/50" : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold">Create Notification</h2>
            <button
              type="submit"
              disabled={loading}
              className="md:hidden bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg text-xs"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block mb-2 font-semibold text-xs md:text-sm">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 md:px-4 py-2 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all duration-300 font-medium ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' : 'bg-gray-50 border-gray-200 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:shadow-lg focus:shadow-blue-500/20`}
                placeholder="Notification title"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-xs md:text-sm">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`w-full px-3 md:px-4 py-2 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all duration-300 font-medium ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-700' : 'bg-gray-50 border-gray-200 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:shadow-lg focus:shadow-blue-500/20`}
                placeholder="Notification message"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-xs md:text-sm">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-3 md:px-4 py-2 rounded-lg md:rounded-xl border-2 text-sm md:text-base transition-all duration-300 font-medium ${
                  isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:bg-gray-700' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                } focus:outline-none focus:shadow-lg focus:shadow-blue-500/20`}
              >
                <option value="system" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>System</option>
                <option value="success" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Success</option>
                <option value="warning" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Warning</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-xs md:text-sm">Send To</label>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <label className={`flex items-center gap-2 cursor-pointer px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                  sendTo === 'all' 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="sendTo"
                    value="all"
                    checked={sendTo === 'all'}
                    onChange={(e) => {
                      console.log('Selected: all');
                      setSendTo(e.target.value);
                    }}
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600 cursor-pointer"
                  />
                  <span className="font-medium text-xs md:text-sm">All Users</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl border-2 transition-all duration-300 ${
                  sendTo === 'selected' 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isDarkMode ? 'border-gray-600 hover:border-gray-500 bg-gray-700/50' : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="sendTo"
                    value="selected"
                    checked={sendTo === 'selected'}
                    onChange={(e) => {
                      console.log('Selected: selected');
                      setSendTo(e.target.value);
                    }}
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600 cursor-pointer"
                  />
                  <span className="font-medium text-xs md:text-sm">Selected Users</span>
                </label>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Current selection: {sendTo}</p>
            </div>

            {/* User Selection - Show inline when selected */}
            {sendTo === 'selected' && (
              <div className="md:relative">
                <div className={`md:static fixed inset-0 md:inset-auto z-50 md:z-auto bg-black/50 md:bg-transparent flex items-center justify-center md:block p-4 md:p-0`}>
                  <div className={`w-full max-w-md md:max-w-none p-4 md:p-3 rounded-xl md:rounded-lg border-2 ${isDarkMode ? 'bg-gray-800 md:bg-gray-700/50 border-gray-700 md:border-gray-600' : 'bg-white md:bg-gray-50 border-gray-300 md:border-gray-200'} shadow-2xl md:shadow-none`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-sm md:text-xs">Select Users</h3>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAll}
                          className="text-blue-600 text-sm md:text-xs font-semibold hover:underline"
                        >
                          {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSendTo('all')}
                          className="md:hidden text-gray-500 hover:text-gray-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-96 md:max-h-48 overflow-y-auto">
                      {!Array.isArray(users) || users.length === 0 ? (
                        <p className="text-center text-gray-500 py-4 text-sm md:text-xs">No users available</p>
                      ) : (
                        users.map(user => (
                          <label
                            key={user._id}
                            className={`flex items-center gap-3 md:gap-2 p-3 md:p-2 rounded-lg cursor-pointer transition-colors ${
                              isDarkMode ? 'hover:bg-gray-700 md:hover:bg-gray-600' : 'hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleUserSelect(user._id)}
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm md:text-xs truncate">{user.name}</div>
                              <div className="text-xs md:text-[10px] text-gray-500 truncate">{user.email}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="mt-3 text-sm md:text-xs text-gray-500">
                      {selectedUsers.length} user(s) selected
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full hidden md:block bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 md:py-2.5 rounded-lg md:rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
