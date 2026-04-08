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
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('send');

  useEffect(() => {
    fetchUsers();
    fetchHistory();
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
        // The API returns {users: [...], total: 13}, so we need to access .users
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

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/admin/notifications/sent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('Fetch history error:', error);
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
        fetchHistory();
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

  const deleteHistory = async (id) => {
    if (!confirm('Delete this notification record?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/admin/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHistory();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Push Notifications</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'send'
                ? 'bg-blue-600 text-white'
                : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
            }`}
          >
            Send Notification
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
            }`}
          >
            History
          </button>
        </div>

        {activeTab === 'send' ? (
          <div className="grid grid-cols-1 gap-6">
            {/* Send Form */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Create Notification</h2>
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    }`}
                    placeholder="Notification title"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                    }`}
                    placeholder="Notification message"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="system" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>System</option>
                    <option value="success" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Success</option>
                    <option value="warning" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Warning</option>
                    <option value="card_scanned" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Card Scanned</option>
                    <option value="profile_update" className={isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}>Profile Update</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Send To</label>
                  <div className="flex gap-6">
                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition ${
                      sendTo === 'all' 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' 
                        : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
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
                        className="w-5 h-5 text-blue-600 cursor-pointer"
                      />
                      <span className="font-medium">All Users</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition ${
                      sendTo === 'selected' 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' 
                        : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
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
                        className="w-5 h-5 text-blue-600 cursor-pointer"
                      />
                      <span className="font-medium">Selected Users</span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Current selection: {sendTo}</p>
                </div>

                {/* User Selection - Show inline when selected */}
                {sendTo === 'selected' && (
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Select Users</h3>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-blue-600 text-sm font-semibold hover:underline"
                      >
                        {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {!Array.isArray(users) || users.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No users available</p>
                      ) : (
                        users.map(user => (
                          <label
                            key={user._id}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                              isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => handleUserSelect(user._id)}
                              className="w-4 h-4"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      {selectedUsers.length} user(s) selected
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* History */
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-bold mb-4">Notification History</h2>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No notifications sent yet</p>
              ) : (
                history.map(item => (
                  <div
                    key={item._id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg">{item.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            item.type === 'success' ? 'bg-green-100 text-green-800' :
                            item.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{item.message}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Sent to: {item.sendTo === 'all' ? 'All Users' : `${item.recipientCount} users`}</span>
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteHistory(item._id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
