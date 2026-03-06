# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Authentication (Email/Password) and RBAC for Admin & Manager.
- [ ] Project Creation & Manager Dashboard.
- [ ] Bulk Intern Upload via CSV/Excel with validation.
- [ ] Team Builder (Project -> Members + 1 Team Leader).
- [ ] Daily Task Reporting Form for Team Leaders.
- [ ] Monitoring Dashboards (Global Admin & Manager specific).

## Phases

### Phase 1: Foundation Setup & Config (Auth + DB)
**Status**: ⬜ Not Started
**Objective**: Scaffold the frontend (Vite/React/TS/Tailwind) and backend (Express/TS/MongoDB). Establish routing, error handling, authentication middleware, and RBAC logins for Admin/Manager.

### Phase 2: Core Management (Projects & Interns Upload)
**Status**: ⬜ Not Started
**Objective**: Add robust file upload and CSV parsing (Validate -> Preview -> Confirm -> Save). Integrate Project models allowing managers to create and fetch projects. Interns can be pushed to DB.

### Phase 3: Teams & Task Submission
**Status**: ⬜ Not Started
**Objective**: Build models and UI for Team combination (linking a project to a subset of interns and assigning a Team Leader). Provision the submission form endpoints and unique identifiers so leaders can submit task arrays per member per day.

### Phase 4: Dashboards & Polish
**Status**: ⬜ Not Started
**Objective**: Aggregate data. Display overarching performance, deadline metrics, task reports tracking, and leader mapping. Ensure role enforcement UI/UX works elegantly (Premium Design). Add final pagination, loading states, and deploy to Vercel.
