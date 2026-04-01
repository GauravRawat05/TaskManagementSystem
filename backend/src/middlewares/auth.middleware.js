import asyncHandler from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'

import Workspace from '../models/workspace.model.js'

const verifyJWT = asyncHandler(async(req,_,next)=>{

      try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
          throw new ApiError(401, "unAuthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

      if(!user) {
        throw new ApiError(401, "Invalid access token")
      }


      req.user = user
      next()

      } catch (error) {
          throw new ApiError(401,  error.message ||"token is used or expired")
      }
})


const verifySuperuser = asyncHandler(async(req, res, next) => {
  if (!req.user || !req.user.isSuperuser) {
    throw new ApiError(403, "Forbidden! Superuser access required.");
  }
  next();
});

// Verifies if the user is at least a member of the workspace
const verifyWorkspaceMember = asyncHandler(async(req, res, next) => {

    const workspaceId = req.header("x-workspace-id") || req.body?.workspaceId || req.params?.workspaceId;
    
    if(!workspaceId) {
        throw new ApiError(400, "Workspace ID is required in headers or body.");
    }

    if(req.user.isSuperuser) return next();

    const workspace = await Workspace.findById(workspaceId);

    if(!workspace) throw new ApiError(404, "Workspace not found.");

    const member = workspace.members.find(m => m.user.toString() === req.user._id.toString());

    if(!member) throw new ApiError(403, "You are not a member of this workspace.");

    req.workspace = workspace;
    next();
});

// Verifies if the user is a MANAGER or ADMIN in the workspace
const verifyWorkspaceAdmin = asyncHandler(async(req, res, next) => {

    const workspaceId = req.header("x-workspace-id") || req.body?.workspaceId || req.params?.workspaceId;
    if(!workspaceId) {
        throw new ApiError(400, "Workspace ID is required in headers or body.");
    }

    if(req.user.isSuperuser) return next();

    const workspace = await Workspace.findById(workspaceId);
    if(!workspace) throw new ApiError(404, "Workspace not found.");

    const member = workspace.members.find(m => m.user.toString() === req.user._id.toString());
    if(!member || (member.role !== "ADMIN" && member.role !== "MANAGER")) {
        throw new ApiError(403, "Only Workspace Admins or Managers can perform this action.");
    }

    req.workspace = workspace;
    next();
});

// Verifies if the user is a TEAM_LEADER (or Admin/Manager) in the workspace
const verifyTeamLeader = asyncHandler(async(req, res, next) => {
    const workspaceId = req.header("x-workspace-id") || req.body?.workspaceId || req.params?.workspaceId;
    if (!workspaceId) {
        throw new ApiError(400, "Workspace ID is required in headers or body.");
    }

    if (req.user.isSuperuser) return next();

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new ApiError(404, "Workspace not found.");

    const member = workspace.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member) throw new ApiError(403, "You are not a member of this workspace.");

    const allowedRoles = ["ADMIN", "MANAGER", "TEAM_LEADER"];
    if (!allowedRoles.includes(member.role)) {
        throw new ApiError(403, "Only Team Leaders, Admins, or Managers can perform this action.");
    }

    req.workspace = workspace;
    req.workspaceRole = member.role;
    next();
});


export { verifyJWT, verifySuperuser, verifyWorkspaceMember, verifyWorkspaceAdmin, verifyTeamLeader };

