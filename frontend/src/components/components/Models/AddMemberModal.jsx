import React, { useState } from 'react';
import { FiX, FiUserPlus, FiUsers, FiMail, FiUser } from 'react-icons/fi';

const AddMemberModal = ({ show, onClose, onSubmit, team, availableUsers, existingMembers }) => {
  const [selectedMember, setSelectedMember] = useState('');

  if (!show) return null;

  const availableMembers = availableUsers?.filter(
    user => !existingMembers?.some(m => m._id === user._id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMember) {
      onSubmit(team._id, selectedMember);
      setSelectedMember('');
    }
  };

  const selectedUser = availableMembers?.find(u => u._id === selectedMember);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiUsers className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Add Team Member
                </h3>
                <p className="text-purple-100 text-sm">
                  to {team?.teamName}
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
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">Choose a member to add...</option>
                  {availableMembers?.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedUser && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl mb-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FiMail className="text-gray-400 text-xs" />
                      <p className="text-xs text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {availableMembers?.length === 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <FiUsers className="text-amber-600" size={14} />
                  </div>
                  <p className="text-sm text-amber-800">
                    No available members to add. All workspace members are already in this team.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!selectedMember || availableMembers?.length === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiUserPlus size={18} />
                  Add Member
                </div>
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

export default AddMemberModal;
