# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Build a role-based web application to manage projects, interns, teams, and daily task reporting for an organization. This system streamlines intern oversight, removing manual tracking and centralizing daily task submissions.

## Goals
1. **Centralized Project & Team Management** for Managers to orchestrate work.
2. **Frictionless Bulk Onboarding** for Interns (CSV/Excel) with robust validation.
3. **Simplified Daily Task Reporting** from Team Leaders without full system access overhead.
4. **Comprehensive Monitoring & Tracking** for Admins and Managers via intuitive dashboards.

## MVP Features
- **Authentication**: JWT-based Email/password login for Admin/Manager with role-based routing.
- **Project Management**: Create projects, set start dates, deadlines, and descriptions (Manager only).
- **Intern Management**: Bulk upload interns via CSV/Excel (Upload → Validate → Preview → Confirm → Save).
- **Team Management**: Create teams, assign one Team Leader, assign interns.
- **Task Reporting**: A dedicated, non-dashboard form for Team Leaders to submit daily tasks (Project, Date, Member, Work description, Status, Remarks).
- **Monitoring Dashboards**: Admin/Manager views for project lists, deadline tracking, team details, leader mapping, date-wise reports, and member performance.

## Future Features (Non-Goals for MVP)
- Intern portal or direct login.
- Individual intern task submission (currently delegated to Team Leaders).
- Complex analytics or ML insights.
- External integrations (e.g., Jira, Slack).

## Users
1. **Admin**: Super user. Monitors the entire system (managers, interns, projects, teams, reports, deadlines). Cannot create projects or tasks.
2. **Manager**: Operational system user. Creates projects, uploads interns, creates teams, assigns leaders/interns, and monitors reports.
3. **Team Leader**: Created by manager. No dashboard login. Accesses task submission form to report daily progress for team members.
4. **Intern**: Managed entities. No login. Appear in task reports under team leaders.

## Key User Flows
1. **Manager Setup Flow**: Manager logs into dashboard → Creates a new Project → Bulk uploads Interns via CSV (with duplicate validation) → Creates a Team under the project → Assigns one Team Leader and multiple Interns → Saves Team.
2. **Task Reporting Flow**: Team Leader accesses a shared/provided task submission link → Fills out daily task form for their team members → Submits report to the system.
3. **Admin Monitoring Flow**: Admin logs in → Views global dashboard → Filters by Project/Deadline → Inspects team performance and daily task compliance → Spots missing reports.

## Core Data Models
- **Users**: `id`, `name`, `email`, `password`, `phone`, `role (admin, manager)`
- **Interns**: `id`, `name`, `email`, `phone`, `uniqueID`, `joiningDate`, `domain`, `role`, `status`
- **Projects**: `id`, `name`, `description`, `startDate`, `deadline`, `managerId`
- **Teams**: `id`, `teamName`, `projectId`, `leaderId`, `members[]`
- **Tasks**: `id`, `projectId`, `teamId`, `memberId`, `date`, `description`, `status`, `remarks`, `submittedBy`

## Edge Cases
1. Uploading realistic CSVs with duplicate Intern emails or `uniqueID`s.
2. Incomplete CSV files missing mandatory fields during the Validate/Preview phase.
3. A Team Leader gets reassigned or leaves—what happens to the submission form link and existing historical tasks?
4. Admin attempts to act functionally like a manager (e.g., bypassing UI to hit API endpoints to create projects).
5. Task submission link accessed repeatedly for the same date/project (duplicate submissions conflict).

## Constraints
- **Technical**: Must use React.js/Vite/TS/Tailwind on the Frontend, Node.js/Express/TypeScript on the Backend, and MongoDB Atlas.
- **Deployment**: Vercel (frontend + serverless backend).
- **NFRs**: Secure authentication, role-based access control (RBAC), clean UI, fast scalable architecture.
