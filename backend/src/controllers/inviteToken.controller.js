import crypto from 'crypto';
import InviteToken from '../models/inviteToken.model.js';
import Workspace from '../models/workspace.model.js';
import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Manager/Admin generates an invite link for a specific role
const generateInviteLink = asyncHandler(async (req, res) => {
    const { workspaceId, role } = req.body;

    // role e.g., "TEAM_MEMBER" or "MANAGER" etc.
    if (!workspaceId || !role) {
        throw new ApiError(400, "Workspace ID and role are required.");
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw new ApiError(404, "Workspace not found");

    // Security verify: Is the requester authorized to generate this specific role?
    let isAuthorized = req.user.isSuperuser;
    const member = workspace.members.find(m => m.user.toString() === req.user._id.toString());
    const requesterRole = member ? member.role : null;

    if (!isAuthorized) {
        if (role === "ADMIN") {
            // Only workspace ADMIN can invite another ADMIN
            if (requesterRole === "ADMIN") isAuthorized = true;
        } else if (role === "MANAGER") {
            // Only workspace ADMIN (and maybe MANAGER?) can invite another MANAGER
            // User request implies Admin adds Admin/Manager. Let's stick to Admin adds Manager.
            if (requesterRole === "ADMIN") isAuthorized = true;
        } else {
            // TEAM_LEAD or TEAM_MEMBER can be invited by ADMIN or MANAGER
            if (requesterRole === "ADMIN" || requesterRole === "MANAGER") isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        throw new ApiError(403, `Not authorized to generate a ${role} invite link.`);
    }

    // Generate strict token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash it for DB storage (optional, but good practice. We'll just store raw for now since it's a one-time link)
    const token = rawToken;

    // Expires in 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const inviteRecord = await InviteToken.create({
        token,
        workspaceId,
        role,
        expiresAt
    });

    // We realistically want the frontend URL, but backend doesn't always know it natively.
    // For now we just return the raw token. The frontend constructs the domain.com/invite?token=XYZ
    return res.status(201).json(new ApiResponse(201, { token: inviteRecord.token, expiresAt }, "Invite link generated securely"));
});

// A user accepts the invite by providing credentials
const acceptInvite = asyncHandler(async (req, res) => {
    const { token, email, password } = req.body;



    if (!token || !email || !password) {
        throw new ApiError(400, "Token, email, and password are required.");
    }

    // Verify User Credentials
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new ApiError(404, "Account not found in the global pool. Contact your Admin.");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials.");
    }

    // Verify Token
    const inviteRecord = await InviteToken.findOne({ token, isUsed: false });
    if (!inviteRecord) {
        throw new ApiError(400, "Invite link is invalid or has already been used.");
    }

    if (new Date() > inviteRecord.expiresAt) {
        throw new ApiError(400, "Invite link has expired.");
    }

    const workspace = await Workspace.findById(inviteRecord.workspaceId);

    if (!workspace) throw new ApiError(404, "Workspace associated with this invite no longer exists.");

    // Inject User into Workspace as "MEMBER" (or whatever was designated, e.g., "MANAGER")
    // Note: If the invite is for a project (e.g. TEAM_MEMBER), the parent workspace role defaults to "MEMBER"
    const workspaceRole = (inviteRecord.role === "TEAM_MEMBER" || inviteRecord.role === "TEAM_LEAD" || inviteRecord.role === "INTERN") ? "MEMBER" : inviteRecord.role;

    const existingWorkspaceMember = workspace.members.find(m => m.user.toString() === user._id.toString());
    if (!existingWorkspaceMember) {
        workspace.members.push({ user: user._id, role: workspaceRole });
        await workspace.save();
    }

    // Inject User into Project if applicable
    if (inviteRecord.projectId) {
        const project = await Project.findById(inviteRecord.projectId);
        if (project) {
            const existingProjectMember = project.members.find(m => m.user.toString() === user._id.toString());
            if (!existingProjectMember) {
                project.members.push({ user: user._id, role: inviteRecord.role });
                await project.save();
            }
        }
    }

    // Mark token as used
    inviteRecord.isUsed = true;
    await inviteRecord.save();

    // Authenticate the user instantly (Send cookies)
    const options = { httpOnly: true, secure: true };
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loginUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { ...loginUser._doc, accessToken, refreshToken }, "Invite accepted successfully. User logged in."));
});

export { generateInviteLink, acceptInvite };
