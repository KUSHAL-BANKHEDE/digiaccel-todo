# Digiaccel To-Do

A mobile-first MERN to-do application built for the Digiaccel SDE-1 assessment. Tasks are grouped into Monday-Sunday weeks, with daily filtering, search, priorities, completion tracking, and an expandable weekly overview.

## Live Application

- Frontend: `https://your-frontend.vercel.app`
- API: `https://your-api.vercel.app`
- Database: MongoDB Atlas

Replace the placeholder URLs above after deploying.

## Features

- Create, edit, search, complete, and delete tasks
- Required title, date, and start time; optional description, end time, and priority
- Monday-Sunday week navigation and grouping
- Expandable weekly cards with open/completed counts and progress
- Today and week views
- Swipe-left deletion with an accessible delete action
- Mobile-first responsive UI with safe-area support
- Loading, empty, error, and toast feedback states

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, TanStack Query, Axios, React Router, Framer Motion, date-fns, Lucide, React Hot Toast

**Backend:** Node.js, Express, Mongoose, MongoDB, Zod, Helmet, CORS, Morgan, express-rate-limit

## Project Structure

```text
.
├── backend/
│   ├── seed/                  # Demo data seeder
│   └── src/
│       ├── config/            # Environment and database configuration
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Validation, errors, database guard
│       ├── models/            # Mongoose models
│       ├── routes/            # Express routes
│       ├── utils/             # Date and error helpers
│       ├── validators/        # Zod schemas
│       ├── app.js             # Express application
│       └── start.js           # Local HTTP server
└── frontend/
    ├── public/
    └── src/
        ├── api/               # Axios client and task requests
        ├── components/        # Layout, task, and UI components
        ├── context/           # Task form sheet state
        ├── hooks/             # Query and debounce hooks
        ├── pages/             # Onboarding, home, and search
        └── utils/             # Date and class helpers
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- MongoDB Atlas connection string or a local MongoDB instance
- npm

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your MongoDB connection string, then seed and start the API:

```bash
npm run seed
npm run dev
```

The API runs at `http://localhost:5001` by default. Port 5001 is used to avoid the macOS AirPlay Receiver port conflict on port 5000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Vite proxies `/api` requests to `http://localhost:5001` during development.

To use a deployed API locally, create `frontend/.env`:

```text
VITE_API_URL=https://your-api.vercel.app/api
```

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development`, `test`, or `production` |
| `PORT` | No | Local server port, defaults to `5001` |
| `MONGODB_URI` | Yes | MongoDB connection string, including the database name |
| `CLIENT_ORIGINS` | No | Comma-separated allowed frontend origins |
| `RATE_LIMIT_MAX` | No | Maximum requests per 15-minute window, defaults to `500` |

Never commit `.env`. Use `.env.example` as the template.

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Production only | Full API base URL, including `/api` |

## API Reference

Base URL: `/api`

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | API health check |
| `GET` | `/tasks` | List tasks with optional filters |
| `POST` | `/tasks` | Create a task |
| `GET` | `/tasks/:id` | Get a single task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `PATCH` | `/tasks/:id/status` | Set status to `in-progress` or `completed` |
| `GET` | `/tasks/weeks` | Weekly task counts and progress |

### Task Payload

```json
{
  "title": "Meeting with team",
  "description": "Weekly sync with the product team",
  "date": "2026-11-15",
  "startTime": "11:00",
  "endTime": "12:00",
  "priority": "medium",
  "status": "in-progress"
}
```

- `title`: required, 1-120 characters
- `description`: optional, up to 1000 characters
- `date`: required calendar date in `YYYY-MM-DD` format
- `startTime`: required `HH:mm` time
- `endTime`: optional `HH:mm` time; must be after `startTime`
- `priority`: optional `low`, `medium`, or `high`
- `status`: `in-progress` or `completed`, defaults to `in-progress`

### List Filters

`GET /api/tasks` supports:

- `search`: case-insensitive title/description search
- `weekStart`: exact Monday date in `YYYY-MM-DD`
- `date`: exact task date
- `from` / `to`: inclusive date range
- `status`: `in-progress` or `completed`
- `sort`: field name, optionally prefixed with `-` for descending
- `limit`: maximum result count

Weekly summaries use `GET /api/tasks/weeks?from=YYYY-MM-DD&to=YYYY-MM-DD`.

### Response Format

```json
{
  "success": true,
  "count": 1,
  "data": {}
}
```

Errors return `{ "success": false, "message": "..." }`, with optional `details`.

## Deployment on Vercel

Deploy the frontend and backend as two Vercel projects from this single repository. Vercel supports Express APIs with zero configuration when the Express app is exported from a recognized entry file such as `backend/src/app.js`.

### 1. MongoDB Atlas

1. Create a free M0 cluster.
2. Create a database user with a strong password.
3. Add `0.0.0.0/0` to the Atlas network access list so Vercel Functions can connect.
4. Use a connection string that includes the database name:

```text
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digiaccel_todo?retryWrites=true&w=majority
```

### 2. Backend Project

Import this repository into Vercel with:

- Root Directory: `backend`
- Framework Preset: `Express`
- Build Command: leave empty
- Output Directory: leave empty

Add these environment variables:

```text
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/digiaccel_todo?retryWrites=true&w=majority
NODE_ENV=production
CLIENT_ORIGINS=https://your-frontend.vercel.app
RATE_LIMIT_MAX=500
```

Do not set `PORT` on Vercel. Deploy, then verify:

```bash
curl https://your-api.vercel.app/api/health
curl https://your-api.vercel.app/api/tasks
```

### 3. Frontend Project

Import the same repository again with:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Add:

```text
VITE_API_URL=https://your-api.vercel.app/api
```

Deploy. After the frontend URL is available, update the backend's `CLIENT_ORIGINS` value to the exact frontend origin and redeploy the backend. Environment variable changes require a new deployment.

### 4. Seed Production Data

Run the seed once from your machine using the production Atlas connection string:

```bash
cd backend
npm run seed
```

The seed removes existing tasks before inserting the demo tasks.

## Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start with nodemon |
| `npm start` | Start the production server |
| `npm run seed` | Reset and insert demo tasks |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

## Notes

- Weeks start on Monday.
- Tasks store dates as calendar strings rather than UTC timestamps to avoid timezone shifts.
- The API has no authentication because this is an assessment project. Do not reuse it for private data without adding auth.
