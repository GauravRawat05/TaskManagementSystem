import React from 'react';
import { FiPlus, FiUsers, FiEdit2, FiTrash2, FiUserPlus, FiUserMinus, FiUserX } from 'react-icons/fi';
import { TfiCrown } from "react-icons/tfi";

const TeamsTab = ({
  teams,
  projects,
  availableUsers,
  setShowCreateTeamModal,
  handleDeleteTeam,
  handleAddMemberToTeam,
  handleRemoveTeamMember,
  handleSetTeamLeader,
  handleRemoveTeamLeaderAndAddToTeam,
  showEditTeamModal,
  setShowEditTeamModal,
  showAddMemberModal,
  setShowAddMemberModal,
  isMemberOnly,
  canCreateTeam,
  canManageTeams
}) => {
  // Helper function to get team members from the team array
  const getTeamMembers = (team) => {
    const rawMembers = team.team || [];
    return rawMembers.map(member => {
      // If member is already an object (populated by backend)
      if (member && typeof member === 'object' && member.name) {
        return member;
      }
      // Otherwise look it up in availableUsers
      const userId = typeof member === 'object' ? member._id : member;
      const user = availableUsers?.find(u => u._id === userId);
      return user || { _id: userId, name: 'Loading...', email: '' };
    });
  };

  // Helper function to get team leader details
  const getTeamLeader = (team, members) => {
    const leader = team.teamLeader;
    if (!leader) return null;
    
    // If leader is already an object (populated by backend)
    if (typeof leader === 'object' && leader.name) {
      return leader;
    }
    
    // Otherwise look it up in availableUsers
    const leaderId = typeof leader === 'object' ? leader._id : leader;
    const leaderUser = availableUsers?.find(u => u._id === leaderId);
    return leaderUser || { _id: leaderId, name: 'Loading...', email: '' };
  };

  // Helper function to get project name from projectId
  const getProjectName = (team) => {
    if (team.projectName) return team.projectName;
    if (team.project?.projectName) return team.project.projectName;
    // Find project from projects list using projectId
    const project = projects?.find(p => p._id === team.projectId);
    return project?.projectName || 'N/A';
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Check if user can manage this specific team
  const canManageTeam = (team, userCanManage) => {
    if (!userCanManage) return false;
    // Add any additional team-specific permission checks here if needed
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
          <p className="text-gray-500 text-sm">{teams?.length || 0} teams in this workspace</p>
        </div>
        {canCreateTeam && !isMemberOnly && (
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiPlus size={18} />
            New Team
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams?.map((team) => {
          const members = getTeamMembers(team);
          const teamLeader = getTeamLeader(team, members);
          const memberCount = members.length;
          const userCanManage = canManageTeam(team, canManageTeams && !isMemberOnly);
          const projectName = getProjectName(team);

          return (
            <div key={team._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiUsers className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-1">{team.teamName}</h3>
                      <p className="text-xs text-gray-500">Created {formatDate(team.createdAt)}</p>
                    </div>
                  </div>
                  {userCanManage && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setShowEditTeamModal(team)}
                        className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                        title="Edit Team"
                      >
                        <FiEdit2 size={14} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team._id, team.teamName)}
                        className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                        title="Delete Team"
                      >
                        <FiTrash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                {/* Team Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-medium text-gray-700 truncate ml-2">{projectName}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <TfiCrown size={12} className="text-yellow-500" />
                      Team Leader:
                    </span>
                    <span className="font-medium text-gray-700 truncate ml-2">
                      {teamLeader?.name || 'Not assigned'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Members:</span>
                    <span className="font-medium text-gray-700">{memberCount}</span>
                  </div>
                </div>

                {/* Action Buttons - Only show for managers/admins */}
                {userCanManage && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddMemberModal(team)}
                      className="w-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <FiUserPlus size={14} /> Add Member
                    </button>
                  </div>
                )}

                {/* Members List */}
                {members.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Team Members ({members.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {members.map(member => (
                        <div
                          key={member._id}
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                            teamLeader?._id === member._id ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-800 truncate">{member.name}</p>
                              {teamLeader?._id === member._id && (
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <TfiCrown size={10} /> Leader
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                            {member.domain && (
                              <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                {member.domain}
                              </span>
                            )}
                          </div>
                          {userCanManage && (
                            <div className="flex gap-1 ml-2">
                              {teamLeader?._id !== member._id && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Set ${member.name} as team leader?`)) {
                                      handleSetTeamLeader(team._id, member._id);
                                    }
                                  }}
                                  className="p-1.5 hover:bg-yellow-100 rounded-lg transition-colors"
                                  title="Set as Team Leader"
                                >
                                  <TfiCrown size={12} className="text-yellow-500" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveTeamMember(team._id, member._id, member.name)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Member"
                              >
                                <FiUserMinus size={12} className="text-red-500" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty Members State */}
                {members.length === 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-center py-4">
                    <p className="text-sm text-gray-500">No members yet</p>
                    {userCanManage && (
                      <button
                        onClick={() => setShowAddMemberModal(team)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
                      >
                        <FiUserPlus size={14} /> Add first member
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {(!teams || teams.length === 0) && (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No teams found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first team to get started</p>
            {canCreateTeam && !isMemberOnly && (
              <button
                onClick={() => setShowCreateTeamModal(true)}
                className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiPlus size={16} />
                Create Team
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsTab;
