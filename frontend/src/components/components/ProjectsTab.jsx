import React from 'react';
import { FiPlus, FiFolder, FiCalendar, FiClock, FiUser, FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiTrendingUp, FiFlag } from 'react-icons/fi';

const ProjectsTab = ({
  projects,
  formatDate,
  daysLeft,
  canCreateProject,
  canEditProject,
  canDeleteProject,
  setShowCreateProjectModal,
  setShowEditProjectModal,
  setShowEditDeadlineModal,
  handleDeleteProject,
  user,
  isAdmin,
  isManager,
  currentUserRole
}) => {
  // Get project status with enhanced colors and icons
  const getProjectStatus = (project) => {
    const deadline = new Date(project.deadline);
    const today = new Date();
    if (project.status === 'completed') return {
      label: 'Completed',
      color: 'bg-gradient-to-r from-green-400 to-green-500 text-white',
      icon: FiCheckCircle,
      borderColor: 'border-green-200'
    };
    if (deadline < today) return {
      label: 'Overdue',
      color: 'bg-gradient-to-r from-red-400 to-red-500 text-white',
      icon: FiAlertCircle,
      borderColor: 'border-red-200'
    };
    if (daysLeft(project.deadline) <= 3) return {
      label: 'Urgent',
      color: 'bg-gradient-to-r from-orange-400 to-red-500 text-white',
      icon: FiFlag,
      borderColor: 'border-orange-200'
    };
    return {
      label: 'Active',
      color: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white',
      icon: FiTrendingUp,
      borderColor: 'border-blue-200'
    };
  };

  // Get gradient based on project priority/time
  const getCardGradient = (project) => {
    const deadline = new Date(project.deadline);
    const today = new Date();
    if (project.status === 'completed') return 'from-green-50 to-emerald-50';
    if (deadline < today) return 'from-red-50 to-rose-50';
    if (daysLeft(project.deadline) <= 3) return 'from-orange-50 to-amber-50';
    return 'from-blue-50 to-indigo-50';
  };

  // Check if user can edit specific project
  const canEditSpecificProject = (project) => {
    if (isAdmin || isManager) return true;
    if (currentUserRole === 'TEAM_LEADER' && project.teamLeadId === user?._id) return true;
    return false;
  };

  // Check if user can delete specific project
  const canDeleteSpecificProject = () => {
    return isAdmin || isManager;
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-1">Projects</h2>
            <p className="text-blue-100 text-sm">
              {projects?.length || 0} active {projects?.length === 1 ? 'project' : 'projects'} in this workspace
            </p>
          </div>
          {canCreateProject && (
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              <FiPlus size={20} />
              New Project
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => {
          const days = daysLeft(project.deadline);
          const status = getProjectStatus(project);
          const canEdit = canEditSpecificProject(project);
          const canDelete = canDeleteSpecificProject();
          const cardGradient = getCardGradient(project);
          const StatusIcon = status.icon;

          return (
            <div
              key={project._id}
              className={`group bg-gradient-to-br ${cardGradient} rounded-xl border ${status.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1`}
            >
              {/* Card Header */}
              <div className="bg-white/80 backdrop-blur-sm px-5 py-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cardGradient} flex items-center justify-center shadow-sm`}>
                      <FiFolder className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">{project.projectName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FiClock size={10} />
                        Created {formatDate(project.createdAt || project.startDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {canEdit && (
                      <button
                        onClick={() => setShowEditProjectModal(project)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <FiEdit2 size={14} className="text-blue-600" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteProject(project._id, project.projectName)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Project"
                      >
                        <FiTrash2 size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Description */}
                {project.description && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{project.description}</p>
                  </div>
                )}

                {/* Project Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FiCalendar className="text-blue-500" size={14} />
                      Start Date:
                    </span>
                    <span className="font-semibold text-gray-700">{formatDate(project.startDate)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FiClock className="text-orange-500" size={14} />
                      Deadline:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">{formatDate(project.deadline)}</span>
                      {canEdit && (
                        <button
                          onClick={() => setShowEditDeadlineModal(project)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FiUser className="text-purple-500" size={14} />
                      Created By:
                    </span>
                    <span className="font-semibold text-gray-700">{project.createdBy?.name || 'Unknown'}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between text-sm pt-1">
                    <span className="text-gray-600">Status:</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.color} shadow-sm`}>
                      <StatusIcon size={12} />
                      <span className="text-xs font-semibold">{status.label}</span>
                    </div>
                  </div>
                </div>

                {/* Days Left Progress */}
                {days !== null && days >= 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600 font-medium">Time Remaining</span>
                      <span className={`font-bold ${
                        days <= 3 ? 'text-red-600' :
                        days <= 7 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {days} day{days !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            days <= 3 ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            days <= 7 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                            'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, ((30 - days) / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Overdue Warning */}
                {days !== null && days < 0 && (
                  <div className="mt-3 bg-red-100 border-l-4 border-red-500 rounded-lg p-3 flex items-center gap-2 shadow-sm">
                    <FiAlertCircle className="text-red-600 w-5 h-5" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Overdue</p>
                      <p className="text-xs text-red-600">by {Math.abs(days)} day{Math.abs(days) !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {project.status === 'completed' && (
                  <div className="mt-3 bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-700 font-medium">✓ Project Completed</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Empty State with Enhanced Design */}
        {(!projects || projects.length === 0) && (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiFolder className="w-10 h-10 text-blue-500" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">No projects found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first project to get started</p>
            {canCreateProject && (
              <button
                onClick={() => setShowCreateProjectModal(true)}
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FiPlus size={18} />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
