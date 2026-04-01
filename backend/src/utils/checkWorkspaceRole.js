import Workspace from '../models/workspace.model.js';
import ApiError from './ApiError.js';

export const checkWorkspaceRole = async (req, workspaceId) => {
  if (req.user.isSuperuser) return true;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const memberRecord = workspace.members.find(
    m => m.user.toString() === req.user._id.toString()
  );

  if (memberRecord && (memberRecord.role === "ADMIN" || memberRecord.role === "MANAGER")) {
    return true;
  }

  return false;
};
