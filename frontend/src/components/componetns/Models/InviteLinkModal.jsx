import React, { useState, useEffect } from 'react';
import { FiX, FiMail, FiLoader, FiCheckCircle, FiSend, FiUserPlus, FiShield, FiUserCheck } from 'react-icons/fi';

const InviteLinkModal = ({
  show,
  onClose,
  onSubmit,
  inviteLinkData,
  setInviteLinkData,
  generatingLink,
  isSuperuser,
  userRole
}) => {
  const [emailSent, setEmailSent] = useState(false);

  if (!show) return null;

  const isAdminOrSuperuser = isSuperuser || userRole === 'Admin' || userRole === 'ADMIN';

  const roles = isAdminOrSuperuser
    ? [
        { value: 'ADMIN', label: 'Admin', icon: FiShield, color: 'red', description: 'Full control over workspace' },
        { value: 'MANAGER', label: 'Manager', icon: FiShield, color: 'purple', description: 'Can manage projects and teams' }
      ]
    : [
        { value: 'MEMBER', label: 'Team Member', icon: FiUserCheck, color: 'blue', description: 'Standard member access' }
      ];

  useEffect(() => {
    if (show && inviteLinkData && !roles.find(r => r.value === inviteLinkData.role)) {
      setInviteLinkData(prev => ({ ...prev, role: roles[0].value }));
    }
  }, [show, inviteLinkData?.role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      role: inviteLinkData.role,
      email: inviteLinkData.email
    });
    setEmailSent(true);
  };

  const selectedRole = roles.find(r => r.value === inviteLinkData.role);
  const RoleIcon = selectedRole?.icon || FiMail;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiMail className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Send Email Invitation</h3>
                <p className="text-blue-100 text-sm">Invite someone to join your workspace</p>
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

        <div className="p-6 overflow-y-auto custom-scrollbar">
          {!emailSent ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiMail className="inline mr-1" size={14} /> Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteLinkData.email || ''}
                  onChange={(e) => setInviteLinkData({ ...inviteLinkData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="user@example.com"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {roles.map(role => {
                    const Icon = role.icon;
                    const isSelected = inviteLinkData.role === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setInviteLinkData({ ...inviteLinkData, role: role.value })}
                        className={`w-full p-3 border-2 rounded-xl transition-all duration-200 text-left ${
                          isSelected
                            ? `border-${role.color}-500 bg-${role.color}-50 ring-2 ring-${role.color}-200`
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? `bg-${role.color}-100` : 'bg-gray-100'
                          }`}>
                            <Icon className={`text-${role.color}-600`} size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${isSelected ? `text-${role.color}-700` : 'text-gray-700'}`}>
                                {role.label}
                              </span>
                              {isSelected && (
                                <FiCheckCircle className={`text-${role.color}-500`} size={14} />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{role.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Role assigned when the user accepts the invitation
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl mb-5 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-blue-600" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Email Invitation</p>
                    <p className="text-xs text-gray-600">
                      An email will be sent to the user with instructions to join this workspace.
                      The invitation will expire after 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={generatingLink}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingLink ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Sending Invitation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiSend size={18} />
                    Send Email Invitation
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiCheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Invitation Sent!</h3>
              <p className="text-sm text-gray-600 mb-4">
                An email invitation has been sent to <strong className="text-blue-600">{inviteLinkData.email}</strong>
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl mb-5">
                <p className="text-xs text-gray-600">
                  The user will receive instructions on how to join the workspace.
                  They will be assigned the role of <strong>{selectedRole?.label || 'Team Member'}</strong>.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setEmailSent(false);
                  setInviteLinkData({ email: '', role: isAdminOrSuperuser ? 'ADMIN' : 'MEMBER' });
                }}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl hover:from-gray-900 hover:to-black transition-all font-medium"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteLinkModal;
