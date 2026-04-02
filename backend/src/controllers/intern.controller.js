import path from 'path';
import { hash } from 'bcrypt';
import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import Workspace from '../models/workspace.model.js';
import parseFileToJson from '../parser/index.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const DEFAULT_PASSWORD = 'Welcome@123';

// Bulk add members from CSV/Excel → saved to User collection
const addBulkIntern = asyncHandler(async (req, res) => {
  const { workspaceId } = req.body;
  const file = req.files?.bulkIntern?.[0];

  if (!file) {
    throw new ApiError(400, 'File is required to upload');
  }

  const extension = path.extname(file.originalname);
  const data = await parseFileToJson(extension, file.path);

  const alreadyExist = [];
  const newMembers = [];
  const invalidRows = [];

  // Collect all emails to batch check
  const allEmails = data.map(i => String(i.email || '').toLowerCase().trim());
  const existingUsers = await User.find({ email: { $in: allEmails } }).select('email');
  const existingEmailSet = new Set(existingUsers.map(u => u.email));

  const hashedPassword = await hash(DEFAULT_PASSWORD, 10);

  for (const row of data) {
    const {
      name = '',
      email = '',
      phone = '',
      domain = '',
      joinDate = '',
      intern_id = ''
    } = row;

    const missingFields = [name, email].filter(f => !f || String(f).trim() === '');
    if (missingFields.length > 0) {
      invalidRows.push({ row, reason: 'Missing required fields: name, email' });
      continue;
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (existingEmailSet.has(normalizedEmail)) {
      alreadyExist.push({ email: normalizedEmail, name });
      continue;
    }

    let joiningDate;
    if (joinDate) {
      const parts = String(joinDate).split('-');
      joiningDate = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date();
    } else {
      joiningDate = new Date();
    }

    newMembers.push({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,
      domain: domain ? String(domain).trim() : undefined,
      joiningDate,
      internId: intern_id ? String(intern_id).trim() : undefined,
      defaultPasswordChanged: false,
      isSuperuser: false
    });

    // Track to prevent intra-batch duplication
    existingEmailSet.add(normalizedEmail);
  }

  let insertedUsers = [];
  if (newMembers.length > 0) {
    try {
      insertedUsers = await User.insertMany(newMembers, { ordered: false });
    } catch (err) {
      console.error('Bulk insert error:', err);
    }
  }

  return res.status(200).json(new ApiResponse(200, {
    inserted: insertedUsers.length,
    alreadyExist,
    invalid: invalidRows,
    insertedUsers: insertedUsers.map(u => ({ name: u.name, email: u.email }))
  }, 'Bulk member upload completed'));
});

// Add a single member → saved to User collection
const addSingleIntern = asyncHandler(async (req, res) => {
  const { name, email, phone, domain, joinDate, intern_id } = req.body;

  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(400, 'A user with this email already exists');
  }

  let joiningDate = new Date();
  if (joinDate) {
    const parts = String(joinDate).split('-');
    if (parts.length === 3) joiningDate = new Date(parts[0], parts[1] - 1, parts[2]);
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normalizedEmail,
    phone: phone ? String(phone).trim() : '',
    password: DEFAULT_PASSWORD,
    domain: domain ? String(domain).trim() : undefined,
    joiningDate,
    internId: intern_id ? String(intern_id).trim() : undefined,
    defaultPasswordChanged: false,
    isSuperuser: false
  });

  return res.status(201).json(new ApiResponse(201, {
    _id: user._id,
    name: user.name,
    email: user.email
  }, 'Member added successfully. Default password: Welcome@123'));
});

// Get all users from global pool (excluding superusers)
const getAllInterns = asyncHandler(async (req, res) => {
  const users = await User.find({ isSuperuser: false })
    .select('-password -refreshToken')
    .lean();

  return res.status(200).json(new ApiResponse(200, users, 'Global pool fetched successfully'));
});

// Get workspace members NOT yet assigned to any team in that workspace
const availableIntern = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { excludeTeamId } = req.query;

  if (!workspaceId) throw new ApiError(400, 'Workspace ID is required');

  const workspace = await Workspace.findById(workspaceId).populate('members.user', 'name email avatar domain internId');
  if (!workspace) throw new ApiError(404, 'Workspace not found');

  // Get all member user IDs from workspace (MEMBER and TEAM_LEADER roles)
  const workspaceMemberIds = workspace.members
    .filter(m => m.role === 'MEMBER' || m.role === 'TEAM_LEADER')
    .map(m => m.user._id.toString());

  // Find all teams in this workspace, get assigned user IDs
  const teams = await Team.find({ workspaceId });
  const assignedIds = new Set();
  for (const t of teams) {
    if (excludeTeamId && String(t._id) === excludeTeamId) continue;
    if (t.teamLeader) assignedIds.add(String(t.teamLeader));
    if (t.team) t.team.forEach(id => assignedIds.add(String(id)));
  }

  // Filter workspace members to those not assigned to any team
  const availableMembers = workspace.members
    .filter(m => {
      if (m.role === 'ADMIN' || m.role === 'MANAGER') return false;
      return !assignedIds.has(String(m.user._id));
    })
    .map(m => m.user);

  return res.status(200).json(new ApiResponse(200, availableMembers, 'Available members fetched'));
});

export {
  addBulkIntern,
  addSingleIntern,
  availableIntern,
  getAllInterns
};


const options = {
    httpOnly : true,
    secure : true
}



