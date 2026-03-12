# ARCHITECTURE.md

> **High-Level System Design for Task Management System (TMS)**

## Overview
A monolithic full-stack app leveraging Vite + React.js for the Frontend and Node.js + Express for the serverless Backend. Data persistence is handled via MongoDB Atlas.

## Core Services

### Frontend (React + Vite + JavaScript)
- **Role-Based Routing System**: Using React Router to guard `/admin`, `/manager`, and submission forms.
- **State Management**: React Context or lightweight Zustand for Auth and Session management.
- **Styling Framework**: Tailwind CSS for premium, responsive styling.
- **File Parsing**: Client-side parsing using libraries like `papaparse` for CSV uploads to reduce server payload processing and enable preview/validation.

### Backend (Node.js + Express + JavaScript)
- **Authentication Service**: JWT issuance and validation. Passwords hashed via `bcrypt`.
- **API Controllers**: Separated logic for `projects`, `users`, `interns`, `teams`, and `tasks`.
- **Validation Layer**: Controllers handling data checks before queries.
- **Serverless Adapters**: Configuration for Vercel deployment (typically `api/index.js` exported).

### Database (MongoDB Atlas)
Standard REST operations to document stores, typically integrated via Mongoose models enforcing schema strictly to match `SPEC.md` definitions.

## Key Interactions
1. **Manager uploads CSV**: Frontend reads CSV → Frontend validates required columns (`UniqueID`, `Name`, `Email`, etc.) → Frontend presents Preview → Manager Confirms → Frontend sends massive batch POST to Backend → Backend validates and inserts into DB → Success response.
2. **Task Submissions**: Team Leader accesses a specific UUID/Token-secured URL (e.g. `tms.com/submit/team-abc-uuid`) → Frontend fetches members by Team ID → Leader fills out one form array for all members mapping to the same date → Submit triggers bulk Task insertion API.

## Scaling Constraints & Solutions
- Serverless limits on Vercel necessitate keeping API payload reasonably limited (<4.5MB).
- Uploading enormous CSVs is handled efficiently by chunking or strictly validating size prior to transmission.
