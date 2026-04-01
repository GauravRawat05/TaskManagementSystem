import React, { useState, useEffect } from 'react';
import { FiX, FiCopy, FiCheckCircle, FiLink, FiLoader, FiMail, FiUserPlus, FiShield, FiUserCheck } from 'react-icons/fi';

const InviteMemberModal = ({
  show,
  onClose,
  onSubmit,
  inviteData,
  setInviteData,
  isSuperuser,
  userRole,
  loading,
  generatedLink,
  setGeneratedLink
}) => {
  const [copied, setCopied] = useState(false);

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
    if (show && inviteData && !roles.find(r => r.value === inviteData.role)) {
      setInviteData(prev => ({ ...prev, role: roles[0].value }));
    }
  }, [show, inviteData?.role]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      role: inviteData.role,
      email: inviteData.email || undefined
    });
  };

  const selectedRole = roles.find(r => r.value === inviteData.role);
  const RoleIcon = selectedRole?.icon || FiUserPlus;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiLink className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Generate Invite Link</h3>
                <p className="text-indigo-100 text-sm">Invite members to your workspace</p>
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
          {!generatedLink ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FiMail className="inline mr-1" size={14} /> Email (Optional)
                </label>
                <input
                  type="email"
                  value={inviteData.email || ''}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="user@example.com (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If email is provided, the link will be tied to this email
                </p>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {roles.map(role => {
                    const Icon = role.icon;
                    const isSelected = inviteData.role === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setInviteData({ ...inviteData, role: role.value })}
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
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl mb-5 border border-indigo-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiLink className="text-indigo-600" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Shareable Link</p>
                    <p className="text-xs text-gray-600">
                      Generate a unique link that can be shared with anyone. Links expire after 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" />
                    Generating Link...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FiLink size={18} />
                    Generate Invite Link
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiCheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Invite Link Generated!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Share this link with anyone. Valid for 24 hours.
              </p>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl mb-3 border border-indigo-200">
                <p className="text-xs text-gray-500 mb-1">Token:</p>
                <code className="text-sm font-mono text-indigo-600 break-all">
                  {generatedLink}
                </code>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-200">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-blue-600 break-all flex-1 font-mono">
                    {window.location.origin}/accept-invite?token={generatedLink}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/accept-invite?token=${generatedLink}`)}
                    className="p-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all flex-shrink-0"
                    title="Copy link"
                  >
                    {copied ? <FiCheckCircle size={16} className="text-green-500" /> : <FiCopy size={16} className="text-gray-600" />}
                  </button>
                </div>
              </div>

              {copied && (
                <p className="text-xs text-green-600 mb-4 animate-pulse">Copied to clipboard!</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setGeneratedLink(null);
                    setInviteData({ email: '', role: isAdminOrSuperuser ? 'ADMIN' : 'MEMBER' });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2.5 rounded-xl hover:from-gray-900 hover:to-black transition-all font-medium"
                >
                  Generate Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteMemberModal;
