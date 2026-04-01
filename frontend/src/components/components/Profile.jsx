import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiLock,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiPhone,
  FiShield,
  FiMail as FiMailCheck
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils/index';
import { changeCurrentPassword, updateUserProfile, updateUserAvatar } from '../../api/index';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  // Form states based on your data structure
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: '',
    bio: ''
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        domain: user?.domain || '',
        bio: user?.bio || ''
      });
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      setLoading(false);
      return;
    }

    // Validate phone if provided
    if (formData.phone && !/^[+]?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      showToast('Please enter a valid phone number', 'error');
      setLoading(false);
      return;
    }

    requestHandler(
      () => updateUserProfile(formData),
      setLoading,
      (response) => {
        const updatedUser = response?.data || response;
        setUser(updatedUser);
        setIsEditing(false);
        showToast('Profile updated successfully! ✨', 'success');
      },
      (error) => {
        console.error("Failed to update profile:", error);
        showToast(error?.message || 'Failed to update profile', 'error');
      }
    );
  };

  // Handle avatar update
  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a valid image file (JPEG, PNG, or WEBP)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const avatarFormData = new FormData();
    avatarFormData.append('avatar', file);

    setAvatarLoading(true);

    requestHandler(
      () => updateUserAvatar(avatarFormData),
      setAvatarLoading,
      (response) => {
        const updatedUser = response?.data || response;
        setUser(updatedUser);
        showToast('Avatar updated successfully! 📸', 'success');
      },
      (error) => {
        console.error("Failed to update avatar:", error);
        showToast(error?.message || 'Failed to update avatar', 'error');
      }
    );
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      showToast('New password must be different from current password', 'error');
      return;
    }

    setLoading(true);

    requestHandler(
      () => changeCurrentPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }),
      setLoading,
      () => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
        showToast('Password changed successfully! 🔒', 'success');
      },
      (error) => {
        console.error("Failed to change password:", error);
        showToast(error?.message || 'Failed to change password', 'error');
      }
    );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    const name = user?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff&size=150&bold=true`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <FiCheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <FiAlertCircle className="w-5 h-5" />}
              <span className="font-medium">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-37 left-6 group">
              <div className="relative">
                <img
                  src={getAvatarUrl()}
                  alt={user?.name || 'User'}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 hover:scale-105 transform"
                  title="Change avatar"
                >
                  {avatarLoading ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiCamera className="w-4 h-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarUpdate}
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                      placeholder="Your name"
                      required
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
                      placeholder="Email address"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <p className="text-gray-600 flex items-center gap-1">
                        <FiMail size={14} />
                        {user?.email}
                      </p>
                      {user?.phone && (
                        <p className="text-gray-600 flex items-center gap-1">
                          <FiPhone size={14} />
                          {user.phone}
                        </p>
                      )}
                    </div>
                    {user?.domain && (
                      <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                        <FiShield size={14} />
                        Domain: {user.domain}
                      </p>
                    )}
                  </div>
                )}

                {!isEditing && (
                  <div className="flex flex-wrap gap-4 mt-3">
                    {user?.createdAt && (
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <FiCalendar size={14} />
                        Joined {formatDate(user.createdAt)}
                      </p>
                    )}
                    {user?.isEmailVerified !== undefined && (
                      <p className={`text-sm flex items-center gap-1 ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                        <FiMailCheck size={14} />
                        {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                      </p>
                    )}
                    {user?.isSuperuser && (
                      <p className="text-sm flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        <FiShield size={12} />
                        Superuser
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {!isEditing && !isChangingPassword && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <FiEdit2 size={16} />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="flex items-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <FiLock size={16} />
                      Change Password
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {(formData.bio || isEditing) && (
              <div className="mt-4">
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                    maxLength="500"
                  />
                ) : (
                  user?.bio && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                    </div>
                  )
                )}
              </div>
            )}


            {/* Edit Form Actions */}
            {isEditing && (
              <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSave size={16} />}
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      domain: user?.domain || '',
                      bio: user?.bio || ''
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <FiX size={16} />
                  Cancel
                </button>
              </div>
            )}

            {/* Password Change Form */}
            {isChangingPassword && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? <FiLoader className="animate-spin" /> : <FiLock size={16} />}
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {user?.activities?.length > 0 ? (
              user.activities.map((activity, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-700">{activity.description}</p>
                  <p className="text-gray-500 text-sm mt-1">{formatDate(activity.date)}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <FiCheckCircle className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
