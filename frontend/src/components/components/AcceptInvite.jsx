import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiMail,
  FiKey,
  FiLogIn,
  FiArrowRight,
  FiHome,
  FiBriefcase,
  FiLock,
  FiUser
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils/index';
import { acceptInviteToken } from '../../api/index';

const AcceptInvite = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { user, isAuthenticated, login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [inviteDetails, setInviteDetails] = useState(null);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);

  // Form state for unauthenticated users
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setError('No invitation token provided. Please check your invitation link.');
      setLoading(false);
      return;
    }

    // If user is already authenticated, auto-accept the invite
    if (isAuthenticated && !accepted) {
      handleAcceptInvite();
    }

    setLoading(false);
  }, [token, isAuthenticated, user]);

  // Accept invitation using token only (for authenticated users)
  const handleAcceptInvite = async () => {
    if (!token) {
      setError('No invitation token found');
      return;
    }

    setAccepting(true);
    setError(null);

    requestHandler(
      () => acceptInviteToken({ token }),
      setAccepting,
      (response) => {
        const data = response?.data || response;
        setInviteDetails(data);
        setAccepted(true);

        // Store workspace info if needed
        if (data?.workspace) {
          localStorage.setItem('lastJoinedWorkspace', JSON.stringify(data.workspace));
        }

        // Redirect after success
        setTimeout(() => {
          navigate('/workspaces');
        }, 3000);
      },
      (error) => {
        console.error('Failed to accept invite:', error);
        setError(error?.message || 'Invalid or expired invitation link. Please contact your workspace administrator.');
        setAccepting(false);
      }
    );
  };

  // Handle form submission with email, password, and token
  const handleSubmitWithCredentials = async (e) => {
    e.preventDefault();

    // Validate token exists
    if (!token) {
      setFormError('Invalid invitation link. No token found.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      // Call API with token, email, and password
      const response = await acceptInviteToken({
        token,
        email: formData.email,
        password: formData.password
      });

      const data = response?.data || response;

      // Login the user with the returned tokens
      if (data?.accessToken && data?.user) {
        login(data.accessToken, data.user);

        // Store user data if needed
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      // Set invite details for success screen
      setInviteDetails(data);
      setAccepted(true);

      // Redirect after success
      setTimeout(() => {
        navigate('/workspaces');
      }, 3000);

    } catch (err) {
      console.error('Failed to accept invite:', err);
      setFormError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to accept invitation. Please check your credentials or the invitation link.'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (formError) setFormError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FiLoader className="animate-spin text-blue-600 w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Invitation</h2>
          <p className="text-gray-600">Please wait...</p>
        </motion.div>
      </div>
    );
  }

  // Error state - invalid or expired token (only for token validation errors)
  // if (error && !accepted && !formError) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
  //       >
  //         <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <FiAlertCircle className="text-red-500 w-10 h-10" />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Invitation</h2>
  //         <p className="text-gray-600 mb-6">{error}</p>
  //         <p className="text-sm text-gray-500 mb-6">
  //           This invitation link may have expired or been used already.
  //           Please contact your workspace administrator for a new invitation.
  //         </p>
  //         <button
  //           onClick={() => navigate('/')}
  //           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
  //         >
  //           <FiHome size={18} />
  //           Go to Home
  //         </button>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // Success state - invite accepted
  // if (accepted && inviteDetails) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
  //       >
  //         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <FiCheckCircle className="text-green-500 w-10 h-10" />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Aboard! 🎉</h2>
  //         <p className="text-gray-600 mb-4">
  //           You have successfully joined the workspace
  //         </p>
  //         <div className="bg-gray-50 rounded-lg p-4 mb-6">
  //           <div className="flex items-center justify-center gap-2 mb-2">
  //             <FiBriefcase className="text-purple-500" />
  //             <p className="text-sm font-medium text-gray-800">
  //               {inviteDetails?.workspace?.name || inviteDetails?.workspaceName || 'Workspace'}
  //             </p>
  //           </div>
  //           <p className="text-sm text-gray-600 mb-2">Your Role:</p>
  //           <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
  //             {inviteDetails?.role || inviteDetails?.userRole || 'Team Member'}
  //           </span>
  //         </div>
  //         <p className="text-sm text-gray-500 mb-6">
  //           Redirecting you to your dashboard in a few seconds...
  //         </p>
  //         <button
  //           onClick={() => navigate('/workspaces')}
  //           className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
  //         >
  //           Go to Workspaces
  //           <FiArrowRight size={18} />
  //         </button>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // // User is authenticated and ready to accept
  // if (isAuthenticated && user && !accepted && !accepting) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  //       <motion.div
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
  //       >
  //         <div className="text-center mb-6">
  //           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <FiCheckCircle className="text-green-600 w-8 h-8" />
  //           </div>
  //           <h2 className="text-2xl font-bold text-gray-800">Accept Invitation</h2>
  //           <p className="text-gray-600 mt-2">
  //             Hello <strong>{user?.name || user?.email}</strong>!
  //           </p>
  //         </div>

  //         <div className="bg-gray-50 rounded-lg p-4 mb-6">
  //           <div className="flex items-center justify-center gap-2 mb-2">
  //             <FiKey className="text-purple-500" />
  //             <p className="text-sm text-gray-600">
  //               You have a pending invitation to join a workspace
  //             </p>
  //           </div>
  //           <p className="text-xs text-gray-500 text-center">
  //             Click the button below to join the workspace
  //           </p>
  //         </div>

  //         <button
  //           onClick={handleAcceptInvite}
  //           disabled={accepting}
  //           className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  //         >
  //           {accepting ? (
  //             <FiLoader className="animate-spin" />
  //           ) : (
  //             <FiCheckCircle size={18} />
  //           )}
  //           {accepting ? 'Accepting...' : 'Accept Invitation'}
  //         </button>

  //         <button
  //           onClick={() => navigate('/')}
  //           className="w-full mt-3 text-gray-600 py-2 hover:text-gray-800 transition-colors text-sm"
  //         >
  //           Decline & Go Home
  //         </button>
  //       </motion.div>
  //     </div>
  //   );
  // }

  // Login form for unauthenticated users (with email, password, and token)
  // This is the main flow: token exists → show form → submit with token + credentials
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Accept Your Invitation</h2>
          <p className="text-gray-600 mt-2">
            You've been invited to join a workspace
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiKey className="text-blue-600" />
            <p className="text-sm text-gray-700 font-medium">
              Invitation Ready
            </p>
          </div>
          <p className="text-xs text-gray-600 text-center">
            Please login with your credentials to accept this invitation
          </p>
        </div>

        <form onSubmit={handleSubmitWithCredentials} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100"
            >
              {formError}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {formLoading ? (
              <>
                <FiLoader className="animate-spin" />
                Accepting Invitation...
              </>
            ) : (
              <>
                <FiLogIn size={18} />
                Accept Invitation & Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Show token info for debugging (optional, remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500 text-center">
            <p>Token present: {token ? '✓' : '✗'}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AcceptInvite;
