import React, { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const EditDeadlineModal = ({ show, onClose, onSubmit, project }) => {
  const [deadline, setDeadline] = useState(project?.deadline?.split('T')[0] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(project._id, deadline);
    setIsSubmitting(false);
  };

  const currentDeadline = project?.deadline ? new Date(project.deadline) : null;
  const newDeadlineDate = deadline ? new Date(deadline) : null;
  const daysDiff = newDeadlineDate && currentDeadline
    ? Math.ceil((newDeadlineDate - currentDeadline) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiCalendar className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Update Project Deadline</h3>
                <p className="text-amber-100 text-sm">Adjust project timeline</p>
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
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project
              </label>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-xl border border-gray-200">
                <p className="font-medium text-gray-800">{project?.projectName}</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar className="inline mr-1" size={14} /> New Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              {currentDeadline && (
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <FiClock className="text-gray-400" />
                  <span className="text-gray-500">Current deadline:</span>
                  <span className="font-medium text-gray-700">
                    {currentDeadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {newDeadlineDate && currentDeadline && daysDiff !== 0 && (
              <div className={`p-3 rounded-xl mb-5 ${
                daysDiff > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {daysDiff > 0 ? (
                    <FiCheckCircle className="text-green-500" size={16} />
                  ) : (
                    <FiAlertCircle className="text-red-500" size={16} />
                  )}
                  <p className={`text-sm ${
                    daysDiff > 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {daysDiff > 0
                      ? `Deadline extended by ${daysDiff} days`
                      : `Deadline shortened by ${Math.abs(daysDiff)} days`}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl mb-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="text-amber-600" size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Important Note</p>
                  <p className="text-xs text-gray-600">
                    Updating the deadline will affect project timeline and team notifications.
                    All team members will be notified of this change.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  'Update Deadline'
                )}
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

export default EditDeadlineModal;
