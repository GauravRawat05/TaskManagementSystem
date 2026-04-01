import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const DeleteWorkplaceModal = ({ isOpen, onClose, workplaceName, onDelete }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isConfirmValid = confirmText === workplaceName;

  const handleDelete = async () => {
    if (!isConfirmValid) return;
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="bg-red-100 p-2 rounded-xl">
                <FiAlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Workspace</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed bg-red-50 p-4 rounded-xl text-red-800 border border-red-100 font-medium">
              This action <span className="font-bold">cannot be undone</span>. This will permanently delete the 
              <strong> {workplaceName} </strong> workspace, including all associated projects, teams, tasks, and data.
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Please type <span className="bg-gray-100 px-2 py-1 rounded text-red-600 select-all font-mono">{workplaceName}</span> to confirm.
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all placeholder-gray-400 text-gray-700 bg-gray-50 focus:bg-white font-mono"
                placeholder="Type workspace name..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmValid || isDeleting}
              className={`px-5 py-2.5 rounded-xl font-bold flex items-center justify-center min-w-[120px] transition-all
                ${isConfirmValid 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Workspace'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteWorkplaceModal;
