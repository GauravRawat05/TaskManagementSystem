import React, { useState, useCallback } from 'react';
import {
  FiUserPlus, FiLoader, FiMail, FiUpload, FiDownload, FiSearch,
  FiUserCheck, FiUsers, FiFilter, FiUser, FiBriefcase,
  FiPlus, FiTrash2, FiRefreshCw, FiCalendar, FiPhone,
  FiCheck, FiX, FiAlertCircle, FiInfo, FiEye, FiEyeOff,
  FiClock, FiCheckCircle, FiXCircle
} from 'react-icons/fi';

const GlobalPoolTab = ({
  globalUsers = [],
  newGlobalUser,
  setNewGlobalUser,
  addingGlobalUser,
  handleAddToGlobalPool,
  handleBulkAddUsers,
  showBulkUploadModal,
  setShowBulkUploadModal,
  selectedWorkplace,
  members = [],
  currentUserRole,
  isSuperuser,
  isAdmin,
  isManager,
  user,
  canInviteMembers,
  canManageMembers,
  onInviteToWorkspace,
  onRemoveFromWorkspace,
  onRefreshUsers,
  isLoadingUsers = false,
  projects = [],
  teams = [],
  handleAddMemberToTeam
}) => {
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [filterWorkspaceStatus, setFilterWorkspaceStatus] = useState('all');
  const [filterDomain, setFilterDomain] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Get unique domains from users
  const domains = [...new Set(globalUsers.map(u => u.domain).filter(Boolean))];

  // Check if a user is already a member of the current workspace
  const isWorkspaceMember = useCallback((userId) => {
    return members.some(member =>
      member.userId === userId || member._id === userId || member.user?._id === userId
    );
  }, [members]);

  // Filter users based on all criteria
  const filteredUsers = globalUsers.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.internId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterVerified === 'all' ||
                          (filterVerified === 'verified' && user.isEmailVerified) ||
                          (filterVerified === 'unverified' && !user.isEmailVerified);

    const isMember = isWorkspaceMember(user._id);
    const matchesWorkspaceStatus = filterWorkspaceStatus === 'all' ||
                                   (filterWorkspaceStatus === 'inWorkspace' && isMember) ||
                                   (filterWorkspaceStatus === 'notInWorkspace' && !isMember);

    const matchesDomain = filterDomain === 'all' || user.domain === filterDomain;

    return matchesSearch && matchesFilter && matchesWorkspaceStatus && matchesDomain;
  });

  const verifiedCount = globalUsers.filter(u => u.isEmailVerified).length;
  const unverifiedCount = globalUsers.filter(u => !u.isEmailVerified).length;
  const workspaceMemberCount = globalUsers.filter(u => isWorkspaceMember(u._id)).length;
  const newJoineesCount = globalUsers.filter(u => {
    if (!u.joiningDate) return false;
    const joiningDate = new Date(u.joiningDate);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return joiningDate >= threeMonthsAgo;
  }).length;

  const handleInviteToWorkspace = (userId) => {
    if (canInviteMembers) {
      setSelectedUsers([userId]);
      setShowAssignmentModal(true);
    }
  };

  const handleRemoveFromWorkspace = (userId) => {
    if (onRemoveFromWorkspace && canManageMembers) {
      onRemoveFromWorkspace(userId);
    }
  };

  const handleBulkInvite = () => {
    if (selectedUsers.length > 0 && canInviteMembers) {
      setShowAssignmentModal(true);
    }
  };

  const handleBulkSubmit = async ({ projectId }) => {
    if (selectedUsers.length > 0 && canInviteMembers) {
      for (const userId of selectedUsers) {
        if (!isWorkspaceMember(userId)) {
          await onInviteToWorkspace(userId);
        }
        
        // If a project is selected, also add them to that project's team
        if (projectId && handleAddMemberToTeam) {
            const team = teams.find(t => t.projectId === projectId);
            if (team) {
                await handleAddMemberToTeam(team._id, userId);
            }
        }
      }
      setSelectedUsers([]);
      setShowBulkActions(false);
      setShowAssignmentModal(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllFiltered = () => {
    const unselectedFiltered = filteredUsers
      .filter(user => !isWorkspaceMember(user._id))
      .map(user => user._id);
    setSelectedUsers(unselectedFiltered);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const AssignmentModal = () => {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!showAssignmentModal) return null;

    const onSubmit = async () => {
      setIsSubmitting(true);
      await handleBulkSubmit({ projectId: selectedProjectId });
      setIsSubmitting(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h3 className="text-xl font-bold text-gray-800">Assign Users to Workspace & Project</h3>
            <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-gray-600">
              <FiX size={20} />
            </button>
          </div>
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Target Workspace</label>
             <input type="text" disabled value="Current Workspace" className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
             <p className="text-xs text-gray-500 mt-1">Users will be added to the currently active workspace as members.</p>
          </div>
          <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 mb-1">Target Project / Team (Optional)</label>
             <select
               value={selectedProjectId}
               onChange={(e) => setSelectedProjectId(e.target.value)}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
             >
               <option value="">-- No specific project --</option>
               {projects.map(p => (
                 <option key={p._id} value={p._id}>{p.projectName}</option>
               ))}
             </select>
             <p className="text-xs text-gray-500 mt-1">If selected, users will also be added to the team associated with this project.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button
               disabled={isSubmitting}
               onClick={() => setShowAssignmentModal(false)}
               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
               disabled={isSubmitting}
               onClick={onSubmit}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              {isSubmitting ? <FiLoader className="animate-spin" /> : 'Confirm Assignment'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Global User Pool</h1>
              <p className="text-gray-500 mt-1">Manage and add users to your organization's global directory</p>
            </div>
            <div className="flex items-center gap-3">
              {onRefreshUsers && (
                <button
                  onClick={onRefreshUsers}
                  disabled={isLoadingUsers}
                  className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FiRefreshCw className={`text-gray-600 ${isLoadingUsers ? 'animate-spin' : ''}`} size={18} />
                </button>
              )}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <FiUsers className="text-blue-500" size={18} />
                <span className="text-sm font-medium text-gray-700">
                  {globalUsers.length} Total
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <FiBriefcase className="text-green-500" size={18} />
                <span className="text-sm font-medium text-gray-700">
                  {workspaceMemberCount} in Workspace
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FiUserPlus className="text-white" />
                  Add New User
                </h3>
                <p className="text-blue-100 text-sm mt-1">Add users individually or in bulk</p>
              </div>

              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleAddToGlobalPool(newGlobalUser); }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newGlobalUser.name}
                        onChange={(e) => setNewGlobalUser({ ...newGlobalUser, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="user@example.com"
                        value={newGlobalUser.email}
                        onChange={(e) => setNewGlobalUser({ ...newGlobalUser, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+1 234 567 8900"
                        value={newGlobalUser.phone}
                        onChange={(e) => setNewGlobalUser({ ...newGlobalUser, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Domain/Department</label>
                      <input
                        type="text"
                        placeholder="e.g., Engineering, Marketing"
                        value={newGlobalUser.domain}
                        onChange={(e) => setNewGlobalUser({ ...newGlobalUser, domain: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Intern ID</label>
                      <input
                        type="text"
                        placeholder="Optional"
                        value={newGlobalUser.internId}
                        onChange={(e) => setNewGlobalUser({ ...newGlobalUser, internId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingGlobalUser}
                      className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2.5 rounded-lg hover:from-black hover:to-gray-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingGlobalUser ? (
                        <FiLoader className="animate-spin mx-auto" size={20} />
                      ) : (
                        'Add to Global Pool'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBulkUploadModal(true)}
                    className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <FiUpload size={18} />
                    Bulk Upload CSV
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Format: Name, Email, Phone, Domain, Intern ID
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <FiMail className="text-green-500" size={20} />
                  <span className="text-xs text-gray-400">Verified</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{verifiedCount}</div>
                <div className="text-xs text-gray-500 mt-1">Email verified users</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <FiClock className="text-orange-500" size={20} />
                  <span className="text-xs text-gray-400">Pending</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{unverifiedCount}</div>
                <div className="text-xs text-gray-500 mt-1">Awaiting verification</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <FiCalendar className="text-blue-500" size={20} />
                  <span className="text-xs text-gray-400">New Joinees</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{newJoineesCount}</div>
                <div className="text-xs text-gray-500 mt-1">Last 3 months</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <FiBriefcase className="text-purple-500" size={20} />
                  <span className="text-xs text-gray-400">Domains</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{domains.length}</div>
                <div className="text-xs text-gray-500 mt-1">Departments</div>
              </div>
            </div>
          </div>

          {/* Right Column - User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">User Directory</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {filteredUsers.length} users found
                      {selectedUsers.length > 0 && ` • ${selectedUsers.length} selected`}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search by name, email, ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48 sm:w-64"
                      />
                    </div>

                    <select
                      value={filterVerified}
                      onChange={(e) => setFilterVerified(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="verified">Verified Only</option>
                      <option value="unverified">Unverified Only</option>
                    </select>

                    <select
                      value={filterWorkspaceStatus}
                      onChange={(e) => setFilterWorkspaceStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Users</option>
                      <option value="inWorkspace">In Workspace</option>
                      <option value="notInWorkspace">Not in Workspace</option>
                    </select>

                    {domains.length > 0 && (
                      <select
                        value={filterDomain}
                        onChange={(e) => setFilterDomain(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Domains</option>
                        {domains.map(domain => (
                          <option key={domain} value={domain}>{domain}</option>
                        ))}
                      </select>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <FiUsers size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                      >
                        <FiFilter size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiInfo className="text-blue-600" size={16} />
                      <span className="text-sm text-blue-800">{selectedUsers.length} users selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBulkInvite}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Invite Selected to Workspace
                      </button>
                      <button
                        onClick={clearSelection}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User List/Grid */}
              {globalUsers && globalUsers.length > 0 ? (
                <>
                  <div className={`divide-y divide-gray-100 max-h-[600px] overflow-y-auto ${viewMode === 'grid' ? 'p-6' : ''}`}>
                    {filteredUsers.length > 0 ? (
                      viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredUsers.map((user) => {
                            const isMember = isWorkspaceMember(user._id);
                            const isSelected = selectedUsers.includes(user._id);

                            return (
                              <div
                                key={user._id}
                                className={`border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                onClick={() => toggleUserSelection(user._id)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                                      user.isEmailVerified
                                        ? 'bg-gradient-to-br from-green-500 to-green-600'
                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                    }`}>
                                      {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                      <p className="text-xs text-gray-500">{user.email}</p>
                                      {user.internId && (
                                        <p className="text-xs text-gray-400 mt-1">ID: {user.internId}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {user.isEmailVerified ? (
                                      <FiCheckCircle className="text-green-500" size={16} />
                                    ) : (
                                      <FiXCircle className="text-gray-400" size={16} />
                                    )}
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleUserSelection(user._id);
                                      }}
                                      className="w-4 h-4 rounded border-gray-300"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                                  {user.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FiPhone size={12} />
                                      <span>{user.phone}</span>
                                    </div>
                                  )}
                                  {user.domain && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FiBriefcase size={12} />
                                      <span>{user.domain}</span>
                                    </div>
                                  )}
                                  {user.joiningDate && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <FiCalendar size={12} />
                                      <span>Joined: {formatDate(user.joiningDate)}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                  {!isMember ? (
                                    canInviteMembers && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInviteToWorkspace(user._id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                                      >
                                        <FiPlus size={12} />
                                        Invite
                                      </button>
                                    )
                                  ) : (
                                    canManageMembers && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFromWorkspace(user._id);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                      >
                                        <FiTrash2 size={12} />
                                        Remove
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // List View
                        filteredUsers.map((user) => {
                          const isMember = isWorkspaceMember(user._id);
                          const isSelected = selectedUsers.includes(user._id);

                          return (
                            <div
                              key={user._id}
                              className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                              onClick={() => toggleUserSelection(user._id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      toggleUserSelection(user._id);
                                    }}
                                    className="w-4 h-4 rounded border-gray-300"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm ${
                                      user.isEmailVerified
                                        ? 'bg-gradient-to-br from-green-500 to-green-600'
                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                    }`}>
                                      {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.name}
                                      </p>
                                      {user.isEmailVerified ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                          Verified
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                          Pending
                                        </span>
                                      )}
                                      {user.domain && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                          {user.domain}
                                        </span>
                                      )}
                                      {user.internId && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-600">
                                          {user.internId}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <FiMail className="text-gray-400" size={12} />
                                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <FiPhone className="text-gray-400" size={12} />
                                        <p className="text-xs text-gray-400">{user.phone}</p>
                                      </div>
                                    )}
                                    {user.joiningDate && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <FiCalendar className="text-gray-400" size={12} />
                                        <p className="text-xs text-gray-400">Joined: {formatDate(user.joiningDate)}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  {!isMember ? (
                                    canInviteMembers && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleInviteToWorkspace(user._id);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                                      >
                                        <FiPlus size={14} />
                                        Invite
                                      </button>
                                    )
                                  ) : (
                                    canManageMembers && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRemoveFromWorkspace(user._id);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                      >
                                        <FiTrash2 size={14} />
                                        Remove
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <FiSearch className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-500">No users found matching your search</p>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Showing {filteredUsers.length} of {globalUsers.length} users
                      </span>
                      {selectedUsers.length > 0 && (
                        <button
                          onClick={selectAllFiltered}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Select All Uninvited
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <FiUsers className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500">No users in global pool yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first user using the form on the left</p>
                </div>
              )}
            </div>

            {/* Quick Tip Card */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiDownload className="text-blue-600" size={16} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">Quick Tip</h4>
                  <p className="text-xs text-gray-600">
                    Users added to the global pool can be invited to workspaces.
                    {canManageMembers && " You can manage workspace memberships by inviting or removing users."}
                    Use bulk upload to add multiple users at once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AssignmentModal />
    </div>
  );
};

export default GlobalPoolTab;
