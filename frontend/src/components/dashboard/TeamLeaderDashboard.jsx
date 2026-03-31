import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus, FiCalendar, FiClock, FiCheck, FiX, FiUsers, FiList, FiFileText,
  FiHome, FiFolder, FiUser, FiBarChart2, FiTrendingUp, FiCheckCircle,
  FiAlertCircle, FiChevronRight, FiSearch, FiLogOut, FiMenu,
  FiAward, FiTarget, FiActivity, FiBriefcase, FiLoader,
  FiEdit2, FiSave, FiCamera, FiLock, FiPhone, FiShield, FiMail, FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils';
import {
  getTeams,
  getProjects,
  getWorkspaceById,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTeamReports,
  loggedOutUser,
  changeCurrentPassword,
  updateUserProfile,
  updateUserAvatar
} from '../../api';

const TeamLeaderDashboard = () => {
  const { workspaceId } = useParams();
  const { user, setUser, logout } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [projects, setProjects] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);

  // UI
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '', assignedTo: '', dueDate: '', description: '', remark: ''
  });

  // Profile
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', domain: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Initialize form data
  useEffect(() => {
    if (user) {
      setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', domain: user?.domain || '', bio: user?.bio || '' });
    }
  }, [user]);

  // Load workspace data
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getWorkspaceById({ workspaceId }),
      setLoading,
      (res) => setWorkspace(res.data || res),
      (err) => console.error("Failed to load workspace", err)
    );
  }, [workspaceId]);

  // Load teams
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getTeams({ workspaceId }),
      setLoading,
      (res) => {
        const all = res.data || res;
        setAllTeams(all);
        const ledTeams = all.filter(t => t.teamLeader?._id === user._id || t.teamLeader === user._id);
        setTeams(ledTeams);
        if (ledTeams.length > 0 && !selectedTeam) setSelectedTeam(ledTeams[0]);
      },
      (err) => console.error("Failed to load teams", err)
    );
  }, [workspaceId, user._id]);

  // Load projects
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getProjects({ workspaceId }),
      setLoading,
      (res) => {
        const allProjects = res.data || res;
        // Filter to only projects that my teams are assigned to
        const myProjectIds = teams.map(t => t.projectId?._id || t.projectId).filter(Boolean);
        const myProjects = allProjects.filter(p => myProjectIds.includes(p._id));
        setProjects(myProjects.length > 0 ? myProjects : allProjects);
      },
      (err) => console.error("Failed to load projects", err)
    );
  }, [workspaceId, teams]);

  // Load tasks
  const loadTasks = useCallback(() => {
    if (!selectedTeam) return;
    requestHandler(
      () => getTasks({ teamId: selectedTeam._id }),
      setLoading,
      (res) => setTasks(res.data || res),
      (err) => console.error("Failed to load tasks", err)
    );
  }, [selectedTeam]);

  // Load reports
  const loadReports = useCallback(() => {
    if (!selectedTeam) return;
    requestHandler(
      () => getTeamReports(selectedTeam._id, {}),
      setLoading,
      (res) => setReports(res.data || res),
      (err) => console.error("Failed to load reports", err)
    );
  }, [selectedTeam]);

  useEffect(() => {
    if (activeTab === 'tasks') loadTasks();
    else if (activeTab === 'reports') loadReports();
  }, [activeTab, loadTasks, loadReports]);

  // Tasks handlers
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    const payload = {
      ...taskForm,
      projectId: selectedTeam.projectId?._id || selectedTeam.projectId,
      teamId: selectedTeam._id
    };
    requestHandler(
      () => createTask(payload),
      setLoading,
      (res) => {
        setTasks(prev => [res.data || res, ...prev]);
        setShowTaskModal(false);
        setTaskForm({ title: '', assignedTo: '', dueDate: '', description: '', remark: '' });
        showToast('Task assigned successfully!');
      },
      (err) => console.error("Failed to create task", err)
    );
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    requestHandler(
      () => updateTask(taskId, { status }),
      setLoading,
      () => setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t)),
      (err) => console.error("Failed to update status", err)
    );
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    requestHandler(
      () => deleteTask(taskId),
      setLoading,
      () => {
        setTasks(prev => prev.filter(t => t._id !== taskId));
        showToast('Task deleted');
      },
      (err) => console.error("Failed to delete task", err)
    );
  };

  // Profile handlers
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    requestHandler(
      () => updateUserProfile(formData),
      setProfileLoading,
      (response) => {
        setUser(response?.data || response);
        setIsEditing(false);
        showToast('Profile updated successfully! ✨');
      },
      (error) => showToast(error?.message || 'Failed to update profile', 'error')
    );
  };

  const handleAvatarUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const avatarFormData = new FormData();
    avatarFormData.append('avatar', file);
    requestHandler(
      () => updateUserAvatar(avatarFormData),
      setAvatarLoading,
      (response) => { setUser(response?.data || response); showToast('Avatar updated! 📸'); },
      (error) => showToast(error?.message || 'Failed to update avatar', 'error')
    );
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (passwordData.newPassword.length < 6) { showToast('Password must be at least 6 characters long', 'error'); return; }
    requestHandler(
      () => changeCurrentPassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      setProfileLoading,
      () => { setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setIsChangingPassword(false); showToast('Password changed! 🔒'); },
      (error) => showToast(error?.message || 'Failed to change password', 'error')
    );
  };

  const handleLogout = () => {
    requestHandler(
      () => loggedOutUser(),
      setLoading,
      () => { logout(); window.location.href = '/login'; },
      (err) => console.error("Logout failed", err)
    );
  };

  // Helpers
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const dl = new Date(deadline); dl.setHours(0, 0, 0, 0);
    return Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
  };

  const getAvatarUrl = (u) => {
    const name = u?.name || 'User';
    if (u?.avatar) return u.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff&size=150&bold=true`;
  };

  // All team members from my teams
  const allMyMembers = teams.reduce((acc, t) => {
    const members = t.team || [];
    members.forEach(m => {
      const id = m._id || m;
      if (!acc.find(x => (x._id || x) === id)) { acc.push(m); }
    });
    return acc;
  }, []);

  // Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Sidebar menu
  const menuItems = [
    { id: 'dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { id: 'projects', icon: <FiFolder size={20} />, label: 'Projects' },
    { id: 'myteams', icon: <FiUsers size={20} />, label: 'My Teams' },
    { id: 'members', icon: <FiAward size={20} />, label: 'Members' },
    { id: 'tasks', icon: <FiList size={20} />, label: 'Tasks' },
    { id: 'reports', icon: <FiFileText size={20} />, label: 'Daily Reports' },
    { id: 'profile', icon: <FiUser size={20} />, label: 'Profile' },
  ];

  if (!teams.length && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <FiUsers className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Teams Managed</h2>
          <p className="text-gray-500">You are not currently assigned as a Team Leader to any teams in this workspace.</p>
          <button onClick={handleLogout} className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all flex items-center gap-2 mx-auto">
            <FiLogOut /> Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ────────────────────────────────── */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 overflow-y-auto shadow-sm z-40`}>
        <div className="p-4">
          {/* Workspace info */}
          {!sidebarCollapsed && (
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <FiBriefcase className="text-indigo-600" size={14} />
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Workspace</span>
              </div>
              <p className="text-sm font-bold text-gray-800 truncate">{workspace?.name || 'Loading...'}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Team Leader</span>
              </div>
            </div>
          )}

          {sidebarCollapsed && (
            <div className="mb-4 flex justify-center group relative">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-indigo-600" size={18} />
              </div>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {workspace?.name}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => { setActiveTab(item.id); if (item.id === 'tasks') loadTasks(); if (item.id === 'reports') loadReports(); }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
              >
                {activeTab === item.id && <div className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full" />}
                <div className={`transition-all duration-200 ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'} group-hover:text-indigo-500`}>
                  {item.icon}
                </div>
                {!sidebarCollapsed && (
                  <span className={`font-medium text-sm ${activeTab === item.id ? 'text-indigo-700' : 'text-gray-600'}`}>{item.label}</span>
                )}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-all w-full ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <FiLogOut size={20} />
              {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────── */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiMenu size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Team Leader Dashboard</h1>
                <p className="text-xs text-gray-500">{menuItems.find(i => i.id === activeTab)?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Team Selector */}
              {teams.length > 1 && (
                <select
                  value={selectedTeam?._id || ''}
                  onChange={(e) => setSelectedTeam(teams.find(t => t._id === e.target.value))}
                  className="rounded-xl border border-gray-200 bg-gray-50 text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                >
                  {teams.map(t => <option key={t._id} value={t._id}>{t.teamName}</option>)}
                </select>
              )}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <img src={getAvatarUrl(user)} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100" />
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* ─── DASHBOARD TAB ──────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-1">
                  {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {user?.name?.split(' ')[0] || 'Leader'}!
                </h2>
                <p className="text-indigo-100 text-sm">
                  You're leading <strong>{teams.length}</strong> team{teams.length > 1 ? 's' : ''} in <strong>{workspace?.name || 'this workspace'}</strong>
                </p>
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'My Teams', value: teams.length, icon: FiUsers, color: 'indigo' },
                  { label: 'Total Tasks', value: totalTasks, icon: FiTarget, color: 'blue' },
                  { label: 'In Progress', value: inProgressTasks, icon: FiActivity, color: 'amber' },
                  { label: 'Completion', value: `${completionRate}%`, icon: FiCheckCircle, color: 'emerald' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                        <stat.icon className={`text-${stat.color}-600 w-5 h-5`} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Two-column: My Teams + Recent Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Teams */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FiUsers className="text-indigo-500" /> My Teams</h3>
                  <div className="space-y-3">
                    {teams.map(team => (
                      <div key={team._id} onClick={() => { setSelectedTeam(team); setActiveTab('tasks'); loadTasks(); }}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all">
                        <div>
                          <h4 className="font-semibold text-gray-800">{team.teamName}</h4>
                          <p className="text-xs text-gray-500">{team.projectId?.projectName || 'No Project'} · {team.team?.length || 0} members</p>
                        </div>
                        <FiChevronRight className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Task Progress */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FiBarChart2 className="text-indigo-500" /> Task Progress</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'To Do', count: todoTasks, color: 'yellow', pct: totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0 },
                      { label: 'In Progress', count: inProgressTasks, color: 'blue', pct: totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0 },
                      { label: 'Done', count: doneTasks, color: 'emerald', pct: totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0 },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="text-gray-600">{s.label}</span>
                          <span className="text-gray-800 font-bold">{s.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8 }}
                            className={`bg-${s.color}-500 h-full rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalTasks === 0 && <p className="text-center text-gray-400 text-sm mt-4">No tasks yet. Select a team and assign tasks!</p>}
                </div>
              </div>
            </div>
          )}

          {/* ─── PROJECTS TAB ───────────────────── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                  <p className="text-sm text-gray-500 mt-1">Projects associated with your teams</p>
                </div>
              </div>
              {projects.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                  <FiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Projects Found</h3>
                  <p className="text-gray-500">Your teams haven't been assigned to any projects yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project, idx) => {
                    const days = daysLeft(project.deadline);
                    const isOverdue = days !== null && days < 0;
                    const isUrgent = days !== null && days >= 0 && days <= 3;
                    return (
                      <motion.div key={project._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-gray-800">{project.projectName}</h4>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-700' : isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isOverdue ? 'Overdue' : isUrgent ? 'Urgent' : 'Active'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{project.description || 'No description'}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FiCalendar size={12} /> Start: {formatDate(project.startDate)}</span>
                          <span className="flex items-center gap-1"><FiClock size={12} /> Due: {formatDate(project.deadline)}</span>
                        </div>
                        {days !== null && (
                          <div className={`mt-3 text-xs font-bold ${isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {isOverdue ? `Overdue by ${Math.abs(days)} days` : `${days} days remaining`}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── MY TEAMS TAB ───────────────────── */}
          {activeTab === 'myteams' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Teams</h2>
                <p className="text-sm text-gray-500 mt-1">Teams you lead in this workspace</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team, idx) => (
                  <motion.div key={team._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{team.teamName}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiFolder size={12} /> {team.projectId?.projectName || 'No Project'}</p>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Leader</span>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Team Members ({team.team?.length || 0})</p>
                      <div className="space-y-2">
                        {(team.team || []).slice(0, 5).map(member => (
                          <div key={member._id || member} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                            <img src={getAvatarUrl(member)} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{member.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{member.email || ''}</p>
                            </div>
                          </div>
                        ))}
                        {(team.team?.length || 0) > 5 && (
                          <p className="text-xs text-indigo-600 font-semibold text-center pt-2">+{team.team.length - 5} more members</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ─── MEMBERS TAB ────────────────────── */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
                <p className="text-sm text-gray-500 mt-1">{allMyMembers.length} members across your teams</p>
              </div>
              {allMyMembers.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Members Yet</h3>
                  <p className="text-gray-500">Your teams don't have any members assigned.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allMyMembers.map((member, idx) => (
                    <motion.div key={member._id || member} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all text-center">
                      <img src={getAvatarUrl(member)} alt="" className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-indigo-100 mb-3" />
                      <h4 className="font-bold text-gray-800 truncate">{member.name || 'Unknown'}</h4>
                      <p className="text-xs text-gray-500 truncate">{member.email || ''}</p>
                      {member.domain && <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full">{member.domain}</span>}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TASKS TAB ──────────────────────── */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Team Tasks</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTeam?.teamName || 'Select a team'} · {selectedTeam?.projectId?.projectName || 'No Project'}
                  </p>
                </div>
                <button onClick={() => setShowTaskModal(true)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm font-medium">
                  <FiPlus /> Assign New Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <FiList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Tasks Assigned</h3>
                  <p className="text-gray-500">Click "Assign New Task" to get started.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {tasks.map((task) => (
                        <tr key={task._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{task.title}</div>
                            {task.description && <div className="text-sm text-gray-500 line-clamp-1 mt-0.5">{task.description}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img src={getAvatarUrl(task.assignedTo)} alt="" className="w-7 h-7 rounded-full object-cover" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{task.assignedTo?.name || 'Unknown'}</div>
                                <div className="text-xs text-gray-500">{task.assignedTo?.email || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(task.dueDate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select value={task.status}
                              onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                              className={`text-xs font-bold rounded-full px-3 py-1.5 border-0 cursor-pointer ${
                                task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button onClick={() => handleDeleteTask(task._id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all">
                              <FiTrash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─── REPORTS TAB ────────────────────── */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Daily Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Reports submitted by your team members</p>
              </div>
              {reports.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Reports Yet</h3>
                  <p className="text-gray-500">Your team members haven't submitted any daily reports yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report, idx) => (
                    <motion.div key={report._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img src={getAvatarUrl(report.memberId)} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100" />
                          <div>
                            <h4 className="font-bold text-gray-800">{report.memberId?.name || 'Unknown'}</h4>
                            <p className="text-xs text-gray-500">{formatDate(report.date)}</p>
                          </div>
                        </div>
                        {report.hoursWorked && (
                          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{report.hoursWorked} hrs</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{report.reportText}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── PROFILE TAB ────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="relative px-6 pb-6">
                  <div className="absolute -top-12 left-6">
                    <div className="relative">
                      <img src={getAvatarUrl(user)} alt="" className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover" />
                      <button onClick={() => fileInputRef.current?.click()} disabled={avatarLoading}
                        className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white shadow hover:bg-indigo-700 transition-all">
                        {avatarLoading ? <FiLoader className="w-3 h-3 animate-spin" /> : <FiCamera className="w-3 h-3" />}
                      </button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpdate} className="hidden" />
                    </div>
                  </div>
                  <div className="mt-16 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="text-2xl font-bold text-gray-900 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 w-full" />
                          <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="text-gray-600 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 w-full" />
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                          <p className="text-gray-500 flex items-center gap-1 mt-1"><FiMail size={14} /> {user?.email}</p>
                          {user?.phone && <p className="text-gray-500 flex items-center gap-1 mt-0.5"><FiPhone size={14} /> {user.phone}</p>}
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Team Leader</span>
                            {user?.domain && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{user.domain}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isEditing && !isChangingPassword && (
                        <>
                          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium">
                            <FiEdit2 size={14} /> Edit Profile
                          </button>
                          <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium text-gray-700">
                            <FiLock size={14} /> Change Password
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
                      <button onClick={handleUpdateProfile} disabled={profileLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 font-medium">
                        {profileLoading ? <FiLoader className="animate-spin" /> : <FiSave size={14} />} Save
                      </button>
                      <button onClick={() => { setIsEditing(false); setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', domain: user?.domain || '', bio: user?.bio || '' }); }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700">
                        <FiX size={14} /> Cancel
                      </button>
                    </div>
                  )}
                  {isChangingPassword && (
                    <form onSubmit={handlePasswordChange} className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                      {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
                        <input key={field} type="password" required placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                          value={passwordData[field]} onChange={(e) => setPasswordData(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
                      ))}
                      <div className="flex gap-3">
                        <button type="submit" disabled={profileLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium">
                          {profileLoading ? <FiLoader className="animate-spin" /> : <FiLock size={14} />} Update
                        </button>
                        <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 font-medium text-gray-700">
                          <FiX size={14} /> Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      {/* ─── CREATE TASK MODAL ──────────────── */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white">Assign New Task</h3>
                  <button onClick={() => setShowTaskModal(false)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-all">
                    <FiX size={20} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                  <input type="text" required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 hover:bg-white transition-all" placeholder="e.g. Design Login Page" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Assign To <span className="text-red-500">*</span></label>
                  <select required value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 hover:bg-white transition-all">
                    <option value="">Select a member...</option>
                    {selectedTeam?.team?.map(m => (
                      <option key={m._id || m} value={m._id || m}>{m.name || m.email || m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                  <input type="date" required value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 hover:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50 hover:bg-white transition-all" placeholder="Task details..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowTaskModal(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all">Cancel</button>
                  <button type="submit" disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-all disabled:opacity-50 shadow-sm">
                    {loading ? <FiLoader className="animate-spin mx-auto" /> : 'Assign Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamLeaderDashboard;
