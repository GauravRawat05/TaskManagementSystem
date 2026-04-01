// components/UserCard.jsx
import React from 'react';
import { formatDate } from '../../lib/dateUtils';

const UserCard = ({ member, showJoinedDate = true, onRoleChange, isEditable = false }) => {

  // Get role-specific styling
  const getRoleStyles = (role) => {
    switch(role?.toUpperCase()) {
      case 'ADMIN':
        return {
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          avatar: 'from-purple-500 to-purple-600',
          dot: 'bg-purple-500'
        };
      case 'MANAGER':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          avatar: 'from-blue-500 to-blue-600',
          dot: 'bg-blue-500'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          avatar: 'from-gray-500 to-gray-600',
          dot: 'bg-gray-500'
        };
    }
  };

  // Get user initials for avatar
  const getInitials = () => {
    const name = member.user?.name || member.name || 'User';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user email
  const getUserEmail = () => {
    return member.user?.email || member.email || 'No email';
  };

  // Get user name
  const getUserName = () => {
    return member.user?.name || member.name || 'Unknown User';
  };

  // Get joined date
  const getJoinedDate = () => {
    const date = member.joinedAt || member.user?.joinedAt || member.createdAt;
    return date ? formatDate(date) : 'Recently';
  };

  const roleStyles = getRoleStyles(member.role);
  const initials = getInitials();
  const email = getUserEmail();
  const name = getUserName();
  const joinedDate = getJoinedDate();

  return (
    <div 
      onClick={() => member.onViewProfile?.(member)}
      className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        {/* Left section - Avatar and User Info */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${roleStyles.avatar} flex items-center justify-center text-white font-semibold text-lg shadow-sm`}>
              {initials}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {name}
              </h3>
              <div className={`w-2 h-2 rounded-full ${roleStyles.dot}`} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {email}
            </p>
          </div>
        </div>

        {/* Right section - Role Badge */}
        <div className="flex-shrink-0 ml-4">
          {isEditable ? (
            <select
              value={member.role}
              onChange={(e) => onRoleChange?.(member, e.target.value)}
              className={`px-3 py-1 text-xs font-medium rounded-full border ${roleStyles.badge} cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="MEMBER">MEMBER</option>
            </select>
          ) : (
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${roleStyles.badge}`}>
              {member.role}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      {showJoinedDate && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Joined {joinedDate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
