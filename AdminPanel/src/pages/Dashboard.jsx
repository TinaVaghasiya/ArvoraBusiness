// // import Sidebar from "../components/Sidebar";
// // import Navbar from "../components/Navbar";
// import { useTheme } from "../context/ThemeContext";
// function Dashboard() {
//   const { isDarkMode } = useTheme();
//   return (
//     <div >
//       <div >
//         <div className="p-6">
//           <h1 className={`text-2xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-black' }`}>Dashboard</h1>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div className="bg-white shadow rounded-xl p-6">
//               <h2 className="text-gray-500">Total Users</h2>
//               <p className="text-2xl font-bold mt-2 text-blue-500">120</p>
//             </div>

//             <div className="bg-white shadow rounded-xl p-6">
//               <h2 className="text-gray-500">Total Cards</h2>
//               <p className="text-3xl font-bold mt-2 text-green-500">85</p>
//             </div>

//             <div className="bg-white shadow rounded-xl p-6">
//               <h2 className="text-gray-500">Active Users</h2>
//               <p className="text-3xl font-bold mt-2 text-yellow-500">60</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useTheme } from '../context/ThemeContext';
import { FaUsers, FaIdCard, FaEye } from 'react-icons/fa';
import { HiUserAdd } from "react-icons/hi";

function Dashboard() {
  const { isDarkMode } = useTheme();

  const stats = [
    { 
      title: 'Total Users', 
      value: '0', 
      icon: FaUsers, 
      bgColor: 'bg-blue-100', 
      iconColor: 'text-blue-600' 
    },
    { 
      title: 'Total Cards', 
      value: '0', 
      icon: FaIdCard, 
      bgColor: 'bg-green-100', 
      iconColor: 'text-green-600' 
    },
    { 
      title: 'Today\'s Scan', 
      value: '0', 
      icon: FaEye, 
      bgColor: 'bg-purple-100', 
      iconColor: 'text-purple-600' 
    },
    { 
      title: 'Today\'s Signups', 
      value: '0', 
      icon: HiUserAdd, 
      bgColor: 'bg-orange-100', 
      iconColor: 'text-orange-600' 
    }
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'Created new card', time: '2 min ago' },
    { user: 'Jane Smith', action: 'Updated profile', time: '5 min ago' },
    { user: 'Mike Johnson', action: 'Deleted card', time: '10 min ago' },
    { user: 'Sarah Wilson', action: 'Logged in', time: '15 min ago' }
  ];

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-lg transition-colors ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl shadow-lg transition-colors ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {activity.action}
                  </p>
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      
    </div>
  );
}

export default Dashboard;
