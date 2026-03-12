// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useApp } from '../context/AppContext';

// const navItems = [
//   { path: '/',            icon: 'fa-chart-pie',        label: 'Dashboard' },
//   { path: '/explain',     icon: 'fa-book-open',        label: 'Explain Topic' },
//   { path: '/create-test', icon: 'fa-pen-to-square',    label: 'Create Test' },
// ];

// export default function Sidebar() {
//   const { user, logoutUser, sidebarOpen, setSidebarOpen } = useApp();
//   const location = useLocation();

//   return (
//     <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-800 border-r border-gray-800 flex flex-col transition-all duration-300 shrink-0`}>
//       {/* Header */}
//       <div className="p-4 border-b border-gray-800 flex items-center justify-between">
//         {sidebarOpen && (
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
//               <i className="fas fa-graduation-cap text-white text-sm"></i>
//             </div>
//             <span className="font-bold text-lg text-white">EduAI</span>
//           </div>
//         )}
//         <button onClick={setSidebarOpen}
//           className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-600 transition">
//           <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-sm`}></i>
//         </button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 py-4 px-3 space-y-1">
//         {navItems.map(item => {
//           const active = location.pathname === item.path;
//           return (
//             <Link key={item.path} to={item.path}
//               className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
//                 ${active
//                   ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
//                   : 'text-gray-400 hover:text-white hover:bg-dark-600'}`}>
//               <i className={`fas ${item.icon} w-5 text-center`}></i>
//               {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* User section */}
//       <div className="p-3 border-t border-gray-800">
//         {sidebarOpen && user && (
//           <div className="flex items-center gap-3 px-3 py-2 mb-2">
//             <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
//               {user.fullName?.charAt(0) || 'U'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
//               <p className="text-xs text-gray-500 truncate">{user.email}</p>
//             </div>
//           </div>
//         )}
//         <button onClick={logoutUser}
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-dark-600 transition w-full">
//           <i className="fas fa-sign-out-alt w-5 text-center"></i>
//           {sidebarOpen && <span className="text-sm">Logout</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/',            icon: 'fa-chart-pie',           label: 'Dashboard' },
  { path: '/ai-teacher',  icon: 'fa-chalkboard-teacher',  label: 'AI Teacher' },
  { path: '/create-test', icon: 'fa-pen-to-square',       label: 'Create Test' },
  { path: '/settings',    icon: 'fa-cog',                 label: 'Settings' }
];

export default function Sidebar() {
  const { user, logoutUser, sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  return (
    <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-800 border-r border-gray-800 flex flex-col transition-all duration-300 shrink-0`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-sm"></i>
            </div>
            <span className="font-bold text-lg text-white">EduAI</span>
          </div>
        )}
        <button onClick={setSidebarOpen}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-dark-600 transition">
          <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-sm`}></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                ${active
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'}`}>
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-gray-800">
        {sidebarOpen && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
              {user.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={logoutUser}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-dark-600 transition w-full">
          <i className="fas fa-sign-out-alt w-5 text-center"></i>
          {sidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}