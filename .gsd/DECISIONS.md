# DECISIONS.md

> **Architecture Decision Records (ADRs)**

## Active Decisions
1. **Stack**: React (Vite) + TS + Tailwind for Frontend; Express + Node + TS for Backend. Chosen because: User provided specific constraints and tech stack in the specification.
2. **Database**: MongoDB Atlas. Chosen because: Fits standard MERN/MEAN stack document structures perfectly, especially for mapping arrays of interns to Teams, and user specified it.
3. **Deployment**: Vercel (frontend + serverless backend). Chosen because: Excellent CI/CD pipeline, and specified by user.

## Past Decisions
*None yet*
