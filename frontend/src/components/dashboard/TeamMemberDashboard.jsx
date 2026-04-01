import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheckCircle, FiClock, FiFileText, FiRefreshCw, FiHome, FiFolder, FiUsers,
  FiUser, FiList, FiLogOut, FiMenu, FiBriefcase, FiTarget, FiActivity,
  FiBarChart2, FiCalendar, FiAlertCircle, FiLoader, FiEdit2, FiSave,
  FiX, FiCamera, FiLock, FiPhone, FiShield, FiMail, FiChevronRight, FiSend
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils';
import {
  getTasks, updateTask, submitReport, getMyReports, getTeams, getProjects,
  getWorkspaceById, getWorkspaces, loggedOutUser, changeCurrentPassword, updateUserProfile, updateUserAvatar
} from '../../api';

const TeamMemberDashboard = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [allWorkspaces, setAllWorkspaces] = useState([]);

  // Report Form
  const [reportForm, setReportForm] = useState({ projectId: '', teamId: '', reportText: '', hoursWorked: '' });

  // Toast & Profile
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', domain: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    if (user) setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', domain: user?.domain || '', bio: user?.bio || '' });
  }, [user]);

  // Load workspace
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(() => getWorkspaceById({ workspaceId }), setLoading, (res) => setWorkspace(res.data || res), () => {});
  }, [workspaceId]);

  // Load all workspaces for switching
  useEffect(() => {
    requestHandler(() => getWorkspaces(), setLoading, (res) => setAllWorkspaces(res.data || res), () => {});
  }, []);

  // Load teams I belong to
  const loadMyTeams = useCallback(() => {
    if (!workspaceId || !user) return;
    requestHandler(
      () => getTeams({ workspaceId }),
      setLoading,
      (res) => {
        const allTeams = res.data || res;
        const memberTeams = allTeams.filter(t =>
          t.team?.some(m => String(m._id || m) === String(user._id)) ||
          String(t.teamLeader?._id || t.teamLeader) === String(user._id)
        );
        setMyTeams(memberTeams);
        if (memberTeams.length > 0 && memberTeams[0].projectId) {
          const pid = memberTeams[0].projectId?._id || memberTeams[0].projectId;
          setReportForm(prev => ({ ...prev, projectId: String(pid), teamId: memberTeams[0]._id }));
        }
      },
      (err) => console.error("Failed to load teams", err)
    );
  }, [workspaceId, user]);

  useEffect(() => { loadMyTeams(); }, [loadMyTeams]);

  // Load projects
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getProjects({ workspaceId }),
      setLoading,
      (res) => setProjects(res.data || res),
      () => {}
    );
  }, [workspaceId]);

  // Load tasks
  const loadTasks = useCallback(() => {
    requestHandler(() => getTasks({}), setLoading, (res) => setTasks(res.data || res), (err) => console.error("Failed to load tasks", err));
  }, []);

  // Load reports
  const loadReports = useCallback(() => {
    requestHandler(
      () => getMyReports({}),
      setLoading,
      (res) => {
        const d = res?.data?.data || res?.data || res;
        setReports(Array.isArray(d) ? d : []);
      },
      (err) => console.error("Failed to load reports", err)
    );
  }, []);

  useEffect(() => {
    if (activeTab === 'tasks') loadTasks();
    else if (activeTab === 'reports') loadReports();
  }, [activeTab, loadTasks, loadReports]);

  // Handlers
  const handleUpdateStatus = (taskId, newStatus) => {
    requestHandler(
      () => updateTask(taskId, { status: newStatus }), setLoading,
      () => { setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t)); showToast('Task updated!'); },
      (err) => console.error("Failed to update task", err)
    );
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportForm.projectId) { showToast('Please select a project.', 'error'); return; }
    const relevantTeam = myTeams.find(t => String(t.projectId?._id || t.projectId) === reportForm.projectId);
    const payload = { ...reportForm, teamId: relevantTeam?._id || reportForm.teamId, date: new Date().toISOString() };
    requestHandler(
      () => submitReport(payload), setLoading,
      () => { loadReports(); setReportForm(prev => ({ ...prev, reportText: '', hoursWorked: '' })); showToast('Daily report submitted! 📝'); },
      (err) => { console.error("Failed to submit report", err); showToast('Failed to submit report', 'error'); }
    );
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    requestHandler(() => updateUserProfile(formData), setProfileLoading,
      (r) => { setUser(r?.data || r); setIsEditing(false); showToast('Profile updated! ✨'); },
      (e) => showToast(e?.message || 'Failed', 'error')
    );
  };
  const handleAvatarUpdate = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    requestHandler(() => updateUserAvatar(fd), setAvatarLoading,
      (r) => { setUser(r?.data || r); showToast('Avatar updated! 📸'); },
      (e) => showToast(e?.message || 'Failed', 'error')
    );
  };
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (passwordData.newPassword.length < 6) { showToast('Min 6 characters', 'error'); return; }
    requestHandler(
      () => changeCurrentPassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      setProfileLoading,
      () => { setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setIsChangingPassword(false); showToast('Password changed! 🔒'); },
      (e) => showToast(e?.message || 'Failed', 'error')
    );
  };
  const handleLogout = () => {
    requestHandler(() => loggedOutUser(), setLoading, () => { logout(); window.location.href = '/login'; }, () => {});
  };

  // Helpers
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const daysLeft = (dl) => { if (!dl) return null; const now = new Date(); now.setHours(0,0,0,0); const d = new Date(dl); d.setHours(0,0,0,0); return Math.ceil((d - now) / 86400000); };
  const getAvatarUrl = (u) => { const n = u?.name || 'User'; return u?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=6366F1&color=fff&size=150&bold=true`; };

  // Stats
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  // All team members from my teams
  const allTeammates = myTeams.reduce((acc, t) => {
    (t.team || []).forEach(m => { if (!acc.find(x => String(x._id || x) === String(m._id || m))) acc.push(m); });
    if (t.teamLeader && !acc.find(x => String(x._id || x) === String(t.teamLeader._id || t.teamLeader))) acc.push(t.teamLeader);
    return acc;
  }, []);

  // My projects (from my teams)
  const myProjectIds = myTeams.map(t => String(t.projectId?._id || t.projectId)).filter(Boolean);
  const myProjects = projects.filter(p => myProjectIds.includes(String(p._id)));

  const menuItems = [
    { id: 'dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { id: 'projects', icon: <FiFolder size={20} />, label: 'My Projects' },
    { id: 'myteam', icon: <FiUsers size={20} />, label: 'My Team' },
    { id: 'tasks', icon: <FiList size={20} />, label: 'My Tasks' },
    { id: 'reports', icon: <FiFileText size={20} />, label: 'Daily Report' },
    { id: 'profile', icon: <FiUser size={20} />, label: 'Profile' },
  ];

  // ─── RENDER ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-lg text-white font-medium ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <div className="flex items-center gap-2">{toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ──────────────────────────────── */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 overflow-y-auto shadow-sm z-40`}>
        <div className="p-4">
          {!sidebarCollapsed && (
            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <FiBriefcase className="text-emerald-600" size={14} />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Workspace</span>
              </div>
              {allWorkspaces.length > 1 ? (
                <select
                  value={workspaceId}
                  onChange={(e) => navigate(`/workspace/${e.target.value}`)}
                  className="w-full text-sm font-bold text-gray-800 bg-white border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 mb-2 cursor-pointer"
                >
                  {allWorkspaces.map(ws => (
                    <option key={ws._id} value={ws._id}>{ws.name}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-bold text-gray-800 truncate">{workspace?.name || 'Loading...'}</p>
              )}
              <div className="mt-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Team Member</span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mb-4 flex justify-center group relative">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-emerald-600" size={18} />
              </div>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{workspace?.name}</div>
            </div>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}
                onClick={() => { setActiveTab(item.id); if (item.id === 'tasks') loadTasks(); if (item.id === 'reports') loadReports(); }}
                className={`group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}>
                {activeTab === item.id && <div className="absolute left-0 w-1 h-8 bg-emerald-600 rounded-r-full" />}
                <div className={`transition-all duration-200 ${activeTab === item.id ? 'text-emerald-600' : 'text-gray-400'} group-hover:text-emerald-500`}>{item.icon}</div>
                {!sidebarCollapsed && <span className={`font-medium text-sm ${activeTab === item.id ? 'text-emerald-700' : 'text-gray-600'}`}>{item.label}</span>}
                {sidebarCollapsed && <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{item.label}</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button onClick={handleLogout} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 transition-all w-full ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <FiLogOut size={20} />{!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────── */}
      <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FiMenu size={20} className="text-gray-600" /></button>
              <div><h1 className="text-lg font-bold text-gray-800">Member Dashboard</h1><p className="text-xs text-gray-500">{menuItems.find(i => i.id === activeTab)?.label}</p></div>
            </div>
            <div className="flex items-center gap-2 pl-3">
              <img src={getAvatarUrl(user)} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-emerald-100" />
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="p-6">

          {/* ─── DASHBOARD TAB ─────────────────── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, {user?.name?.split(' ')[0] || 'Team Member'}!
                    </h2>
                    <p className="text-emerald-100 text-sm">Member of <strong>{myTeams.length}</strong> team{myTeams.length !== 1 ? 's' : ''} in <strong>{workspace?.name || 'workspace'}</strong></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setActiveTab('reports'); loadReports(); }} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium text-sm transition-all backdrop-blur-sm border border-white/20">
                      <FiSend size={16} /> Log Report
                    </button>
                    <button onClick={() => { setActiveTab('tasks'); loadTasks(); }} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-all backdrop-blur-sm border border-white/10">
                      <FiList size={16} /> My Tasks
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Tasks', value: totalTasks, icon: FiTarget, bg: 'bg-blue-50', tc: 'text-blue-600' },
                  { label: 'To Do', value: todoTasks.length, icon: FiClock, bg: 'bg-amber-50', tc: 'text-amber-600' },
                  { label: 'In Progress', value: inProgressTasks.length, icon: FiActivity, bg: 'bg-purple-50', tc: 'text-purple-600' },
                  { label: 'Completed', value: `${completionRate}%`, icon: FiCheckCircle, bg: 'bg-emerald-50', tc: 'text-emerald-600' },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl ${s.bg} w-fit mb-3`}><s.icon className={`${s.tc} w-5 h-5`} /></div>
                    <h3 className="text-2xl font-bold text-gray-800">{s.value}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Teams */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FiUsers className="text-emerald-500" /> My Teams</h3>
                  {myTeams.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">Not assigned to any team yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {myTeams.map(team => (
                        <div key={team._id} onClick={() => setActiveTab('myteam')}
                          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer transition-all">
                          <div>
                            <h4 className="font-semibold text-gray-800">{team.teamName}</h4>
                            <p className="text-xs text-gray-500">{team.projectId?.projectName || 'No Project'} · Leader: {team.teamLeader?.name || 'N/A'}</p>
                          </div>
                          <FiChevronRight className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Task Progress */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><FiBarChart2 className="text-emerald-500" /> My Progress</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'To Do', count: todoTasks.length, color: 'bg-amber-500', pct: totalTasks > 0 ? (todoTasks.length / totalTasks) * 100 : 0 },
                      { label: 'In Progress', count: inProgressTasks.length, color: 'bg-blue-500', pct: totalTasks > 0 ? (inProgressTasks.length / totalTasks) * 100 : 0 },
                      { label: 'Done', count: doneTasks.length, color: 'bg-emerald-500', pct: totalTasks > 0 ? (doneTasks.length / totalTasks) * 100 : 0 },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                          <span className="text-gray-600">{s.label}</span>
                          <span className="text-gray-800 font-bold">{s.count}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8 }} className={`${s.color} h-full rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalTasks === 0 && <p className="text-center text-gray-400 text-sm mt-4">No tasks assigned yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ─── PROJECTS TAB ──────────────────── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold text-gray-800">My Projects</h2><p className="text-sm text-gray-500 mt-1">Projects your teams are working on</p></div>
              {myProjects.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                  <FiFolder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Projects Yet</h3>
                  <p className="text-gray-500">You'll see projects here once your team is assigned to one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myProjects.map((project, idx) => {
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

          {/* ─── MY TEAM TAB ───────────────────── */}
          {activeTab === 'myteam' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold text-gray-800">My Team</h2><p className="text-sm text-gray-500 mt-1">Your teammates &amp; team leaders</p></div>
              {myTeams.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Not In Any Team</h3>
                  <p className="text-gray-500">You haven't been assigned to a team yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myTeams.map((team, idx) => (
                    <motion.div key={team._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{team.teamName}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FiFolder size={12} /> {team.projectId?.projectName || 'No Project'}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Member</span>
                      </div>
                      {/* Team Leader */}
                      {team.teamLeader && (
                        <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Team Leader</p>
                          <div className="flex items-center gap-3">
                            <img src={getAvatarUrl(team.teamLeader)} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-amber-200" />
                            <div>
                              <p className="text-sm font-bold text-gray-800">{team.teamLeader.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{team.teamLeader.email || ''}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Teammates ({team.team?.length || 0})</p>
                        <div className="space-y-2">
                          {(team.team || []).slice(0, 6).map(member => (
                            <div key={member._id || member} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                              <img src={getAvatarUrl(member)} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{member.name || 'Unknown'} {String(member._id || member) === String(user._id) ? <span className="text-emerald-600 text-xs">(You)</span> : ''}</p>
                                <p className="text-xs text-gray-500">{member.email || ''}</p>
                              </div>
                            </div>
                          ))}
                          {(team.team?.length || 0) > 6 && <p className="text-xs text-emerald-600 font-semibold text-center pt-2">+{team.team.length - 6} more</p>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TASKS TAB (Kanban) ────────────── */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-bold text-gray-800">My Tasks</h2><p className="text-sm text-gray-500 mt-1">Assigned to you ({totalTasks})</p></div>
                <button onClick={loadTasks} className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 text-sm font-medium">
                  <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              {totalTasks === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                  <FiCheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">You're All Caught Up!</h3>
                  <p className="text-gray-500">No tasks are currently assigned to you.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {[
                    { title: 'To Do', items: todoTasks, bg: 'bg-amber-50/50', border: 'border-amber-200', hColor: 'text-amber-800', badge: 'bg-amber-200 text-amber-700' },
                    { title: 'In Progress', items: inProgressTasks, bg: 'bg-blue-50/50', border: 'border-blue-200', hColor: 'text-blue-800', badge: 'bg-blue-200 text-blue-700' },
                    { title: 'Done', items: doneTasks, bg: 'bg-emerald-50/50', border: 'border-emerald-200', hColor: 'text-emerald-800', badge: 'bg-emerald-200 text-emerald-700' },
                  ].map(col => (
                    <div key={col.title} className={`${col.bg} p-4 rounded-2xl border ${col.border}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold ${col.hColor}`}>{col.title}</h3>
                        <span className={`${col.badge} text-xs font-bold px-2.5 py-1 rounded-full`}>{col.items.length}</span>
                      </div>
                      <div className="space-y-3">
                        {col.items.map(task => (
                          <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-gray-800">{task.title}</h4>
                            {task.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-400 flex items-center gap-1"><FiClock size={12} /> {formatDate(task.dueDate)}</span>
                              <select value={task.status} onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                                className={`text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer ${
                                  task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                              </select>
                            </div>
                          </motion.div>
                        ))}
                        {col.items.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No tasks</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── REPORTS TAB ───────────────────── */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold text-gray-800">Daily Report</h2><p className="text-sm text-gray-500 mt-1">Submit your daily work log &amp; view history</p></div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Submit Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><FiSend className="text-emerald-500" /> Log Today's Work</h3>
                    {myTeams.length === 0 ? (
                      <div className="text-amber-700 bg-amber-50 p-4 rounded-xl text-sm border border-amber-200">You need to be assigned to a team before you can submit.</div>
                    ) : (
                      <form onSubmit={handleSubmitReport} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Project</label>
                          <select required value={reportForm.projectId}
                            onChange={(e) => {
                              const t = myTeams.find(t => String(t.projectId?._id || t.projectId) === e.target.value);
                              setReportForm({ ...reportForm, projectId: e.target.value, teamId: t?._id || '' });
                            }}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-gray-50 hover:bg-white transition-all text-sm">
                            <option value="">Select project...</option>
                            {myTeams.map(t => (
                              <option key={t._id} value={String(t.projectId?._id || t.projectId)}>{t.projectId?.projectName || t.teamName + ' Project'}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Hours Worked</label>
                          <input type="number" min="0" max="24" step="0.5" required value={reportForm.hoursWorked}
                            onChange={(e) => setReportForm({ ...reportForm, hoursWorked: e.target.value })}
                            placeholder="e.g. 8"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-gray-50 hover:bg-white transition-all text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">What did you work on?</label>
                          <textarea required rows={4} placeholder="Detail your contributions and progress today..."
                            value={reportForm.reportText} onChange={(e) => setReportForm({ ...reportForm, reportText: e.target.value })}
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-gray-50 hover:bg-white transition-all text-sm resize-none" />
                        </div>
                        <button type="submit" disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium text-sm transition-all disabled:opacity-50 shadow-sm">
                          {loading ? <FiLoader className="animate-spin" /> : <FiSend size={14} />} Submit Report
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* Reports History */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">My Report History</h3>
                      <button onClick={loadReports} className="text-gray-500 hover:text-emerald-600 transition-colors"><FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /></button>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[550px] overflow-y-auto">
                      {reports.length === 0 ? (
                        <div className="p-8 text-center"><FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 text-sm">No reports submitted yet.</p></div>
                      ) : (
                        reports.map((report, idx) => (
                          <motion.div key={report._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                            className="p-5 hover:bg-gray-50/50 transition">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold mb-1">
                                  {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <h4 className="font-bold text-gray-900">{report.projectId?.projectName || 'Project Work'}</h4>
                              </div>
                              {report.hoursWorked !== undefined && <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{report.hoursWorked} hrs</span>}
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-xl p-3">{report.reportText}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── PROFILE TAB ───────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                <div className="relative px-6 pb-6">
                  <div className="absolute -top-12 left-6">
                    <div className="relative">
                      <img src={getAvatarUrl(user)} alt="" className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover" />
                      <button onClick={() => fileInputRef.current?.click()} disabled={avatarLoading}
                        className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 rounded-full text-white shadow hover:bg-emerald-700 transition-all">
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
                            className="text-2xl font-bold text-gray-900 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 w-full" />
                          <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="text-gray-600 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 w-full" />
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                          <p className="text-gray-500 flex items-center gap-1 mt-1"><FiMail size={14} /> {user?.email}</p>
                          {user?.phone && <p className="text-gray-500 flex items-center gap-1 mt-0.5"><FiPhone size={14} /> {user.phone}</p>}
                          <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Team Member</span>
                            {user?.domain && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">{user.domain}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!isEditing && !isChangingPassword && (
                        <>
                          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm font-medium"><FiEdit2 size={14} /> Edit</button>
                          <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"><FiLock size={14} /> Password</button>
                        </>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
                      <button onClick={handleUpdateProfile} disabled={profileLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-medium">
                        {profileLoading ? <FiLoader className="animate-spin" /> : <FiSave size={14} />} Save
                      </button>
                      <button onClick={() => { setIsEditing(false); setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', domain: user?.domain || '', bio: user?.bio || '' }); }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 font-medium text-gray-700"><FiX size={14} /> Cancel</button>
                    </div>
                  )}
                  {isChangingPassword && (
                    <form onSubmit={handlePasswordChange} className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                      <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                      {['currentPassword', 'newPassword', 'confirmPassword'].map(field => (
                        <input key={field} type="password" required placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                          value={passwordData[field]} onChange={(e) => setPasswordData(p => ({ ...p, [field]: e.target.value }))}
                          className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 bg-gray-50" />
                      ))}
                      <div className="flex gap-3">
                        <button type="submit" disabled={profileLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-medium">
                          {profileLoading ? <FiLoader className="animate-spin" /> : <FiLock size={14} />} Update
                        </button>
                        <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 font-medium text-gray-700"><FiX size={14} /> Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default TeamMemberDashboard;
