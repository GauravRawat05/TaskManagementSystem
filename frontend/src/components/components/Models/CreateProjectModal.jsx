import React, { useState } from 'react';
import { FiX, FiUsers, FiAlertCircle, FiBriefcase, FiCalendar, FiFileText, FiCheckCircle } from 'react-icons/fi';

const CreateProjectModal = ({
  show,
  onClose,
  onSubmit,
  workspaceId,
  availableUsers = [],
  isEdit = false,
  editData = null,
  canCreate = true,
  isMemberOnly = false
}) => {
  const [projectName, setProjectName] = useState(editData?.projectName || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [startDate, setStartDate] = useState(editData?.startDate?.split('T')[0] || '');
  const [deadline, setDeadline] = useState(editData?.deadline?.split('T')[0] || '');
  const [errors, setErrors] = useState({});

  if (!show) return null;

  if (isMemberOnly || !canCreate) {
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    if (startDate && deadline && new Date(deadline) < new Date(startDate)) {
      newErrors.deadline = 'Deadline cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      workspaceId: workspaceId,
      projectName: projectName.trim(),
      description: description.trim(),
      startDate,
      deadline
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl sticky top-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEdit ? 'Edit Project' : 'Create New Project'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {isEdit ? 'Update project details' : 'Add a new project to your workspace'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Workspace Info */}
            {workspaceId && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-blue-600" size={16} />
                  <span className="text-xs font-semibold text-blue-700">Workspace ID:</span>
                  <code className="text-xs text-blue-800 bg-blue-100 px-2 py-1 rounded-lg font-mono">
                    {workspaceId}
                  </code>
                </div>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                  errors.projectName ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.projectName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.projectName}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project goals, objectives, scope, and expected outcomes..."
                rows="3"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.description}
                </p>
              )}
            </div>

            {/* Start Date and Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" size={14} /> Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" size={14} /> Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white ${
                    errors.deadline ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Project Summary */}
            {projectName && (startDate || deadline) && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="text-blue-600" size={16} />
                  <p className="text-sm font-semibold text-gray-800">Project Summary</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Name:</span>
                    <span className="font-medium text-gray-800">
                      {projectName || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium text-gray-800">
                      {startDate ? new Date(startDate).toLocaleDateString() : 'Not set'} → {deadline ? new Date(deadline).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {isEdit ? 'Update Project' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
