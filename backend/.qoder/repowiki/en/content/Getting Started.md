# Getting Started

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [src/index.js](file://src/index.js)
- [src/app.js](file://src/app.js)
- [src/db/index.js](file://src/db/index.js)
- [src/utils/asyncHandler.js](file://src/utils/asyncHandler.js)
- [src/utils/ApiResponse.js](file://src/utils/ApiResponse.js)
- [src/utils/ApiError.js](file://src/utils/ApiError.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Configuration](#environment-configuration)
5. [Development vs Production Setup](#development-vs-production-setup)
6. [Initial Server Startup](#initial-server-startup)
7. [Basic Health Check](#basic-health-check)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [System Requirements and Compatibility](#system-requirements-and-compatibility)
10. [Conclusion](#conclusion)

## Introduction
This guide helps you set up and run the Task Management System Backend locally. It covers prerequisites, installation, environment configuration, development versus production modes, initial startup, and health checks. The backend is built with Node.js, Express, and MongoDB, and uses environment variables for configuration.

## Prerequisites
- Operating system: Windows, macOS, or Linux
- Node.js runtime: Version 18 or later recommended
- npm package manager: Included with Node.js
- MongoDB database: Local instance or a hosted service (Atlas)
- Optional: A MongoDB GUI tool (e.g., Compass) for inspection

**Section sources**
- [package.json](file://package.json#L1-L28)

## Installation
Follow these steps to prepare your local environment:

1. Clone or download the repository to your machine.
2. Open a terminal in the project root directory.
3. Install dependencies using npm:
   - Run: npm install
4. Verify installation:
   - Confirm that node_modules was created and package-lock.json exists.

Notes:
- The project uses ES modules. Ensure your Node.js version supports ES modules.
- The scripts section defines dev and start commands for development and production respectively.

**Section sources**
- [package.json](file://package.json#L5-L9)

## Environment Configuration
Create a .env file in the project root with the following variables:

- MONGOURI: MongoDB connection string (required)
- PORT: Application port (default 5002 if not set)
- CORS: Allowed origins for CORS policy (e.g., frontend URL)
- JWT_SECRET: Secret key for signing JSON Web Tokens (required for authentication-related features)

How to configure:
- Copy the template below into a new file named .env in the project root.
- Replace placeholder values with your own settings.

Example template (do not paste this block; create your own .env):
- MONGOURI=your_mongodb_connection_string_here
- PORT=5002
- CORS=http://localhost:3000
- JWT_SECRET=your_jwt_secret_here

Validation:
- The application reads .env automatically during startup.
- The database connection uses MONGOURI.
- The server listens on PORT.
- CORS is applied via the Express app configuration.

**Section sources**
- [src/index.js](file://src/index.js#L5-L7)
- [src/index.js](file://src/index.js#L9)
- [src/app.js](file://src/app.js#L8-L10)
- [src/db/index.js](file://src/db/index.js#L5)

## Development vs Production Setup
- Development mode:
  - Uses nodemon for automatic restarts on file changes.
  - Command: npm run dev
  - Loads environment variables via dotenv/config.
- Production mode:
  - Standard Node.js execution.
  - Command: npm start
  - Also loads environment variables via dotenv/config.

Key differences:
- Hot reloading: nodemon watches files in development; disabled in production.
- Scripts: dev and start differ only in the runner (nodemon vs node).

**Section sources**
- [package.json](file://package.json#L7-L8)
- [src/index.js](file://src/index.js#L1-L7)

## Initial Server Startup
To start the server:

1. Ensure dependencies are installed (npm install).
2. Set environment variables in .env.
3. Choose a mode:
   - Development: npm run dev
   - Production: npm start
4. On successful startup:
   - The server logs the listening port.
   - The database connection is established and logged.

Startup flow overview:
- dotenv loads environment variables from .env.
- Database connection is attempted.
- Express app starts listening on the configured port.

**Section sources**
- [src/index.js](file://src/index.js#L5-L7)
- [src/index.js](file://src/index.js#L11-L17)
- [src/db/index.js](file://src/db/index.js#L3-L10)

## Basic Health Check
After starting the server, verify it is reachable:

- Endpoint: GET http://localhost:PORT/
- Expected behavior:
  - If routes are mounted, you will receive a response appropriate to your routes.
  - If no routes are mounted yet, you may see a default response or a route-not-found behavior depending on your middleware setup.

Notes:
- PORT defaults to 5002 if not set in .env.
- The Express app enables static serving and JSON parsing, which affects how requests are handled.

**Section sources**
- [src/index.js](file://src/index.js#L9)
- [src/app.js](file://src/app.js#L11-L13)

## Troubleshooting Guide
Common issues and resolutions:

- Port already in use:
  - Symptom: Startup fails with a port conflict error.
  - Fix: Change PORT in .env to an available port (e.g., 5003).
- MongoDB connection failure:
  - Symptom: Database connection error or process exits.
  - Fix: Verify MONGOURI in .env is correct and reachable. Test connectivity using a MongoDB client.
- CORS errors in browser:
  - Symptom: Cross-origin requests blocked.
  - Fix: Set CORS in .env to include your frontend origin (e.g., http://localhost:3000).
- Missing environment variables:
  - Symptom: Unexpected behavior or runtime errors.
  - Fix: Ensure .env contains MONGOURI, PORT, CORS, and JWT_SECRET as needed.
- ES module errors:
  - Symptom: Import/require errors related to .js extensions or ES modules.
  - Fix: Ensure your Node.js version supports ES modules and that import paths match actual file locations.

Operational tips:
- Use the async handler utility to wrap route handlers for consistent error handling.
- Use ApiResponse and ApiError utilities to standardize responses and errors.

**Section sources**
- [src/index.js](file://src/index.js#L9)
- [src/db/index.js](file://src/db/index.js#L8-L10)
- [src/app.js](file://src/app.js#L8-L10)
- [src/utils/asyncHandler.js](file://src/utils/asyncHandler.js#L1-L8)
- [src/utils/ApiResponse.js](file://src/utils/ApiResponse.js#L1-L17)
- [src/utils/ApiError.js](file://src/utils/ApiError.js#L1-L22)

## System Requirements and Compatibility
- Node.js: Version 18 or later recommended for ES modules support and performance.
- Operating systems: Windows, macOS, and Linux are supported.
- Database: MongoDB must be accessible from your machine or cloud provider.
- Package manager: npm is sufficient; yarn/pnpm are alternatives but not required.

Compatibility notes:
- The project uses ES modules (import/export). Ensure your Node.js version supports this.
- Express and Mongoose versions are included as dependencies; keep them updated as per project needs.

**Section sources**
- [package.json](file://package.json#L14-L26)

## Conclusion
You now have the essentials to install, configure, and run the Task Management System Backend. Use the .env file to define database and server settings, choose development or production mode via npm scripts, and verify health by hitting the base endpoint. For persistent issues, consult the troubleshooting section and confirm environment variable correctness.