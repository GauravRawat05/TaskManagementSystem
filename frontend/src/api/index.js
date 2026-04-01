import apiClient from "../utils";

// ------------------------------ X ------------------------------------
// auth apis

export const registerAdmin = (data) => {
   return apiClient.post("/auth/user/register", data);
}

export const commonLogin = (data) => {

    return apiClient.post("/auth/user/login", data);
}

export const currentUser = () => {
    return apiClient.get("/auth/user/fetch");
}

export const loggedOutUser = () => {
    return apiClient.post("/auth/user/logout");
}

export const changeCurrentPassword = (data) => {
    return apiClient.post("/auth/user/change-password", data);
}

export const updateUserProfile = (data) => {
    return apiClient.put("/auth/user/update-profile", data);
}

export const updateUserAvatar = (data) => {
  return apiClient.put("/auth/user/update-avatar", data);
}



// ------------------------------ X ------------------------------------
// add interns

export const bulkUploadUsers = (data) => {
  return apiClient.post("/user/bulk-upload", data);
}

export const getAllUsers = () => {
  return apiClient.get("/user/all");
}


// ------------------------------ X ------------------------------------
// workplace apis

export const createWorkspace = (data) => {
  return apiClient.post("/workspace/create", data); // Added return
}

export const addWorkspaceManager = (data) => {
  return apiClient.post(`/workspace/add-manager/${data.workspaceId}`, data); // Added return
}

export const inviteUserToWorkspace = (data) => {
  return apiClient.post(`/workspace/invite-user/${data.workspaceId}`, data); // Added return
}

export const removeWorkspaceMember = (data) => {
  return apiClient.delete(`/workspace/${data.workspaceId}/member/${data.userId}`); // Corrected endpoint
}

export const updateUserRole = (data) => {
  return apiClient.patch(`/workspace/${data.workspaceId}/role/${data.userId}`, data); // Move from team to workspace
}

export const getWorkspaces = () => {
  return apiClient.get("/workspace/all"); // Added return
}

export const getWorkspaceById = (data) => {
  return apiClient.get(`/workspace/${data.workspaceId}`); // Added return
}

export const getMyWorkspaceRole = (workspaceId) => {
  return apiClient.get(`/workspace/${workspaceId}/my-role`); 
}

export const deleteWorkspace = (workspaceId) => {
  return apiClient.delete(`/workspace/${workspaceId}`);
}

// ------------------------------ X ------------------------------------
// project

export const createProject = (data) => {
  return apiClient.post("/project/add/project", data); // Added return
}

export const getProjects = (data) => {

  return apiClient.get(`/project/workspace/${data.workspaceId}`); // Added return
}

export const updateProject = (data) => {
  return apiClient.put(`/project/update/${data.projectId}`, data); // Added return
}

export const updateProjectDeadline = (data) => {
  return apiClient.put(`/project/update/deadline/${data.projectId}`, data); // Added return
}

export const deleteProject = (data) => {
  return apiClient.delete(`/project/${data.workspaceId}/delete/${data.projectId}`); // Updated
}

// signle user project

export const getprojectOfUser = () => {
  return apiClient.get(`/project/Workspace/project`); // Added return
}

// ------------------------------ X ------------------------------------
// team

export const createTeam = (data) => {

  return apiClient.post("/team/add/team", data); // Added return
}

export const getTeams = (data) => {
  return apiClient.get(`/team/fetch/team/${data.workspaceId}`); // Added return
}

export const updateTeam = (data) => {
  return apiClient.put(`/team/update/${data.teamId}`, data); // Added return
}

export const addNewMemberInTeam = (data) => {
  return apiClient.patch(`/team/add-memeber/team/${data.teamId}`, { newMemberId: data.newMemberId });
}

export const setNewTeamLeader = (data) => {
  return apiClient.patch(`/team/set/new/team-leader/${data.teamId}`, data); // Added return
}

export const removeTeamMember = (data) => {
  return apiClient.patch(`/team/remove-intern/team/${data.teamId}`, data); // Added return
}

export const removeTeamLeaderAndAddToTeam = (data) => {
  return apiClient.patch(`/team/remove-lead/add-team/${data.teamId}`, data); // Added return
}

// Removed deprecated role update from teams


export const deleteTeam = (data) => {
  return apiClient.delete(`/team/${data.workspaceId}/delete/${data.teamId}`); // Updated
}


// ------------------------------ X ------------------------------------
//

export const createTask = (data) => {
  return apiClient.post("/task/new-task", data);
}
export const createProjectTask = createTask;

export const getTasks = (params) => {
  return apiClient.get("/task/get/tasks", { params });
}
export const getProjectTask = (data) => {
  return apiClient.get(`/task/get/task/${data.projectId}`); // legacy
}

export const updateTask = (taskId, data) => {
  return apiClient.patch(`/task/update/${taskId}`, data);
}
export const updateProjectTask = (data) => {
  return updateTask(data.taskId, data);
}

export const deleteTask = (taskId) => {
  return apiClient.delete(`/task/delete/${taskId}`);
}

// ------------------------------ X ------------------------------------
// reports

export const submitReport = (data) => {
  return apiClient.post("/report/submit", data);
}

export const submitTaskReport = submitReport;

export const getMyReports = (params) => {
  return apiClient.get("/report/my-reports", { params });
}

export const getTeamReports = (teamId, params) => {
  return apiClient.get(`/report/team/${teamId}`, { params });
}

export const getTaskReports = (data) => {
  return apiClient.get(`/report/task/${data.taskId}`); // legacy
}



// ------------------------------ X ------------------------------------
// workplace invait token

export const generateInviteToken = (data) => {

    return apiClient.post("/invite/generate", data);
}

export const acceptInviteToken = (data) => {
    return apiClient.post("/invite/accept", data);
}
