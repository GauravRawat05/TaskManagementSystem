import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiLoader,
  FiCalendar,
  FiUser,
  FiMessageSquare,
  FiX,
  FiFilter,
  FiSearch,
  FiEye,
  FiLock,
} from 'react-icons/fi';
import { createProjectTask, getProjectTask } from '../../api/index';
import { AiFillCrown } from 'react-icons/ai';

// Task Status Constants
const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  BLOCKED: 'BLOCKED'
};

const STATUS_COLORS = {
  PENDING: 'bg-blue-50 text-blue-700 border-blue-100',
  IN_PROGRESS: 'bg-sky-50 text-sky-700 border-sky-100',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  BLOCKED: 'bg-rose-50 text-rose-700 border-rose-100'
};

const STATUS_ICONS = {
  PENDING: <FiClock className="w-4 h-4" />,
  IN_PROGRESS: <FiLoader className="w-4 h-4 animate-spin" />,
  COMPLETED: <FiCheckCircle className="w-4 h-4" />,
  BLOCKED: <FiAlertCircle className="w-4 h-4" />
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onStatusChange, canEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${STATUS_COLORS[task.status]}`}>
              {STATUS_ICONS[task.status]}
              <span>{task.status.replace('_', ' ')}</span>
            </div>
            <span className="text-xs text-blue-400">
              {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {canEdit && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Edit task"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1.5 text-blue-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-800 text-sm mb-4 font-medium leading-relaxed">{task.description}</p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {task.date && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <FiCalendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Due: {new Date(task.date).toLocaleDateString()}</span>
            </div>
          )}

          {task.memberId && (
            <div className="flex items-center gap-2 text-xs text-blue-600">
              <FiUser className="w-3.5 h-3.5 text-blue-400" />
              <span>Assigned to: {task.memberId.name || task.memberId}</span>
            </div>
          )}

          {task.remark && (
            <div className="flex items-start gap-2 text-xs text-blue-600">
              <FiMessageSquare className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
              <span className="line-clamp-2">{task.remark}</span>
            </div>
          )}
        </div>

        {/* Status Change Dropdown - Only for Team Leaders */}
        {canEdit && (
          <div className="mt-3 pt-3 border-t border-blue-50">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="w-full text-xs px-3 py-2 bg-blue-50/30 border border-blue-200 rounded-lg text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {Object.values(TASK_STATUS).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Read-only indicator for non-team-leaders */}
        {!canEdit && (
          <div className="mt-3 pt-3 border-t border-blue-50">
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400">
              <FiLock size={12} />
              <span>Read-only mode</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Access Denied Modal
const AccessDeniedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
      >
        <div className="flex items-center justify-between p-5 border-b border-blue-100">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
            Access Denied
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-rose-50 rounded-xl transition-all duration-200 text-rose-400 hover:text-rose-600"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AiFillCrown className="w-8 h-8 text-rose-500" />
          </div>
          <p className="text-gray-700 mb-4">
            Only <strong className="text-rose-600">Team Leaders</strong> can create, edit, or delete tasks.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Managers and Admins have read-only access.
            </span>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-xl hover:from-rose-700 hover:to-rose-800 transition-all duration-200 font-medium shadow-sm"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Task Form Modal
const TaskFormModal = ({ isOpen, onClose, onSubmit, task, projectId, members, isLoading, canEdit }) => {
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    memberId: '',
    date: '',
    description: '',
    status: TASK_STATUS.PENDING,
    remark: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        projectId: task.projectId || projectId,
        memberId: task.memberId || '',
        date: task.date ? task.date.split('T')[0] : '',
        description: task.description || '',
        status: task.status || TASK_STATUS.PENDING,
        remark: task.remark || ''
      });
    } else {
      setFormData({
        projectId: projectId || '',
        memberId: '',
        date: '',
        description: '',
        status: TASK_STATUS.PENDING,
        remark: ''
      });
    }
  }, [task, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
      >
        <div className="flex items-center justify-between p-5 border-b border-blue-100">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 text-blue-400 hover:text-blue-600"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder="Enter task description..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              Assign To
            </label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            >
              <option value="">Select member</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
            >
              {Object.values(TASK_STATUS).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">
              Remark
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
              placeholder="Add any remarks..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {isLoading && <FiLoader className="animate-spin" />}
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Main Task Component
const TaskComponent = ({ projectId, members, currentUserRole }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Only Team Leaders can edit/create tasks
  const canEdit = currentUserRole === 'TEAM_LEADER';
  const isTeamLeader = currentUserRole === 'TEAM_LEADER';

  // Load tasks
  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getProjectTask({ projectId });
      const taskData = response?.data || response || [];
      setTasks(taskData);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Create task
  const handleCreateTask = async (taskData) => {
    if (!canEdit) {
      setShowAccessDenied(true);
      return;
    }

    setFormLoading(true);
    try {
      const response = await createProjectTask(taskData);
      const newTask = response?.data || response;
      setTasks(prev => [newTask, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(err.message || 'Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  // Update task (local only)
  const handleUpdateTask = async (taskData) => {
    if (!canEdit) {
      setShowAccessDenied(true);
      return;
    }

    setTasks(prev => prev.map(task =>
      task._id === editingTask._id ? { ...task, ...taskData } : task
    ));
    setEditingTask(null);
    setShowForm(false);
  };

  // Update task status (local only)
  const handleStatusChange = async (taskId, newStatus) => {
    if (!canEdit) {
      setShowAccessDenied(true);
      return;
    }

    setTasks(prev => prev.map(t =>
      t._id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  // Delete task (local only)
  const handleDeleteTask = async (taskId) => {
    if (!canEdit) {
      setShowAccessDenied(true);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  // Handle create button click
  const handleCreateClick = () => {
    if (!canEdit) {
      setShowAccessDenied(true);
    } else {
      setEditingTask(null);
      setShowForm(true);
    }
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    if (filter !== 'ALL') {
      filtered = filtered.filter(task => task.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.remark && task.remark.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;
    const inProgress = tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length;
    const pending = tasks.filter(t => t.status === TASK_STATUS.PENDING).length;
    const blocked = tasks.filter(t => t.status === TASK_STATUS.BLOCKED).length;

    return { total, completed, inProgress, pending, blocked };
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Project Tasks
          </h2>
          <p className="text-blue-500 text-sm mt-1">
            {canEdit
              ? 'You have full access to create, edit, and manage tasks'
              : currentUserRole === 'ADMIN' || currentUserRole === 'MANAGER'
                ? 'You have read-only access to view tasks'
                : 'View all project tasks'}
          </p>
        </div>

        {canEdit ? (
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <FiPlus size={18} />
            Create Task
          </button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <FiEye size={18} />
            <span className="font-medium">Read-Only Mode</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-400 font-medium mt-1">Total Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-3xl font-bold text-emerald-600">{stats.completed}</div>
          <div className="text-sm text-emerald-500 font-medium mt-1">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-3xl font-bold text-sky-600">{stats.inProgress}</div>
          <div className="text-sm text-sky-500 font-medium mt-1">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-3xl font-bold text-blue-400">{stats.pending}</div>
          <div className="text-sm text-blue-400 font-medium mt-1">Pending</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder:text-blue-300"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['ALL', TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED, TASK_STATUS.BLOCKED].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 font-medium ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700">
          <div className="flex items-center gap-2">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-blue-100 p-12 text-center">
          <div className="text-blue-200 mb-4">
            <FiCheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">No tasks found</h3>
          <p className="text-blue-500">
            {searchTerm || filter !== 'ALL'
              ? 'Try adjusting your filters'
              : canEdit
                ? 'Click the "Create Task" button to get started'
                : 'No tasks have been created yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(task) => {
                  if (!canEdit) {
                    setShowAccessDenied(true);
                  } else {
                    setEditingTask(task);
                    setShowForm(true);
                  }
                }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                canEdit={canEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        projectId={projectId}
        members={members}
        isLoading={formLoading}
        canEdit={canEdit}
      />

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
      />
    </div>
  );
};

export default TaskComponent;
