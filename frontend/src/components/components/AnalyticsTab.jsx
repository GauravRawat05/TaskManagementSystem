import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiBarChart2, 
  FiPieChart, 
  FiTrendingUp, 
  FiAward, 
  FiUsers, 
  FiFolder, 
  FiClock, 
  FiCheckCircle,
  FiActivity
} from 'react-icons/fi';

const AnalyticsTab = ({ projects, members, teams, daysLeft }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute metrics safely
  const activeProjects = projects?.filter(p => daysLeft(p.deadline) > 0) || [];
  const completedProjects = projects?.filter(p => daysLeft(p.deadline) <= 0 || p.status === 'completed') || [];
  const totalProjects = projects?.length || 0;
  
  const activePercentage = totalProjects > 0 ? Math.round((activeProjects.length / totalProjects) * 100) : 0;
  const completedPercentage = totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0;

  // Compute team sizes
  const sortedTeams = [...(teams || [])].sort((a, b) => (b.team?.length || 0) - (a.team?.length || 0));

  const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow"
    >
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-gray-800">{value}</h4>
        {subtitle && <p className="text-xs font-semibold text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiActivity className="text-indigo-600" />
            Workspace Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Real-time overview of projects, teams, and engagement.
          </p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2">
          <FiBarChart2 />
          Export Report
        </button>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Projects" 
          value={totalProjects} 
          subtitle="Workspace scale"
          icon={FiFolder} 
          colorClass="bg-blue-50 text-blue-600" 
          delay={0.1}
        />
        <MetricCard 
          title="Active Projects" 
          value={activeProjects.length} 
          subtitle={`${activePercentage}% of threshold`}
          icon={FiTrendingUp} 
          colorClass="bg-emerald-50 text-emerald-600" 
          delay={0.2}
        />
        <MetricCard 
          title="Total Teams" 
          value={teams?.length || 0} 
          subtitle="Active squads"
          icon={FiUsers} 
          colorClass="bg-purple-50 text-purple-600" 
          delay={0.3}
        />
        <MetricCard 
          title="Global Members" 
          value={members?.length || 0} 
          subtitle="Total workforce"
          icon={FiAward} 
          colorClass="bg-amber-50 text-amber-600" 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Project Health Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiPieChart className="text-gray-400" />
              Project Health
            </h3>
          </div>

          <div className="space-y-8">
            {/* Active vs Completed Visual */}
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-gray-600">Active Pipeline</span>
                <span className="text-emerald-600">{activePercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-emerald-500 h-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="bg-blue-500 h-full"
                ></motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> In Progress</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Completed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex flex-col items-center text-center">
                <FiClock className="text-emerald-500 mb-2 w-6 h-6" />
                <span className="text-2xl font-bold text-emerald-700">{activeProjects.length}</span>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-1">Ongoing</span>
              </div>
              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col items-center text-center">
                <FiCheckCircle className="text-blue-500 mb-2 w-6 h-6" />
                <span className="text-2xl font-bold text-blue-700">{completedProjects.length}</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">Delivered</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Density List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={mounted ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiUsers className="text-gray-400" />
              Team Engagement
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px]">
            {sortedTeams.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No teams formed yet.</p>
            ) : (
              sortedTeams.map((team, idx) => (
                <div key={team._id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{team.teamName}</h4>
                    <p className="text-xs text-gray-500 truncate">{team.teamLeader?.name ? `Lead: ${team.teamLeader.name}` : 'No Leader'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-gray-700">{team.team?.length || 0}</span>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Members</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default AnalyticsTab;
