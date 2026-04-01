import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyWorkspaceRole } from '../../api';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import WorkPlaceHome from '../components/WorkPlaceHome'; // existing manager dashboard
import TeamLeaderDashboard from './TeamLeaderDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import { useAuth } from '../../context/AuthContext';

const WorkspaceRoleRouter = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        // If user is superuser, bypass fetch and assume ADMIN
        if (user?.isSuperuser || user?.is_superuser) {
          setRole('ADMIN');
          return;
        }

        const res = await getMyWorkspaceRole(workspaceId);
        // Assuming API returns { success: true, data: { role: 'MEMBER' } }
        const userRole = res?.data?.data?.role || res?.data?.role || 'MEMBER';
        setRole(userRole);
      } catch (err) {
        console.error("Failed to fetch workspace role:", err);
        setError("Failed to verify access to this workspace.");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchRole();
    } else {
      setLoading(false);
      setError("No workspace selected");
    }
  }, [workspaceId, isAuthenticated, authLoading, user, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiLoader className="animate-spin text-indigo-600 w-10 h-10 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Entering Workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <FiAlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Access Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => navigate('/workspaces')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Workspaces
          </button>
        </div>
      </div>
    );
  }

  // Render correct dashboard based on role
  if (role === 'ADMIN' || role === 'MANAGER') {
    return <WorkPlaceHome />;
  } else if (role === 'TEAM_LEADER') {
    return <TeamLeaderDashboard />;
  } else {
    // Default to MEMBER
    return <TeamMemberDashboard />;
  }
};

export default WorkspaceRoleRouter;
