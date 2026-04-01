import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiUsers,
  FiFolder,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiAlertCircle,
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiEye,
  FiBarChart2,
  FiList,
  FiX // Added FiX here
} from 'react-icons/fi';

import { Link } from 'react-router-dom';

const Dashboard = ({
  selectedWorkplace,
  workplaces,
  projects,
  teams,
  members,
  user,
  userRole,
  currentUserRole,
  isSuperuser,
  canCreateWorkplace,
  canInviteMembers,
  canCreateProject,
  canCreateTeam,
  formatDate,
  daysLeft,
  setSelectedWorkplace,
  setShowCreateWorkplaceModal,
  setShowCreateProjectModal,
  setShowCreateTeamModal,
  setShowInviteModal,
  setShowDeleteWorkplaceModal,
  handleDeleteProject,
  handleUpdateProjectDeadline,
  ...props
}) => {
  const [showWorkplaceDropdown, setShowWorkplaceDropdown] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTeams: 0,
    totalMembers: 0,
    pendingTasks: 0,
    upcomingDeadlines: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  // Check if user has admin/manager permissions (using correct spelling)
  const hasManagementAccess = currentUserRole === "MANAGER" || currentUserRole === "ADMIN" || isSuperuser;

  // Check if user can create workspace (admin or superuser)
  const canCreateWorkplaceAccess = currentUserRole === "ADMIN" || isSuperuser;

  // Check if user can create/edit/delete (management actions)
  const canManage = hasManagementAccess;

  // Check if user can view but not modify (member view)
  const isMemberOnly = !hasManagementAccess && !isSuperuser;

  // Show for ADMIN, SUPERUSER, or if explicitly allowed. Managers can invite members per new RBAC rule.
  const canInviteMembersAccess = currentUserRole === "MANAGER" || currentUserRole === "ADMIN" || isSuperuser || canInviteMembers;

  // Calculate statistics
  useEffect(() => {
    if (projects && projects.length > 0) {
      const total = projects.length;
      const active = projects.filter(p => new Date(p.deadline) > new Date()).length;
      const completed = projects.filter(p => p.status === 'completed' || new Date(p.deadline) < new Date()).length;

      setStats(prev => ({
        ...prev,
        totalProjects: total,
        activeProjects: active,
        completedProjects: completed,
        totalTeams: teams?.length || 0,
        totalMembers: members?.length || 0
      }));

      // Get recent projects (last 5)
      const recent = [...projects]
        .sort((a, b) => new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate))
        .slice(0, 5);
      setRecentProjects(recent);

      // Get upcoming deadlines (next 7 days)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = projects
        .filter(p => {
          const deadline = new Date(p.deadline);
          return deadline > today && deadline <= nextWeek;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setUpcomingDeadlines(upcoming);
    }
  }, [projects, teams, members]);

  // Stat cards data
  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FiFolder,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/projects',
      viewOnly: true
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: FiTrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/projects?status=active',
      viewOnly: true
    },
    {
      title: 'Teams',
      value: stats.totalTeams,
      icon: FiUsers,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/teams',
      viewOnly: true
    },
    {
      title: 'Team Members',
      value: stats.totalMembers,
      icon: FiUsers,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/members',
      viewOnly: true
    },
    {
      title: 'Completed Projects',
      value: stats.completedProjects,
      icon: FiCheckCircle,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      link: '/projects?status=completed',
      viewOnly: true
    },
    {
      title: 'Upcoming Deadlines',
      value: upcomingDeadlines.length,
      icon: FiCalendar,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      link: '/deadlines',
      viewOnly: true
    }
  ];

  // Quick action buttons - only show for managers/admins
  const quickActions = [
    {
      label: 'Create Project',
      icon: FiPlus,
      onClick: () => setShowCreateProjectModal(true),
      visible: canManage && canCreateProject,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'Invite Members',
      icon: FiUsers,
      onClick: () => setShowInviteModal(true),
      visible: canManage && canInviteMembersAccess, // UPDATED: Use the new access control
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'Create Team',
      icon: FiUsers,
      onClick: () => setShowCreateTeamModal(true),
      visible: canManage && canCreateTeam,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ].filter(action => action.visible);

  // Filter stat cards based on user request
  const filteredStatCards = statCards.filter(stat => 
    !['Active Projects', 'Team Members', 'Upcoming Deadlines'].includes(stat.title)
  );

  // Member view actions (view-only buttons)
  const memberActions = [
    {
      label: 'View Projects',
      icon: FiFolder,
      link: '/projects',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      label: 'View Teams',
      icon: FiUsers,
      link: '/teams',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: 'View Tasks',
      icon: FiList,
      link: '/tasks',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      label: 'My Profile',
      icon: FiEye,
      link: '/profile',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  // Get deadline status color
  const getDeadlineStatus = (deadline) => {
    const days = daysLeft(deadline);
    if (days === null) return 'text-gray-500';
    if (days < 0) return 'text-red-600';
    if (days <= 3) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getDeadlineIcon = (deadline) => {
    const days = daysLeft(deadline);
    if (days === null) return FiClock;
    if (days < 0) return FiAlertCircle;
    if (days <= 3) return FiAlertCircle;
    return FiClock;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Workplace Switcher */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {(() => {
                const hour = new Date().getHours();
                let greeting = '';
                if (hour < 12) greeting = 'Good morning';
                else if (hour < 18) greeting = 'Good afternoon';
                else greeting = 'Good evening';

                return `${greeting}, ${user?.name || user?.email?.split('@')[0] || 'User'}!`;
              })()}
            </h1>
            <p className="text-gray-500">
              {isSuperuser
                ? 'You have superuser access to manage all workplaces.'
                : canManage
                ? `You are logged in as ${currentUserRole?.toUpperCase() || "MANAGER"}. You can manage projects, teams, and members.`
                : `You are logged in as a Team Member. You can view projects, teams, and your tasks.`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Different for Managers/Admins vs Members */}
      {canManage && quickActions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all ${action.color} shadow-sm hover:shadow-md`}
              >
                <action.icon size={18} />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Member View - Quick Navigation */}
      {isMemberOnly && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-3">
            {memberActions.map((action, index) => (
              <Link key={index} to={`/workspace/${selectedWorkplace}${action.link}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all ${action.color} shadow-sm hover:shadow-md`}
                >
                  <action.icon size={18} />
                  <span>{action.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Grid - Clickable for both roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStatCards.map((stat, index) => {
          const Icon = stat.icon;
          const StatContent = (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`${stat.textColor} w-5 h-5`} />
                </div>
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
            </motion.div>
          );

          return stat.link ? (
            <Link key={index} to={`/workspace/${selectedWorkplace}${stat.link}`}>
              {StatContent}
            </Link>
          ) : (
            <div key={index}>{StatContent}</div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
            {canManage && canCreateProject ? (
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + New Project
              </button>
            ) : (
              <Link to={`/workspace/${selectedWorkplace}/projects`} className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            )}
          </div>

          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <Link key={project._id} to={`/workspace/${selectedWorkplace}/projects`}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-100 rounded-lg p-3 hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{project.projectName}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {project.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Start: {formatDate(project.startDate)}</span>
                          <span>Deadline: {formatDate(project.deadline)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          new Date(project.deadline) > new Date() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {new Date(project.deadline) > new Date() ? 'Active' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiFolder className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No projects yet</p>
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Deadlines</h2>

          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((project, index) => {
                const DeadlineIcon = getDeadlineIcon(project.deadline);
                const daysRemaining = daysLeft(project.deadline);
                return (
                  <Link key={project._id} to={`/workspace/${selectedWorkplace}/projects`}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border rounded-xl p-4 transition-all cursor-pointer ${
                        daysRemaining !== null && daysRemaining <= 3
                          ? 'bg-red-50 border-red-100 hover:bg-red-100 shadow-sm shadow-red-50'
                          : 'bg-white border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800">{project.projectName}</h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <DeadlineIcon className={`w-4 h-4 ${getDeadlineStatus(project.deadline)}`} />
                            <span className={`text-sm font-bold ${getDeadlineStatus(project.deadline)}`}>
                              {daysRemaining !== null && (
                                daysRemaining < 0
                                  ? `Overdue by ${Math.abs(daysRemaining)} days`
                                  : `${daysRemaining} days remaining`
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Deadline: {formatDate(project.deadline)}
                          </p>
                        </div>
                        {canManage && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              props.setShowEditDeadlineModal?.(project);
                            }}
                            className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">All caught up!</p>
              <p className="text-sm text-gray-400">No urgent deadlines approaching</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Overview */}
        {teams && teams.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Teams</h2>
              {canManage && canCreateTeam ? (
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + New Team
                </button>
              ) : (
                <Link to={`/workspace/${selectedWorkplace}/teams`} className="text-sm text-blue-600 hover:text-blue-700">
                  View All →
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.slice(0, 4).map((team, index) => (
                <Link key={team._id} to={`/workspace/${selectedWorkplace}/teams`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-purple-200 hover:bg-purple-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{team.teamName}</h3>
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                        <FiUsers className="text-indigo-600 w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {(team.team?.length || 0)} members
                    </p>
                    {team.teamLeader && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                          {team.teamLeader.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-600 font-medium truncate">Lead: {team.teamLeader.name}</span>
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Members */}
        {members && members.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Members</h2>
              <Link to={`/workspace/${selectedWorkplace}/members`} className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {members.slice(0, 10).map((member, index) => (
                <Link key={member._id} to={`/workspace/${selectedWorkplace}/members`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center gap-2 min-w-[80px]"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-indigo-100">
                      {member.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 truncate max-w-[80px]">{member.name}</p>
                  </motion.div>
                </Link>
              ))}
            </div>

            {members.length > 10 && (
              <div className="text-center mt-6">
                <Link to={`/workspace/${selectedWorkplace}/members`} className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  + {members.length - 10} more members
                </Link>
              </div>
            )}
          </div>
        )}
      </div>



      {/* Empty State for No Workplace Selected */}
      {!selectedWorkplace && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Workplace Selected</h3>
          <p className="text-gray-500 mb-4">Select a workplace from the dropdown above or create a new one to get started.</p>
          {canManage && canCreateWorkplaceAccess && (
            <button
              onClick={() => setShowCreateWorkplaceModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Workplace
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
