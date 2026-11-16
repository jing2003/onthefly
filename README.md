# On The Fly ✈️

On The Fly is a full-stack travel planning application developed as part of a **CodePath WEB103 lab**.

The project explores building a React frontend with an Express API, PostgreSQL database, and GitHub OAuth authentication. Its intended functionality includes organizing trips, destinations, and activities, as well as collaborating with other users.

**Project status: Incomplete coursework — not production-ready.**

This repository is preserved as a record of hands-on full-stack development experience. Some features remain incomplete or unverified, and the project is receiving only limited maintenance.

## Project Status

As of November 2026:

- The React frontend and Express backend are temporarily suspended on Render.
- The previous PostgreSQL database is no longer visible in the Render dashboard. Its deletion has not been independently confirmed.
- The application has not been verified to run successfully end-to-end in its current state.
- Some authentication, authorization, database, and frontend implementation issues remain unresolved.

The repository should not be considered a functioning live demo or production deployment.

## Features Explored

The source code contains implementations for:

- GitHub OAuth authentication
- Creating, viewing, updating, and deleting trips
- Managing trip destinations and activities
- Associating destinations with trips
- Adding users to shared trips
- Voting on activities

These reflect the functionality developed or attempted during the lab. **Not all workflows have been verified as functional or complete.**

## Tech Stack

**Frontend**

- React
- Vite
- React Router

**Backend**

- Node.js
- Express
- Passport.js with GitHub OAuth
- Express Session

**Database**

- PostgreSQL
- `pg` (node-postgres)

**Hosting (currently suspended)**

- Render Static Site
- Render Web Service

## Repository Structure

```text
onthefly/
├── client/          # React frontend
├── server/
│   ├── config/      # Database and authentication configuration
│   ├── controllers/ # API request handlers
│   ├── routes/      # Express API routes
│   └── server.js    # Express application
├── package.json
└── README.md
```

## Local Development

The root `package.json` defines the following commands:

```bash
npm install
npm run dev
```

The development script is intended to start the Vite frontend and Express backend.

**Important:** The local setup has not been verified in the current repository state.

Running the application requires PostgreSQL configuration, GitHub OAuth credentials, and session configuration. The existing environment-variable loading paths are inconsistent and require review before reliable setup instructions can be provided.

Do not commit credentials or environment files to the repository.

The repository also contains a database reset script (`npm run reset`) with destructive operations. **Do not execute it against an existing or production database.**

## Known Limitations

- Some API endpoints require additional authentication and authorization safeguards.
- Database table naming and configuration are inconsistent in parts of the application.
- Some frontend workflows are incomplete or lack reliable error handling.
- Automated regression tests and GitHub Actions CI workflows have not been established.
- The current application has not undergone complete end-to-end verification.

These issues are documented to distinguish the educational implementation from a production-ready application.

## Previous Deployment

The application was previously hosted on Render:

- Frontend: https://onthefly-client.onrender.com
- Backend: https://onthefly-i4xj.onrender.com

**Both services are intentionally suspended. These URLs are retained for historical reference, not as active demos.**

## Project Background

On The Fly was created during CodePath WEB103 to practice full-stack application development, including frontend routing, REST APIs, relational databases, authentication, and deployment.

The repository reflects a learning-stage implementation rather than a completed independent software product.

Maintenance is intentionally limited to improving documentation, addressing selected technical issues, and preserving the original coursework history.
