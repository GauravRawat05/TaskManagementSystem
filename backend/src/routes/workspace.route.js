import { Router } from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  addWorkspaceManager,
  inviteUserToWorkspace,
  updateWorkspaceMemberRole,
  removeWorkspaceMember,
  getMyWorkspaceRole
} from "../controllers/workspace.controller.js";
import { verifyJWT, verifySuperuser, verifyWorkspaceAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Superuser creates workspace
router.route("/create").post(verifyJWT, verifySuperuser, createWorkspace);

// Admin adds members / managers
router.route("/add-manager/:workspaceId").post(verifyJWT, addWorkspaceManager);
router.route("/invite-user/:workspaceId").post(verifyJWT, inviteUserToWorkspace);

// Member role management
router.route("/:workspaceId/role/:userId").patch(verifyJWT, verifyWorkspaceAdmin, updateWorkspaceMemberRole);
router.route("/:workspaceId/member/:userId").delete(verifyJWT, verifyWorkspaceAdmin, removeWorkspaceMember);

// Get logged-in user's role in a workspace (used by frontend for dashboard routing)
router.route("/:workspaceId/my-role").get(verifyJWT, getMyWorkspaceRole);

// General workspace queries
router.route("/all").get(verifyJWT, getWorkspaces);
router.route("/:workspaceId").get(verifyJWT, getWorkspaceById);

export default router;
