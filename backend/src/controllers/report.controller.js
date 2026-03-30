import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Report from '../models/report.model.js';
import Team from '../models/team.model.js';
import { checkWorkspaceRole } from '../utils/checkWorkspaceRole.js';

// Team member submits or updates their daily report (one per project per day)
export const submitReport = asyncHandler(async (req, res) => {
  const { projectId, teamId, reportText, hoursWorked, date } = req.body;
  const user = req.user;

  if (!projectId || !teamId || !reportText || !date) {
    throw new ApiError(400, 'projectId, teamId, reportText, and date are required');
  }

  // Verify the user is actually a member of this team
  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, 'Team not found');

  const isMember = team.team.some(id => String(id) === String(user._id));
  const isLeader = String(team.teamLeader) === String(user._id);
  if (!isMember && !isLeader) {
    throw new ApiError(403, 'You are not a member of this team');
  }

  // Normalize date to midnight UTC to ensure uniqueness per day
  const reportDate = new Date(date);
  reportDate.setUTCHours(0, 0, 0, 0);

  // Upsert: one report per member per project per day
  const report = await Report.findOneAndUpdate(
    { memberId: user._id, projectId, date: reportDate },
    {
      teamId,
      reportText: reportText.trim(),
      hoursWorked: hoursWorked || 0
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.status(200).json(new ApiResponse(200, report, 'Daily report submitted successfully'));
});

// Member views their own report history
export const getMyReports = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  const user = req.user;

  const query = { memberId: user._id };
  if (projectId) query.projectId = projectId;

  const reports = await Report.find(query)
    .populate('projectId', 'projectName description')
    .populate('teamId', 'teamName')
    .sort({ date: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, reports, 'Your reports fetched successfully'));
});

// Team Leader / Admin / Manager views reports for a team
export const getTeamReports = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { date, memberId } = req.query;
  const user = req.user;

  const team = await Team.findById(teamId);
  if (!team) throw new ApiError(404, 'Team not found');

  // Authorization: Admin/Manager or the Team Leader of this team
  let isAuthorized = false;
  try {
    isAuthorized = await checkWorkspaceRole(req, team.workspaceId || req.header('x-workspace-id'));
  } catch (e) {}

  if (!isAuthorized && String(team.teamLeader) === String(user._id)) {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    throw new ApiError(403, 'Only the Team Leader, Admin, or Manager can view team reports');
  }

  const query = { teamId };
  if (date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    query.date = d;
  }
  if (memberId) query.memberId = memberId;

  const reports = await Report.find(query)
    .populate('memberId', 'name email avatar')
    .populate('projectId', 'projectName')
    .sort({ date: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, reports, 'Team reports fetched successfully'));
});




