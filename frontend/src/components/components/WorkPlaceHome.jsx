import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FiAlertCircle, FiLoader, FiLogOut, FiBriefcase, FiChevronDown, FiChevronUp, FiCheck, FiPlus, FiX, FiCalendar } from 'react-icons/fi';
import {
  addNewMemberInTeam,
  addWorkspaceManager,
  bulkUploadUsers,
  createProject,
  createTeam,
  createWorkspace,
  deleteProject,
  deleteTeam,
  generateInviteToken,
  getAllUsers,
  getProjects,
  getTeams,
  getWorkspaceById,
  getWorkspaces,
  removeTeamLeaderAndAddToTeam,
  removeTeamMember,
  setNewTeamLeader,
  updateProject,
  updateProjectDeadline,
  updateTeam,
  updateUserRole,
  removeWorkspaceMember,
  inviteUserToWorkspace,
  deleteWorkspace
} from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils/index';
import { Athenura_Nav_Image } from '../../assets';

// Lazy load components
const AnalyticsTab = lazy(() => import('./AnalyticsTab'));
const Dashboard = lazy(() => import('./Dashboard'));
const GlobalPoolTab = lazy(() => import('./GlobalPoolTab'));
const InvitesTab = lazy(() => import('./InvitesTab'));
const MembersTab = lazy(() => import('./MembersTab'));
const BulkUploadModal = lazy(() => import('./Models/BulkUploadModal'));
const CreateProjectModal = lazy(() => import('./Models/CreateProjectModal'));
const CreateTeamModal = lazy(() => import('./Models/CreateTeamModal'));
const CreateWorkplaceModal = lazy(() => import('./Models/CreateWorkplaceModal'));
const InviteLinkModal = lazy(() => import('./Models/InviteLinkModal'));
const InviteMemberModal = lazy(() => import('./Models/InviteMemberModal'));
const ProjectsTab = lazy(() => import('./ProjectsTab'));
const Sidebar = lazy(() => import('./Sidebar'));
const TeamsTab = lazy(() => import('./TeamsTab'));
const Profile = lazy(() => import('./Profile'));
const TaskComponent = lazy(() => import('./TaskComponent'));
const AddMemberModal = lazy(() => import('./Models/AddMemberModal'));
const DeleteWorkplaceModal = lazy(() => import('./Models/DeleteWorkplaceModal'));

// Loading fallback component
const LoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mx-auto mb-3" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const ModalLoadingFallback = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
        <FiLoader className="animate-spin text-blue-600 w-10 h-10 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading component...</p>
      </div>
    </div>
);


// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <FiAlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Please refresh the page or try again later</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const WorkPlaceHome = () => {
  const { user, role, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { workspaceId: urlWorkspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // User Info
  const [currentUserRole, setCurrentUserRole] = useState('MEMBER');
  const [isSuperuser, setIsSuperuser] = useState(false);

  // Workplace States
  const [selectedWorkplace, setSelectedWorkplace] = useState(null);
  const [workplaces, setWorkplaces] = useState([]);
  const [currentWorkplaceDetails, setCurrentWorkplaceDetails] = useState(null);

  // Loading States
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(false);
  const [loadingWorkplaceDetails, setLoadingWorkplaceDetails] = useState(false);
  const [creatingWorkspace, setCreatingWorkspace] = useState(false);
  const [addingManager, setAddingManager] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Data States
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [interns, setInterns] = useState([]);
  const [loadingInterns, setLoadingInterns] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [globalUsers, setGlobalUsers] = useState([]);
  const [loadingGlobalUsers, setLoadingGlobalUsers] = useState(false);

  // Form States
  const [newWorkplace, setNewWorkplace] = useState({ name: '', description: '' });
  const [newGlobalUser, setNewGlobalUser] = useState({ name: '', email: '', phone: '' });
  const [inviteData, setInviteData] = useState({ email: '', role: 'MEMBER' });
  const [inviteLinkData, setInviteLinkData] = useState({ email: '', role: 'MEMBER' });

  // Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showWorkplaceDropdown, setShowWorkplaceDropdown] = useState(false);
  const [showCreateWorkplaceModal, setShowCreateWorkplaceModal] = useState(false);
  const [showDeleteWorkplaceModal, setShowDeleteWorkplaceModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(null);
  const [showEditDeadlineModal, setShowEditDeadlineModal] = useState(null);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(null);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showMemberProfileModal, setShowMemberProfileModal] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // { type: 'project'|'team'|'member', id: string, name: string }


  // Additional States
  const [generatedToken, setGeneratedToken] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [addingGlobalUser, setAddingGlobalUser] = useState(false);

  // Task related states
  const [selectedProjectForTasks, setSelectedProjectForTasks] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Helper Functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get active tab from URL path
  const getActiveTabFromPath = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/teams')) return 'teams';
    if (path.includes('/members')) return 'members';
    if (path.includes('/tasks')) return 'tasks';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/global-pool')) return 'global-pool';
    if (path.includes('/invites')) return 'invites';
    if (path.includes('/profile')) return 'profile';
    return 'dashboard';
  }, [location.pathname]);

  // Update active tab when URL changes
  useEffect(() => {
    const tabFromUrl = getActiveTabFromPath();
    setActiveTab(tabFromUrl);
  }, [getActiveTabFromPath]);

  // Handle tab change with navigation
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedProjectForTasks(null);
    const basePath = `/workspace/${selectedWorkplace}`;
    switch(tabId) {
      case 'dashboard':
        navigate(basePath);
        break;
      case 'projects':
        navigate(`${basePath}/projects`);
        break;
      case 'teams':
        navigate(`${basePath}/teams`);
        break;
      case 'members':
        navigate(`${basePath}/members`);
        break;
      case 'tasks':
        navigate(`${basePath}/tasks`);
        break;
      case 'analytics':
        navigate(`${basePath}/analytics`);
        break;
      case 'global-pool':
        navigate(`${basePath}/global-pool`);
        break;
      case 'invites':
        navigate(`${basePath}/invites`);
        break;
      case 'profile':
        navigate(`${basePath}/profile`);
        break;
      default:
        navigate(basePath);
    }
  }, [selectedWorkplace, navigate]);

  // Handle workspace change with navigation
  const handleWorkspaceChange = useCallback((workspaceId) => {
    setSelectedWorkplace(workspaceId);
    setSelectedProjectForTasks(null);
    const currentPath = location.pathname;
    const pathWithoutWorkspace = currentPath.replace(/\/workspace\/[^/]+/, '');
    navigate(`/workspace/${workspaceId}${pathWithoutWorkspace || ''}`);
  }, [navigate, location.pathname]);

  // Get user's role in current workspace
  const getUserWorkspaceRole = useCallback(() => {
    if (!user || !members.length) return 'MEMBER';
    const currentMember = members.find(m => m.userId === user._id || m._id === user._id);
    return currentMember?.role?.toUpperCase() || 'MEMBER';
  }, [user, members]);

  // Update currentUserRole based on members
  useEffect(() => {
    if (user) {
      const role = getUserWorkspaceRole();
      setCurrentUserRole(role);
      setIsSuperuser(user.isSuperuser || false);
    }
  }, [user, members, getUserWorkspaceRole]);

  // Role-based permission checks
  const isAdmin = useCallback(() => {
    return isSuperuser || currentUserRole === 'ADMIN';
  }, [isSuperuser, currentUserRole]);

  const isManager = useCallback(() => {
    return isSuperuser || currentUserRole === 'MANAGER' || currentUserRole === 'ADMIN';
  }, [isSuperuser, currentUserRole]);

  const isTeamLeader = useCallback(() => {
    return isSuperuser || currentUserRole === 'TEAM_LEADER' || isManager();
  }, [isSuperuser, currentUserRole, isManager]);

  const canCreateWorkplace = useCallback(() => {
    return isSuperuser;
  }, [isSuperuser]);

  const canCreateProject = useCallback(() => {
    return true;
  }, []);

  const canCreateTeam = useCallback(() => {
    return true;
  }, []);

  const canInviteMembers = useCallback(() => {
    return isAdmin() || isManager() || isSuperuser;
  }, [isAdmin, isManager, isSuperuser]);

  const canViewAllProjects = useCallback(() => {
    return true;
  }, []);

  const canViewAllTeams = useCallback(() => {
    return true;
  }, []);

  const canEditProject = useCallback(() => {
    return true;
  }, []);

  const canDeleteProject = useCallback(() => {
    return true;
  }, []);

  const canManageMembers = useCallback(() => {
    return isAdmin() || isSuperuser;
  }, [isAdmin, isSuperuser]);

  const canManageTeams = useCallback(() => {
    return true;
  }, []);

  const isMemberOnly = useCallback(() => {
    return currentUserRole === 'MEMBER' && !isSuperuser;
  }, [currentUserRole, isSuperuser]);

  // Format members from API
  const formatMembersData = useCallback((membersData) => {
    if (!membersData || !Array.isArray(membersData)) return [];
    return membersData.map(member => ({
      _id: member.user?._id || member._id,
      userId: member.user?._id || member._id,
      name: member.user?.name || member.name,
      email: member.user?.email || member.email,
      role: member.role?.toUpperCase() || 'MEMBER',
      joinedAt: member.joinedAt || member.createdAt || new Date().toISOString(),
    }));
  }, []);

  // Load Workspaces
  const loadWorkspaces = useCallback(() => {
    requestHandler(
      getWorkspaces,
      setLoadingWorkspaces,
      (response) => {
        const workspaceData = response?.data || response || [];
        setWorkplaces(workspaceData);

        if (workspaceData.length > 0) {
          if (urlWorkspaceId) {
            const workspace = workspaceData.find(w => w._id === urlWorkspaceId);
            if (workspace) {
              setSelectedWorkplace(urlWorkspaceId);
            } else {
              setSelectedWorkplace(workspaceData[0]._id);
              navigate(`/workspace/${workspaceData[0]._id}`, { replace: true });
            }
          } else {
            setSelectedWorkplace(workspaceData[0]._id);
            navigate(`/workspace/${workspaceData[0]._id}`, { replace: true });
          }
        }
      },
      (error) => {
        console.error("Failed to load workspaces:", error);
        showToast('Failed to load workspaces', 'error');
      }
    );
  }, [urlWorkspaceId, navigate]);

  // Load Workspace Details
  const loadWorkspaceDetails = useCallback((workspaceId) => {
    if (!workspaceId) return;

    requestHandler(
      () => getWorkspaceById({ workspaceId }),
      setLoadingWorkplaceDetails,
      (response) => {
        const data = response?.data || response;
        setCurrentWorkplaceDetails(data);

        const formattedMembers = formatMembersData(data?.members);
        setMembers(formattedMembers);

        const allUsers = formattedMembers.map(m => ({
          _id: m.userId || m._id,
          name: m.name,
          email: m.email,
          role: m.role
        }));
        setAvailableUsers(allUsers);

        if (data?.projects) {
          setProjects(data.projects);
        }
      },
      (error) => {
        console.error("Failed to load workspace details:", error);
        const foundWorkplace = workplaces?.find(w => w._id === workspaceId);
        setCurrentWorkplaceDetails(foundWorkplace);
      }
    );
  }, [workplaces, formatMembersData]);

  // Load Projects
  const loadProjects = useCallback(() => {
    if (!selectedWorkplace) return;

    requestHandler(
      () => getProjects({ workspaceId: selectedWorkplace }),
      setLoadingProjects,
      (response) => {
        const data = response?.data || response;
        setProjects(data || []);
      },
      (error) => {
        console.error("Failed to load projects:", error);
        setProjects([]);
      }
    );
  }, [selectedWorkplace]);

  // Load Teams
  const loadTeams = useCallback(() => {
    if (!selectedWorkplace) return;

    requestHandler(
      () => getTeams({ workspaceId: selectedWorkplace }),
      setLoadingTeams,
      (response) => {
        const data = response?.data || response;
        setTeams(data || []);
      },
      (error) => {
        console.error("Failed to load teams:", error);
        setTeams([]);
      }
    );
  }, [selectedWorkplace]);

  // Load Interns
  const loadInterns = useCallback(() => {
    requestHandler(
      getAllUsers,
      setLoadingInterns,
      (response) => {
        const data = response?.data || response;
        setInterns(data || []);
      },
      (error) => {
        console.error("Failed to load interns:", error);
        setInterns([]);
      }
    );
  }, []);

  // Load Global Users
  const loadGlobalUsers = useCallback(() => {
    requestHandler(
      getAllUsers,
      setLoadingGlobalUsers,
      (response) => {
        const data = response?.data || response;
        setGlobalUsers(data || []);
      },
      (error) => {
        console.error("Failed to load global users:", error);
        setGlobalUsers([]);
      }
    );
  }, []);

  // Update user role
  useEffect(() => {
    if (user && members.length > 0) {
      const role = getUserWorkspaceRole();
      setCurrentUserRole(role);
    }
  }, [user, members, getUserWorkspaceRole]);

  // Set superuser status
  useEffect(() => {
    if (user) {
      const isSuper = user.is_superuser || user.isSuperuser || role === 'Superuser' || user.userType === 'superuser';
      setIsSuperuser(isSuper);
    }
  }, [user, role]);

  // Load workspaces on auth
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadWorkspaces();
    }
  }, [isAuthenticated, authLoading, loadWorkspaces]);

  // Load workspace details when selected workspace changes
  useEffect(() => {
    if (selectedWorkplace && isAuthenticated) {
      loadWorkspaceDetails(selectedWorkplace);
      loadProjects();
      loadTeams();
      if (isSuperuser) {
        loadInterns();
      }
    }
  }, [selectedWorkplace, isAuthenticated, isSuperuser, loadWorkspaceDetails, loadProjects, loadTeams, loadInterns]);

  // Load global users for superuser
  useEffect(() => {
    if (isSuperuser && activeTab === 'global-pool' && isAuthenticated) {
      loadGlobalUsers();
    }
  }, [isSuperuser, activeTab, isAuthenticated, loadGlobalUsers]);

  // Member Utility Functions
  const getMembersByRole = useCallback((roleType) => {
    return members.filter(member => member.role === roleType);
  }, [members]);

  const getTeamMembers = useCallback((teamId) => {
    const team = teams.find(t => t._id === teamId);
    if (!team) return [];
    return members.filter(member => team.members?.includes(member.userId || member._id));
  }, [teams, members]);

  const getAvailableMembersForTeam = useCallback((teamId) => {
    const team = teams.find(t => t._id === teamId);
    if (!team) return members;
    const currentMemberIds = team.members || [];
    return members.filter(member => !currentMemberIds.includes(member.userId || member._id));
  }, [teams, members]);

  // Task handlers
  const handleViewProjectTasks = useCallback((project) => {
    setSelectedProjectForTasks(project);
  }, []);

  const handleCloseTasks = useCallback(() => {
    setSelectedProjectForTasks(null);
  }, []);

  // NEW: Workspace Member Management Handlers
  const handleInviteToWorkspace = useCallback(async (userId) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to invite users', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId,
        role: 'MEMBER'
      };

      await requestHandler(
        () => inviteUserToWorkspace(payload),
        setAddingManager,
        () => {
          showToast('User invited to workspace successfully!', 'success');
          loadWorkspaceDetails(selectedWorkplace);
          loadGlobalUsers(); // Refresh global users list
        },
        (error) => {
          console.error('Failed to invite user:', error);
          showToast(error?.message || 'Failed to invite user to workspace', 'error');
        }
      );
    } catch (error) {
      console.error('Failed to invite user:', error);
      showToast('Failed to invite user to workspace', 'error');
    }
  }, [selectedWorkplace, canInviteMembers, loadWorkspaceDetails, loadGlobalUsers]);

  const handleAssignRole = useCallback(async (userId, newRole) => {
    if (!canManageMembers()) {
      showToast('You do not have permission to assign roles', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId,
        role: newRole
      };

      await requestHandler(
        () => updateUserRole(payload),
        setUpdatingRole,
        () => {
          showToast(`User role updated to ${newRole} successfully!`, 'success');
          loadWorkspaceDetails(selectedWorkplace);
          setPendingRole(null); // Reset pending role
        },
        (error) => {
          console.error('Failed to assign role:', error);
          showToast(error?.message || 'Failed to assign user role', 'error');
        }
      );
    } catch (error) {
      console.error('Failed to assign role:', error);
      showToast('Failed to assign user role', 'error');
    }
  }, [selectedWorkplace, canManageMembers, loadWorkspaceDetails]);

  const handleRemoveFromWorkspace = useCallback(async (userId, name) => {
    setShowDeleteConfirm({ type: 'member', id: userId, name: name });
  }, []);

  const confirmRemoveFromWorkspace = useCallback(async (userId) => {
    if (!canManageMembers()) {
      showToast('You do not have permission to remove users', 'error');
      return;
    }

    try {
      const payload = {
        workspaceId: selectedWorkplace,
        userId: userId
      };

      await requestHandler(
        () => removeWorkspaceMember(payload),
        setUpdatingRole,
        () => {
          showToast('User removed from workspace successfully!', 'success');
          loadWorkspaceDetails(selectedWorkplace);
          setShowDeleteConfirm(null); // Close modal after success
        },
        (error) => {
          console.error('Failed to remove user:', error);
          showToast(error?.message || 'Failed to remove user from workspace', 'error');
          setShowDeleteConfirm(null); // Close modal on error
        }
      );
    } catch (error) {
      console.error('Failed to remove user:', error);
      showToast('Failed to remove user from workspace', 'error');
      setShowDeleteConfirm(null); // Close modal on error
    }
  }, [selectedWorkplace, canManageMembers, loadWorkspaceDetails]);

  // CRUD Operations (keeping existing ones)
  const handleDeleteWorkspace = useCallback(() => {
    if (!selectedWorkplace) return;
    
    requestHandler(
      () => deleteWorkspace(selectedWorkplace),
      () => {}, // set loading handling is internal to modal
      () => {
        showToast('Workspace deleted successfully!', 'success');
        setShowDeleteWorkplaceModal(false);
        // Navigate or reload
        const newWorkplaces = workplaces.filter(w => w._id !== selectedWorkplace);
        setWorkplaces(newWorkplaces);
        if (newWorkplaces.length > 0) {
          handleWorkspaceChange(newWorkplaces[0]._id);
        } else {
          // If no workspaces left, maybe clear URL
          setSelectedWorkplace(null);
          navigate('/dashboard');
        }
      },
      (error) => {
        console.error("Failed to delete workspace:", error);
        showToast(error?.message || 'Failed to delete workspace', 'error');
      }
    );
  }, [selectedWorkplace, workplaces, handleWorkspaceChange, navigate]);

  const handleCreateProject = useCallback((projectData) => {
    if (!projectData.projectName || !projectData.startDate || !projectData.deadline) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      workspaceId: selectedWorkplace,
      projectName: projectData.projectName,
      description: projectData.description,
      startDate: projectData.startDate,
      deadline: projectData.deadline,
      teamLeadId: projectData.teamLeadId,
      memberIds: projectData.memberIds || []
    };

    requestHandler(
      () => createProject(payload),
      setLoadingProjects,
      (response) => {
        const newProject = response?.data || response;
        setProjects(prev => [...prev, newProject]);
        setShowCreateProjectModal(false);
        showToast('Project created successfully! 🎉', 'success');
      },
      (error) => {
        console.error("Failed to create project:", error);
        showToast(error?.message || 'Failed to create project', 'error');
      }
    );
  }, [selectedWorkplace]);

  const handleUpdateProject = useCallback((projectId, formData) => {
    requestHandler(
      () => updateProject({ projectId, ...formData }),
      setLoadingProjects,
      () => {
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, ...formData } : p));
        setShowEditProjectModal(null);
        showToast('Project updated successfully! ✨', 'success');
      },
      (error) => {
        console.error("Failed to update project:", error);
        showToast('Failed to update project', 'error');
      }
    );
  }, []);

  const handleUpdateProjectDeadline = useCallback((projectId, deadline) => {
    requestHandler(
      () => updateProjectDeadline({ projectId, deadline }),
      setLoadingProjects,
      () => {
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, deadline } : p));
        setShowEditDeadlineModal(null);
        showToast('Project deadline updated successfully! 📅', 'success');
      },
      (error) => {
        console.error("Failed to update project deadline:", error);
        showToast('Failed to update deadline', 'error');
      }
    );
  }, []);

  const handleDeleteProject = useCallback((projectId, projectName) => {
    setShowDeleteConfirm({ type: 'project', id: projectId, name: projectName });
  }, []);

  const confirmDeleteProject = useCallback((projectId) => {
      requestHandler(
        () => deleteProject({ projectId, workspaceId: selectedWorkplace }),
        setLoadingProjects,
        () => {
          setProjects(prev => prev.filter(p => p._id !== projectId));
          showToast('Project deleted successfully! 🗑️', 'success');
          setShowDeleteConfirm(null); // Close modal after success
        },
        (error) => {
          console.error("Failed to delete project:", error);
          showToast('Failed to delete project', 'error');
          setShowDeleteConfirm(null); // Close modal on error
        }
      );
  }, [selectedWorkplace]);

  const handleCreateTeam = useCallback((teamData) => {
    const payload = {
      workSpaceId: selectedWorkplace,
      projectId: teamData.projectId,
      teamName: teamData.teamName,
      team: teamData.team,
      teamLeaderId: teamData.teamLeaderId
    };

    requestHandler(
      () => createTeam(payload),
      setLoadingTeams,
      (response) => {
        const newTeam = response?.data || response;
        setTeams(prev => [...prev, newTeam]);
        setShowCreateTeamModal(false);
        showToast('Team created successfully! 👥', 'success');
      },
      (error) => {
        console.error("Failed to create team:", error);
        showToast('Failed to create team', 'error');
      }
    );
  }, [selectedWorkplace]);

  const handleUpdateTeam = useCallback((teamData) => {
    const payload = {
      teamId: showEditTeamModal?._id,
      teamName: teamData.teamName,
      projectId: teamData.projectId,
      team: teamData.team,
      teamLeaderId: teamData.teamLeaderId,
      workSpaceId: selectedWorkplace
    };

    requestHandler(
      () => updateTeam(payload),
      setLoadingTeams,
      (response) => {
        const updatedTeam = response?.data || response;
        setTeams(prev => prev.map(t => t._id === updatedTeam._id ? updatedTeam : t));
        setShowEditTeamModal(null);
        showToast('Team updated successfully! ✨', 'success');
      },
      (error) => {
        console.error("Failed to update team:", error);
        showToast('Failed to update team', 'error');
      }
    );
  }, [showEditTeamModal, selectedWorkplace]);

  const handleAddMemberToTeam = useCallback((teamId, memberId) => {
    // Assuming addNewMemberInTeam is an imported API function
    // and it expects an object with teamId and newMemberId
    requestHandler(
      () => addNewMemberInTeam({ teamId, newMemberId: memberId }),
      setLoadingTeams,
      () => {
        showToast('Member added to team successfully! 👤', 'success');
        setShowAddMemberModal(null);
        loadTeams();
      },
      (error) => {
        console.error("Failed to add member:", error);
        showToast('Failed to add member', 'error');
      }
    );
  }, [loadTeams]);

   const handleRemoveTeamMember = useCallback((teamId, memberId, memberName) => {
    setShowDeleteConfirm({ type: 'team-member', id: memberId, name: memberName, extra: teamId });
  }, []);

  const confirmRemoveTeamMember = useCallback((memberId, teamId) => {
      requestHandler(
        () => removeTeamMember({ teamId, userId: memberId }),
        setLoadingTeams,
        () => {
          showToast('Member removed from team!', 'success');
          loadTeams();
          setShowDeleteConfirm(null);
        },
        (error) => {
          console.error("Failed to remove member:", error);
          showToast('Failed to remove member', 'error');
          setShowDeleteConfirm(null);
        }
      );
  }, [loadTeams]);

  const handleSetTeamLeader = useCallback((teamId, memberId) => {
    requestHandler(
      () => setNewTeamLeader({ teamId, memberId }),
      setLoadingTeams,
      () => {
        showToast('Team leader updated successfully! 👑', 'success');
        loadTeams();
      },
      (error) => {
        console.error("Failed to set team leader:", error);
        showToast('Failed to set team leader', 'error');
      }
    );
  }, [loadTeams]);

  const handleRemoveTeamLeaderAndAddToTeam = useCallback((teamId, memberId) => {
    requestHandler(
      () => removeTeamLeaderAndAddToTeam({ teamId, memberId }),
      setLoadingTeams,
      () => {
        showToast('Team leader removed and added as member!', 'success');
        loadTeams();
      },
      (error) => {
        console.error("Failed to remove team leader:", error);
        showToast('Failed to remove team leader', 'error');
      }
    );
  }, [loadTeams]);

  const handleDeleteTeam = useCallback((teamId, teamName) => {
    setShowDeleteConfirm({ type: 'team', id: teamId, name: teamName });
  }, []);

  const confirmDeleteTeam = useCallback((teamId) => {
      requestHandler(
        () => deleteTeam({ teamId, workspaceId: selectedWorkplace }),
        setLoadingTeams,
        () => {
          setTeams(prev => prev.filter(t => t._id !== teamId));
          showToast('Team deleted successfully! 🗑️', 'success');
        },
        (error) => {
          console.error("Failed to delete team:", error);
          showToast('Failed to delete team', 'error');
        }
      );
  }, [selectedWorkplace, deleteTeam, showToast]);

  const handleBulkUploadInterns = useCallback((file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(header => header.trim().toLowerCase());

      const users = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(val => val.trim());
        const user = {};
        headers.forEach((header, index) => {
          if (values[index]) {
            user[header] = values[index];
          }
        });

        if (user.name && user.email) {
          users.push({
            name: user.name,
            email: user.email,
            phone: user.phone || user.mobile || user.contact || '',
            domain: user.domain || user.role || user.department || '',
          });
        }
      }

      if (users.length === 0) {
        showToast('No valid users found in CSV file', 'error');
        setShowBulkUploadModal(false);
        setUploading(false);
        return;
      }

      requestHandler(
        () => bulkUploadUsers({ users }),
        setUploading,
        () => {
          setShowBulkUploadModal(false);
          showToast(`${users.length} users uploaded successfully! 📊`, 'success');
          loadGlobalUsers();
        },
        (error) => {
          console.error("Failed to upload users:", error);
          showToast('Bulk upload failed! Please check file format.', 'error');
          setUploading(false);
        }
      );
    };

    reader.onerror = () => {
      showToast('Error reading file', 'error');
      setUploading(false);
    };

    reader.readAsText(file);
  }, [loadGlobalUsers]);

  const handleAddToGlobalPool = useCallback((userData) => {
    if (!isSuperuser) {
      showToast('Only superusers can add users to global pool', 'error');
      return;
    }

    requestHandler(
      () => bulkUploadUsers({ users: [userData] }),
      setAddingGlobalUser,
      () => {
        const newUser = { _id: `user-${Date.now()}`, ...userData };
        setGlobalUsers(prev => [...prev, newUser]);
        setNewGlobalUser({ name: '', email: '', phone: '' });
        showToast('User added to Global Pool! Default pass: Welcome@123', 'success');
      },
      (error) => {
        console.error("Failed to add user:", error);
        showToast('Failed to add user', 'error');
        setAddingGlobalUser(false);
      }
    );
  }, [isSuperuser]);

  const handleGenerateInviteLink = useCallback((data) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to generate invite links', 'error');
      return;
    }

    const invitePayload = {
      workspaceId: selectedWorkplace,
      role: data.role,
      ...(data.email && { email: data.email })
    };

    requestHandler(
      () => generateInviteToken(invitePayload),
      setGeneratingLink,
      (response) => {
        const token = response?.data?.token || response?.token;
        setGeneratedToken(token);
        showToast('Invite link generated successfully! 🔗', 'success');
      },
      (error) => {
        console.error("Failed to generate invite link:", error);
        showToast('Failed to generate invite link', 'error');
      }
    );
  }, [selectedWorkplace, canInviteMembers]);

  const handleInviteSubmit = useCallback((invitePayload) => {
    if (!canInviteMembers()) {
      showToast('You do not have permission to send invitations', 'error');
      return;
    }

    const { role, email } = invitePayload;

    const payload = {
      workspaceId: selectedWorkplace,
      role: role,
      email: email
    };

    requestHandler(
      () => addWorkspaceManager(payload),
      setAddingManager,
      () => {
        setShowInviteLinkModal(false);
        showToast(`Invitation sent to ${email}!`, 'success');
        setInviteLinkData({ email: '', role: 'MEMBER' });
      },
      (error) => {
        console.error("Failed to send invite:", error);
        showToast('Failed to send invitation', 'error');
      }
    );
  }, [selectedWorkplace, canInviteMembers]);

  const handleCreateWorkplace = useCallback((e) => {
    e.preventDefault();
    if (!isSuperuser) {
      showToast('Only superusers can create workplaces', 'error');
      return;
    }

    const payload = { name: newWorkplace.name, description: newWorkplace.description };

    requestHandler(
      () => createWorkspace(payload),
      setCreatingWorkspace,
      (response) => {
        const newWorkplaceData = response?.data || response;
        setWorkplaces(prev => [...prev, newWorkplaceData]);
        setSelectedWorkplace(newWorkplaceData._id);
        setShowCreateWorkplaceModal(false);
        setNewWorkplace({ name: '', description: '' });
        showToast('Workplace created successfully! 🎉', 'success');
        navigate(`/workspace/${newWorkplaceData._id}`, { replace: true });
      },
      (error) => {
        console.error("Failed to create workplace:", error);
        showToast('Failed to create workplace', 'error');
      }
    );
  }, [newWorkplace, isSuperuser, navigate]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Render content based on active tab with Suspense
  const renderContent = useCallback(() => {
    const props = {
      selectedWorkplace,
      workplaces,
      loadingWorkspaces,
      projects,
      teams,
      members,
      availableUsers,
      globalUsers,
      loadingGlobalUsers,
      user,
      currentUserRole,
      isSuperuser,
      isAdmin: isAdmin(),
      isManager: isManager(),
      isTeamLeader: isTeamLeader(),
      isMemberOnly: isMemberOnly(),
      canCreateWorkplace: canCreateWorkplace(),
      canCreateProject: canCreateProject(),
      canCreateTeam: canCreateTeam(),
      canInviteMembers: canInviteMembers(),
      canViewAllProjects: canViewAllProjects(),
      canViewAllTeams: canViewAllTeams(),
      canManageMembers: canManageMembers(),
      canManageTeams: canManageTeams(),
      formatDate,
      daysLeft,
      canEditProject,
      canDeleteProject,
      setSelectedWorkplace: handleWorkspaceChange,
      setShowCreateWorkplaceModal,
      setShowDeleteWorkplaceModal,
      setShowInviteModal,
      setShowCreateProjectModal,
      setShowCreateTeamModal,
      setShowInviteLinkModal,
      setShowBulkUploadModal,
      handleDeleteProject,
      handleDeleteTeam,
      handleAddMemberToTeam,
      handleRemoveTeamMember,
      handleSetTeamLeader,
      handleRemoveTeamLeaderAndAddToTeam,
      handleAddToGlobalPool,
      handleBulkUploadInterns,
      handleUpdateProjectDeadline,
      handleCreateProject,
      handleCreateTeam,
      handleUpdateProject,
      handleUpdateTeam,
      showEditProjectModal,
      setShowEditProjectModal,
      showEditDeadlineModal,
      setShowEditDeadlineModal,
      showEditTeamModal,
      setShowEditTeamModal,
      showAddMemberModal,
      setShowAddMemberModal,
      newGlobalUser,
      setNewGlobalUser,
      csvFile,
      setCsvFile,
      addingGlobalUser,
      uploading,
      getMembersByRole,
      getTeamMembers,
      getAvailableMembersForTeam,
      onViewTasks: handleViewProjectTasks,
      // Workspace member management props
      onInviteToWorkspace: handleInviteToWorkspace,
      onAssignRole: handleAssignRole,
      onRemoveFromWorkspace: handleRemoveFromWorkspace,
      onViewProfile: (member) => setShowMemberProfileModal(member)
    };

    const contentMap = {
      dashboard: <Dashboard {...props} />,
      projects: <ProjectsTab {...props} />,
      teams: <TeamsTab {...props} />,
      members: <MembersTab {...props} />,
      tasks: (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Tasks</h2>
            <p className="text-gray-600">View and manage tasks across all projects</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">{project.projectName}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Due: {formatDate(project.deadline)}
                    </span>
                    <button
                      onClick={() => handleViewProjectTasks(project)}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                    >
                      View Tasks
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No projects available</p>
              </div>
            )}
          </div>
        </div>
      ),
      invites: (
        <InvitesTab
          setShowInviteModal={setShowInviteModal}
          setShowInviteLinkModal={setShowInviteLinkModal}
          canInviteMembers={canInviteMembers()}
        />
      ),
      analytics: <AnalyticsTab {...props} />,
      'global-pool': isSuperuser ? (
        <GlobalPoolTab
          {...props}
          selectedWorkplace={selectedWorkplace}
          members={members}
          currentUserRole={currentUserRole}
          isSuperuser={isSuperuser}
          isAdmin={isAdmin()}
          isManager={isManager()}
          user={user}
          canInviteMembers={canInviteMembers()}
          canManageMembers={canManageMembers()}
          onInviteToWorkspace={handleInviteToWorkspace}
          onAssignRole={handleAssignRole}
          onRemoveFromWorkspace={handleRemoveFromWorkspace}
        />
      ) : null,
      profile: <Profile {...props} />
    };

    const content = contentMap[activeTab] || contentMap.dashboard;

    return (
      <>
        <Suspense fallback={<LoadingFallback message={`Loading ${activeTab}...`} />}>
          {content}
        </Suspense>

        {/* Task Modal */}
        {selectedProjectForTasks && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Tasks for: {selectedProjectForTasks.projectName}</h2>
                  {selectedProjectForTasks.description && (
                    <p className="text-sm text-gray-600 mt-1">{selectedProjectForTasks.description}</p>
                  )}
                </div>
                <button
                  onClick={handleCloseTasks}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <Suspense fallback={<LoadingFallback message="Loading tasks..." />}>
                  <TaskComponent
                    projectId={selectedProjectForTasks._id}
                    members={availableUsers}
                    currentUserRole={currentUserRole}
                  />
                </Suspense>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }, [
    activeTab, selectedWorkplace, workplaces, loadingWorkspaces, projects, teams,
    members, availableUsers, globalUsers, loadingGlobalUsers, user, currentUserRole,
    isSuperuser, newGlobalUser, addingGlobalUser, csvFile, showEditProjectModal,
    showEditDeadlineModal, showEditTeamModal, showAddMemberModal,
    uploading, getMembersByRole, getTeamMembers, getAvailableMembersForTeam,
    handleCreateProject, handleCreateTeam, handleUpdateTeam, handleDeleteProject, handleDeleteTeam,
    handleAddMemberToTeam, handleRemoveTeamMember, handleSetTeamLeader,
    handleRemoveTeamLeaderAndAddToTeam, handleAddToGlobalPool, handleBulkUploadInterns,
    handleUpdateProject, handleUpdateProjectDeadline, handleWorkspaceChange,
    handleViewProjectTasks, handleCloseTasks, selectedProjectForTasks,
    isAdmin, isManager, isTeamLeader, isMemberOnly, canCreateWorkplace, canCreateProject,
    canCreateTeam, canInviteMembers, canViewAllProjects, canViewAllTeams, canManageMembers,
    canManageTeams, canEditProject, canDeleteProject, formatDate,
    handleInviteToWorkspace, handleAssignRole, handleRemoveFromWorkspace
  ]);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-indigo-600 w-8 h-8 mx-auto mb-3" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="text-red-500 w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Unauthorized</h2>
          <p className="text-gray-600 mt-2">Please login to access this page</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Toast Notifications */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-green-500 text-white' :
                toast.type === 'warning' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <img
                  src={Athenura_Nav_Image}
                  alt="Logo"
                  className="h-12 w-auto"
                  style={{ borderRadius: "50%" }}
                />

                {/* Workplace Switcher Button (Moved from Dashboard) */}
                <div className="relative ml-4 hidden sm:block">
                  <button
                    onClick={() => setShowWorkplaceDropdown(!showWorkplaceDropdown)}
                    className="flex items-center gap-2 text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 transition-all shadow-sm"
                  >
                    <FiBriefcase className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                      {workplaces?.find(w => w._id === selectedWorkplace)?.name || 'Select Workspace'}
                    </span>
                    {showWorkplaceDropdown ? (
                      <FiChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <FiChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showWorkplaceDropdown && workplaces && workplaces.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
                      >
                        <div className="p-2 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                          <p className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wider">Switch Workspace</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          {workplaces.map((workplace) => (
                            <button
                              key={workplace._id}
                              onClick={() => {
                                handleWorkspaceChange(workplace._id);
                                setShowWorkplaceDropdown(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                                selectedWorkplace === workplace._id ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0 pr-3">
                                <div className="flex items-center gap-2">
                                  <FiBriefcase className={`w-4 h-4 flex-shrink-0 ${
                                    selectedWorkplace === workplace._id ? 'text-blue-500' : 'text-gray-400'
                                  }`} />
                                  <span className={`text-sm font-medium truncate flex-1 ${
                                    selectedWorkplace === workplace._id ? 'text-blue-600' : 'text-gray-700'
                                  }`}>
                                    {workplace.name}
                                  </span>
                                </div>
                                {workplace.description && (
                                  <p className="text-xs text-gray-400 mt-1 truncate pl-6">
                                    {workplace.description}
                                  </p>
                                )}
                              </div>
                              {selectedWorkplace === workplace._id && (
                                <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                        {canCreateWorkplace() && (
                          <div className="p-2 border-t border-gray-100 bg-white">
                            <button
                              onClick={() => {
                                setShowWorkplaceDropdown(false);
                                setShowCreateWorkplaceModal(true);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiPlus className="w-4 h-4" />
                              Create New Workspace
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Create and Delete Workplace Buttons */}
                {(isSuperuser || currentUserRole === 'ADMIN') && (
                  <div className="hidden sm:flex items-center gap-2 ml-2">
                    <button
                      onClick={() => setShowCreateWorkplaceModal(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                    >
                      <FiPlus className="w-4 h-4" />
                      Create Workplace
                    </button>
                    {selectedWorkplace && (
                      <button
                        onClick={() => setShowDeleteWorkplaceModal(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        Delete Workplace
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                {isSuperuser && (
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium shadow-sm">
                    Superuser
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUserRole === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  currentUserRole === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                  currentUserRole === 'TEAM_LEADER' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentUserRole === 'ADMIN' ? 'Administrator' :
                   currentUserRole === 'MANAGER' ? 'Manager' :
                   currentUserRole === 'TEAM_LEADER' ? 'Team Leader' : 'Member'}
                </span>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex pt-16">
          <Suspense fallback={<LoadingFallback message="Loading sidebar..." />}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              sidebarCollapsed={sidebarCollapsed}
              isSuperuser={isSuperuser}
              currentUserRole={currentUserRole}
              selectedWorkplace={selectedWorkplace}
              workplaces={workplaces}
              isMemberOnly={isMemberOnly()}
              canCreateProject={canCreateProject()}
              canCreateTeam={canCreateTeam()}
              canInviteMembers={canInviteMembers()}
            />
          </Suspense>
          <main className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-6 transition-all duration-300`}>
            {renderContent()}
          </main>
        </div>

        {/* Modals with lazy loading */}
        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateWorkplaceModal && (
            <CreateWorkplaceModal
              show={showCreateWorkplaceModal}
              onClose={() => setShowCreateWorkplaceModal(false)}
              onSubmit={handleCreateWorkplace}
              newWorkplace={newWorkplace}
              setNewWorkplace={setNewWorkplace}
              creatingWorkspace={creatingWorkspace}
              canCreate={isSuperuser || currentUserRole === 'ADMIN'}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showDeleteWorkplaceModal && (
            <DeleteWorkplaceModal
              isOpen={showDeleteWorkplaceModal}
              onClose={() => setShowDeleteWorkplaceModal(false)}
              workplaceName={workplaces.find(w => w._id === selectedWorkplace)?.name}
              onDelete={handleDeleteWorkspace}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateProjectModal && (
            <CreateProjectModal
              show={showCreateProjectModal}
              onClose={() => setShowCreateProjectModal(false)}
              onSubmit={handleCreateProject}
              workspaceId={selectedWorkplace}
              availableUsers={availableUsers}
              canCreate={canCreateProject()}
              isMemberOnly={isMemberOnly()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditProjectModal && (
            <CreateProjectModal
              show={!!showEditProjectModal}
              onClose={() => setShowEditProjectModal(null)}
              onSubmit={(formData) => handleUpdateProject(showEditProjectModal._id, formData)}
              workspaceId={selectedWorkplace}
              availableUsers={availableUsers}
              isEdit={true}
              editData={showEditProjectModal}
              canCreate={canCreateProject()}
              isMemberOnly={isMemberOnly()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditDeadlineModal && (
            <EditDeadlineModal
              show={!!showEditDeadlineModal}
              onClose={() => setShowEditDeadlineModal(null)}
              onSubmit={handleUpdateProjectDeadline}
              project={showEditDeadlineModal}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateTeamModal && (
            <CreateTeamModal
              show={showCreateTeamModal}
              onClose={() => setShowCreateTeamModal(false)}
              onSubmit={handleCreateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={false}
              editData={null}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditTeamModal && (
            <CreateTeamModal
              show={!!showEditTeamModal}
              onClose={() => setShowEditTeamModal(null)}
              onSubmit={handleUpdateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={true}
              editData={showEditTeamModal}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteModal && (
            <InviteMemberModal
              show={showInviteModal}
              onClose={() => {
                setShowInviteModal(false);
                setInviteData({ email: '', role: 'MEMBER' });
                setGeneratedToken(null);
              }}
              onSubmit={handleGenerateInviteLink}
              inviteData={inviteData}
              setInviteData={setInviteData}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              loading={generatingLink}
              generatedLink={generatedToken}
              setGeneratedLink={setGeneratedToken}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteLinkModal && (
            <InviteLinkModal
              show={showInviteLinkModal}
              onClose={() => {
                setShowInviteLinkModal(false);
                setInviteLinkData({ email: '', role: 'MEMBER' });
              }}
              onSubmit={handleInviteSubmit}
              inviteLinkData={inviteLinkData}
              setInviteLinkData={setInviteLinkData}
              generatingLink={addingManager}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        {/* Modals with lazy loading */}
        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateWorkplaceModal && (
            <CreateWorkplaceModal
              show={showCreateWorkplaceModal}
              onClose={() => setShowCreateWorkplaceModal(false)}
              onSubmit={handleCreateWorkplace}
              newWorkplace={newWorkplace}
              setNewWorkplace={setNewWorkplace}
              creatingWorkspace={creatingWorkspace}
              canCreate={isSuperuser}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateProjectModal && (
            <CreateProjectModal
              show={showCreateProjectModal}
              onClose={() => setShowCreateProjectModal(false)}
              onSubmit={handleCreateProject}
              workspaceId={selectedWorkplace}
              availableUsers={availableUsers}
              canCreate={canCreateProject()}
              isMemberOnly={isMemberOnly()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditProjectModal && (
            <CreateProjectModal
              show={!!showEditProjectModal}
              onClose={() => setShowEditProjectModal(null)}
              onSubmit={(formData) => handleUpdateProject(showEditProjectModal._id, formData)}
              workspaceId={selectedWorkplace}
              availableUsers={availableUsers}
              isEdit={true}
              editData={showEditProjectModal}
              canCreate={canCreateProject()}
              isMemberOnly={isMemberOnly()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditDeadlineModal && (
            <EditDeadlineModal
              show={!!showEditDeadlineModal}
              onClose={() => setShowEditDeadlineModal(null)}
              onSubmit={handleUpdateProjectDeadline}
              project={showEditDeadlineModal}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showCreateTeamModal && (
            <CreateTeamModal
              show={showCreateTeamModal}
              onClose={() => setShowCreateTeamModal(false)}
              onSubmit={handleCreateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={false}
              editData={null}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showEditTeamModal && (
            <CreateTeamModal
              show={!!showEditTeamModal}
              onClose={() => setShowEditTeamModal(null)}
              onSubmit={handleUpdateTeam}
              projects={projects}
              availableUsers={availableUsers}
              workspaceId={selectedWorkplace}
              isEdit={true}
              editData={showEditTeamModal}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteModal && (
            <InviteMemberModal
              show={showInviteModal}
              onClose={() => {
                setShowInviteModal(false);
                setInviteData({ email: '', role: 'MEMBER' });
                setGeneratedToken(null);
              }}
              onSubmit={handleGenerateInviteLink}
              inviteData={inviteData}
              setInviteData={setInviteData}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              loading={generatingLink}
              generatedLink={generatedToken}
              setGeneratedLink={setGeneratedToken}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showInviteLinkModal && (
            <InviteLinkModal
              show={showInviteLinkModal}
              onClose={() => {
                setShowInviteLinkModal(false);
                setInviteLinkData({ email: '', role: 'MEMBER' });
              }}
              onSubmit={handleInviteSubmit}
              inviteLinkData={inviteLinkData}
              setInviteLinkData={setInviteLinkData}
              generatingLink={addingManager}
              isSuperuser={isSuperuser}
              userRole={currentUserRole}
              canInvite={canInviteMembers()}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showBulkUploadModal && (
            <BulkUploadModal
              show={showBulkUploadModal}
              onClose={() => setShowBulkUploadModal(false)}
              onSubmit={handleBulkUploadInterns}
              uploading={uploading}
            />
          )}
        </Suspense>

        <Suspense fallback={<ModalLoadingFallback />}>
          {showAddMemberModal && (
            <AddMemberModal
              show={!!showAddMemberModal}
              onClose={() => setShowAddMemberModal(null)}
              onSubmit={handleAddMemberToTeam}
              team={showAddMemberModal}
              availableUsers={members}
              existingMembers={[
                ...(showAddMemberModal.team || []),
                ...(showAddMemberModal.teamLeader ? [showAddMemberModal.teamLeader] : [])
              ]}
            />
          )}
        </Suspense>

        {/* Member Profile Modal */}
        <AnimatePresence>
          {showMemberProfileModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative"
              >
                 <button
                    onClick={() => setShowMemberProfileModal(null)}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-gray-800 hover:text-black rounded-full transition-all duration-200 z-10 shadow-sm"
                  >
                    <FiX size={20} />
                  </button>

                {/* Cover Header */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
                  <div className="absolute -bottom-16 left-8">
                    <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                      <div className="w-full h-full rounded-[1.4rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                        {showMemberProfileModal?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-20 px-8 pb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{showMemberProfileModal?.name}</h2>
                      <p className="text-indigo-600 font-medium">{showMemberProfileModal?.role}</p>
                    </div>
                    {isAdmin() && showMemberProfileModal.userId !== user?._id && (
                      <div className="flex gap-2 items-center">
                         <select
                            value={pendingRole || showMemberProfileModal.role}
                            onChange={(e) => setPendingRole(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="MEMBER">MEMBER</option>
                          </select>
                          {pendingRole && pendingRole !== showMemberProfileModal.role && (
                            <button
                              onClick={() => handleAssignRole(showMemberProfileModal.userId || showMemberProfileModal._id, pendingRole)}
                              disabled={updatingRole}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                            >
                              Update Role
                            </button>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <p className="text-gray-700 font-medium flex items-center gap-2 mt-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {showMemberProfileModal?.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Number</label>
                        <p className="text-gray-700 font-medium flex items-center gap-2 mt-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {showMemberProfileModal?.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
                        <p className="text-gray-700 font-medium flex items-center gap-2 mt-1">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          {formatDate(showMemberProfileModal?.joinedAt || showMemberProfileModal?.createdAt)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Domain / Skills</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {showMemberProfileModal?.domain ? (
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100 italic">
                              {showMemberProfileModal.domain}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">No skills listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => setShowMemberProfileModal(null)}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                    >
                      Close Profile
                    </button>
                    {isAdmin() && showMemberProfileModal.userId !== user?._id && (
                       <button
                        onClick={() => {
                          handleRemoveFromWorkspace(showMemberProfileModal.userId || showMemberProfileModal._id, showMemberProfileModal.name);
                          setShowMemberProfileModal(null);
                        }}
                        className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-all duration-200"
                      >
                        Remove Member
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modern Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden p-8 text-center"
              >
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete {showDeleteConfirm.type}?</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to remove <span className="font-semibold text-gray-900">"{showDeleteConfirm.name}"</span>? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                       const { type, id, extra } = showDeleteConfirm;
                       if (type === 'project') confirmDeleteProject(id);
                       else if (type === 'team') confirmDeleteTeam(id);
                       else if (type === 'member') confirmRemoveFromWorkspace(id);
                       else if (type === 'team-member') confirmRemoveTeamMember(id, extra);
                       setShowDeleteConfirm(null);
                    }}
                    className="flex-1 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
                  >
                    Delete Now
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default WorkPlaceHome;
