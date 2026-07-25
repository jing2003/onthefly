# On The Fly ✈️

On The Fly is a full-stack travel planning application that allows users to organize trips, destinations, and activities in one place.

## Live Demo

- Client: https://onthefly-client.onrender.com
- API: https://onthefly-i4xj.onrender.com

## Features

- Sign in with GitHub
- Create, view, edit, and delete trips
- Add destinations and activities to trips
- Add users to shared trips
- Upvote trip activities
- Store application data in PostgreSQL

## Tech Stack

- React
- Vite
- React Router
- Node.js
- Express
- PostgreSQL
- Passport GitHub OAuth
- Render

## Run Locally

1. Clone the repository.

```bash
git clone https://github.com/jing2003/onthefly
cd onthefly
```

2. Install dependencies.

```bash
npm install
```

3. Create a root `.env` file.

```env
NODE_ENV=development

PGHOST=
PGPORT=5432
PGDATABASE=
PGUSER=
PGPASSWORD=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
SESSION_SECRET=

CLIENT_URL=
SERVER_URL=
```

4. Start the client and server.

```bash
npm run dev
```

The client runs at `http://localhost:5173` and the server runs at `http://localhost:3001`.

## Deployment

The React client is deployed as a Render Static Site. The Express API is deployed as a Render Web Service and connects to a Render PostgreSQL database.
