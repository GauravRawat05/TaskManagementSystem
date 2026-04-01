import React from 'react';
import {
  FiBarChart2,
  FiBriefcase,
  FiFolder,
  FiHome,
  FiMail,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiCheckSquare
} from 'react-icons/fi';

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  isSuperuser,
  currentUserRole,
  selectedWorkplace,
  workplaces,
  isMemberOnly,
  canCreateProject,
  canCreateTeam,
  canInviteMembers
}) => {
  const currentWorkplace = workplaces?.find(w => w._id === selectedWorkplace);

  // Define menu items based on permissions
  const getMenuItems = () => {
    const items = [
      { id: 'dashboard', icon: <FiHome size={20} />, label: 'Dashboard', visible: true },
      { id: 'projects', icon: <FiFolder size={20} />, label: 'Projects', visible: true },
      { id: 'teams', icon: <FiUsers size={20} />, label: 'Teams', visible: true },
      { id: 'members', icon: <FiUserPlus size={20} />, label: 'Members', visible: true },
      { id: 'tasks', icon: <FiCheckSquare size={20} />, label: 'Tasks', visible: !isMemberOnly },
      { id: 'analytics', icon: <FiBarChart2 size={20} />, label: 'Analytics', visible: !isMemberOnly },
      ...(isSuperuser ? [{ id: 'global-pool', icon: <FiMail size={20} />, label: 'Global Pool', visible: true }] : []),
      { id: 'profile', icon: <FiUser size={20} />, label: 'Profile', visible: true },
    ];

    return items.filter(item => item.visible);
  };

  const menuItems = getMenuItems();

  // Get icon color based on active state
  const getIconColor = (isActive) => {
    return isActive ? 'text-indigo-600' : 'text-gray-500';
  };

  return (
    <aside className={`
      ${sidebarCollapsed ? 'w-20' : 'w-64'}
      bg-white
      border-r border-gray-200
      h-[calc(100vh-4rem)]
      fixed
      transition-all
      duration-300
      overflow-y-auto
      shadow-sm
    `}>
      <div className="p-4">
        {/* Current Workplace Info */}
        {!sidebarCollapsed && currentWorkplace && (
          <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <FiBriefcase className="text-indigo-600" size={14} />
              </div>
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Current Workplace</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 truncate">{currentWorkplace.name}</p>
            {currentWorkplace.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{currentWorkplace.description}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <div className="px-2 py-1 bg-white rounded-lg border border-gray-100">
                <p className="text-xs text-gray-600">
                  Role: <span className="font-semibold text-indigo-600">{currentUserRole}</span>
                </p>
              </div>
            </div>
            {isMemberOnly && (
              <div className="mt-2 px-2 py-1 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <span>🔒</span> View-only access
                </p>
              </div>
            )}
          </div>
        )}

        {sidebarCollapsed && currentWorkplace && (
          <div className="mb-4 flex justify-center group relative">
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-indigo-300">
              <FiBriefcase className="text-indigo-600" size={18} />
            </div>
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
              {currentWorkplace.name}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                ${activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${sidebarCollapsed ? 'justify-center' : 'justify-start'}
              `}
            >
              {/* Active indicator */}
              {activeTab === item.id && (
                <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
              )}

              {/* Icon */}
              <div className={`
                transition-all duration-200
                ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'}
                group-hover:scale-105
                group-hover:text-indigo-500
              `}>
                {React.cloneElement(item.icon, {
                  size: 20,
                  className: `transition-colors duration-200`
                })}
              </div>

              {/* Label */}
              {!sidebarCollapsed && (
                <span className={`font-medium text-sm ${activeTab === item.id ? 'text-indigo-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Section */}
        {/* {!sidebarCollapsed && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
              <p>Workspace Manager</p>
              <p className="mt-1">v2.0.0</p>
            </div>
          </div>
        )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
