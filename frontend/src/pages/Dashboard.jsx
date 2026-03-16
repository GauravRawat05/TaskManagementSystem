import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiFolder, FiLogOut, FiCheckCircle, FiAlertCircle, FiX, FiUsers, FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ProjectsTab } from '../components/dashboard/ProjectsTab';
import { InternsTab } from '../components/dashboard/InternsTab';
import { TeamsTab } from '../components/dashboard/TeamsTab';

const Toast = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border text-sm font-medium ${
      type === 'success'
        ? 'bg-blue-50 border-blue-200 text-blue-700'
        : 'bg-red-50 border-red-200 text-red-600'
    }`}
  >
    {type === 'success'
      ? <FiCheckCircle size={18} className="text-blue-500" />
      : <FiAlertCircle size={18} className="text-red-500" />
    }
    {msg}
    <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
      <FiX size={14} />
    </button>
  </motion.div>
);

const TABS = [
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'interns', label: 'Interns', icon: FiUploadCloud },
  { id: 'teams', label: 'Teams', icon: FiUsers },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">
      {/* Light blue gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-200/40 blur-[120px]" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-sky-200/40 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-100/50 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <FiFolder size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">TMS Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-slate-600 text-sm">
                {user?.name || user?.email || 'Manager'} · <span className="font-semibold text-blue-600 capitalize">{user?.role}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm transition-colors"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Tabs */}
          <aside className="md:w-64 shrink-0">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col gap-1 shadow-sm">
              {TABS.map(tab => {
                const isAct = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isAct
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
                    }`}
                  >
                    <Icon size={18} className={isAct ? 'text-white' : 'text-slate-400'} />
                    {tab.label}
                  </button>
                );
              })}

              <div className="mt-6 px-4 pt-4 border-t border-slate-200">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3">Workflow</p>
                <ul className="text-xs text-slate-500 space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'projects' ? 'bg-blue-500' : 'bg-slate-300'}`}/>
                    1. Create Project
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'interns' ? 'bg-blue-500' : 'bg-slate-300'}`}/>
                    2. Upload Interns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'teams' ? 'bg-blue-500' : 'bg-slate-300'}`}/>
                    3. Build Teams
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Tab Content */}
          <section className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'projects' && <ProjectsTab user={user} showToast={showToast} />}
              {activeTab === 'interns' && <InternsTab showToast={showToast} />}
              {activeTab === 'teams' && <TeamsTab showToast={showToast} />}
            </motion.div>
          </section>

        </div>
      </main>

      {/* Toast Overlay */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
