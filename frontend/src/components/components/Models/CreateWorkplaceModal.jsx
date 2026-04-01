import React from 'react';
import { FiX, FiLoader, FiBriefcase, FiFileText } from 'react-icons/fi';

const CreateWorkplaceModal = ({ show, onClose, onSubmit, newWorkplace, setNewWorkplace, creatingWorkspace }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Create New Workplace</h3>
                <p className="text-orange-100 text-sm">Set up your workspace environment</p>
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
          <form onSubmit={onSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Workplace Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newWorkplace.name}
                onChange={(e) => setNewWorkplace({...newWorkplace, name: e.target.value})}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter workplace name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FiFileText className="inline mr-1" size={14} /> Description
              </label>
              <textarea
                value={newWorkplace.description}
                onChange={(e) => setNewWorkplace({...newWorkplace, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Describe the purpose of this workplace..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creatingWorkspace}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingWorkspace ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" size={18} />
                    Creating...
                  </div>
                ) : (
                  'Create Workplace'
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

export default CreateWorkplaceModal;
