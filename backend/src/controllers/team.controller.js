import Project from '../models/project.model.js';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Workspace from '../models/workspace.model.js';

import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { checkWorkspaceRole } from '../utils/checkWorkspaceRole.js';

// Helper: set a user's role in a workspace
const setWorkspaceMemberRole = async (workspaceId, userId, role) => {
  await Workspace.findOneAndUpdate(
    { _id: workspaceId, 'members.user': userId },
    { $set: { 'members.$.role': role } }
  );
};

// create team
const createTeam = asyncHandler(async (req, res) => {
  const { projectId, teamName, team, teamLeaderId, workSpaceId } = req.body;

  const isAuthorized = await checkWorkspaceRole(req, workSpaceId);
  if (!isAuthorized) throw new ApiError(403, 'Not authorized to create a team');

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, 'Project not found');

  const allMembers = await User.find({ _id: { $in: team } }).select('_id');

  const newTeam = await Team.create({
    workspaceId: workSpaceId,
    teamName,
    projectId: project._id,
    team: allMembers.map(m => m._id),
    teamLeader: teamLeaderId || null
  });

  // Sync workspace roles
  if (teamLeaderId) {
    await setWorkspaceMemberRole(workSpaceId, teamLeaderId, 'TEAM_LEADER');
  }

  return res.status(200).json(new ApiResponse(200, newTeam, 'Team created successfully'));
});

// get team
const getTeams = asyncHandler(async (req, res) => {
          const { workspaceId } = req.params;
          const userId = req.user._id;

          const workspace = await Workspace.findById(workspaceId);

          if (!workspace) {
            throw new ApiError(404, "Workspace not found");
          }

          const teams = await Team.find({ workspaceId })
            .populate("team", "name email avatar")
            .populate("teamLeader", "name email avatar")
            .populate("projectId", "projectName description startDate deadline createdBy");

          const isUserInAnyTeam = await teams.map((team) =>
            team.team.map((memberId) =>
              memberId.toString() === userId.toString()
            )
          );


          if (!isUserInAnyTeam) {
            throw new ApiError(403, "User is not part of any team");
          }

          return res.status(200).json(
            new ApiResponse(200, teams, "fetch teams")
          );
});


// add new member
const addNewMember = asyncHandler(async(req,res)=>{

        const { teamId } = req.params

         const { newMemberId } = req.body

        const team = await Team.findById(teamId);
          if (!team) {
            return res.status(404).json({ error: "Team not found" });
          }

          const isAuthorized = await checkWorkspaceRole(req, team.workspaceId);
          if(!isAuthorized) throw new ApiError(403, "Not authorized to modify this team");


          const user = await User.findOne({ _id: newMemberId }).select("_id");
          if (!user) {
            return res.status(404).json({ error: "user not found" });
          }


          const updatedTeam = await Team.findByIdAndUpdate(
            team._id,
            { $addToSet: { team: user._id } },
            { new: true }
          );

    return res.status(200).json(new ApiResponse(200, {}, "team update successfully"))
})

const removeTeamMember = asyncHandler(async(req,res)=>{

    const { teamId } = req.params
    const { userId } = req.body

    const team = await Team.findById(teamId)
    if (!team) throw new ApiError(404, "Team not found");

    const isAuthorized = await checkWorkspaceRole(req, team.workspaceId);
    if(!isAuthorized) throw new ApiError(403, "Not authorized to modify this team");

    const user = await User.findById(userId).select("_id")

    await Team.findByIdAndUpdate(team._id, {
        $pull : {
          team : user._id
        }
    }, { new : true })

    return res.status(200).json(new ApiResponse(200, {}, "remove user from team successfully"))
})

// set new Team leader from team
const setNewTeamLeader = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { NewTeamLeaderId } = req.body;

  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, 'Team not found');

  const isAuthorized = await checkWorkspaceRole(req, team.workspaceId);
  if (!isAuthorized) throw new ApiError(403, 'Not authorized to modify this team');

  const NewTeamLeader = await User.findById(NewTeamLeaderId).select('_id');
  if (!NewTeamLeader) throw new ApiError(404, 'User not found');

  // Revert old leader to MEMBER
  if (team.teamLeader && String(team.teamLeader) !== String(NewTeamLeaderId)) {
    await setWorkspaceMemberRole(team.workspaceId, team.teamLeader, 'MEMBER');
  }

  const updatedTeam = await Team.findByIdAndUpdate(
    team._id,
    { $set: { teamLeader: NewTeamLeader._id }, $pull: { team: NewTeamLeader._id } },
    { new: true }
  );

  // Promote new leader
  await setWorkspaceMemberRole(team.workspaceId, NewTeamLeaderId, 'TEAM_LEADER');

  return res.status(200).json(new ApiResponse(200, updatedTeam, 'Team leader updated successfully'));
});

// remove team leader and add to team
const removeTeamLeaderAndAddToTeam = asyncHandler(async(req,res)=>{

       const { teamId } = req.params

       const { teamLeaderId } = req.body

    const team = await Team.findById(teamId);
          if (!team) {
            throw new ApiError(400,"Team not found")
          }

          const isAuthorized = await checkWorkspaceRole(req, team.workspaceId);
          if(!isAuthorized) throw new ApiError(403, "Not authorized to modify this team");


          const teamLeader = await User.findOne({ _id: teamLeaderId }).select("_id");
          if (!teamLeader) {
              throw new ApiError(400,"teamLeader not found")
          }


           await Team.findByIdAndUpdate(
            team._id,
            {
              $push : { team : teamLeader._id },
              $set: { teamLeader:  null }
          } ,
            { new: true }
          );
  return res.status(200).json(new ApiResponse(200, {}, "remove team Leader from team and add to team successfully"))
})

// update team completely (name, leader, members)
const updateTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { teamName, teamLeaderId, team } = req.body;

  const existingTeam = await Team.findById(teamId);
  if (!existingTeam) throw new ApiError(404, 'Team not found');

  const isAuthorized = await checkWorkspaceRole(req, existingTeam.workspaceId);
  if (!isAuthorized) throw new ApiError(403, 'Not authorized to modify this team');

  // Sync workspace roles if leader changed
  if (teamLeaderId && String(existingTeam.teamLeader) !== String(teamLeaderId)) {
    if (existingTeam.teamLeader) {
      await setWorkspaceMemberRole(existingTeam.workspaceId, existingTeam.teamLeader, 'MEMBER');
    }
    await setWorkspaceMemberRole(existingTeam.workspaceId, teamLeaderId, 'TEAM_LEADER');
  }

  const updatedTeam = await Team.findByIdAndUpdate(teamId, {
    teamName: teamName || existingTeam.teamName,
    teamLeader: teamLeaderId || existingTeam.teamLeader,
    team: team !== undefined ? team : existingTeam.team
  }, { new: true });

  return res.status(200).json(new ApiResponse(200, updatedTeam, 'Team updated successfully'));
});

// delete team
const deleteTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, "Team not found");

  const isAuthorized = await checkWorkspaceRole(req, team.workspaceId);
  if (!isAuthorized) throw new ApiError(403, "Not authorized to delete this team");

  await Team.findByIdAndDelete(teamId);

  return res.status(200).json(new ApiResponse(200, {}, "Team deleted successfully"));
});

export {
  addNewMember, createTeam,
  getTeams, removeTeamLeaderAndAddToTeam, removeTeamMember, setNewTeamLeader, updateTeam,
  deleteTeam
};
