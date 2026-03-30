# MockWebApp

Full-stack web application — social network / discussion feed 

_Warning_: This is a vibe-coded demo app for experimentation only - not production-ready. It's mainly used to test deployments with a database, MinIO, and Redis.

## Features

- JWT authentication with registration, login and logout
- Public message feed with progressive loading of older posts
- Send messages with optional image/file attachment
- User avatar upload
- Real-time presence via Server-Sent Events
- Automatic refresh of new messages
- Smart auto-scroll: active at the bottom, paused when reading older messages
- Optimistic display of sent messages
- Modern UI with light/dark theme toggle
- Admin panel for managing users and messages

## Tech Stack

- Frontend: Vue 3 + TypeScript + Pinia + Vue Router + Vite
- Backend: Express + TypeScript + Sequelize + JWT
- Database: MySQL 8
- Object Storage: MinIO
- Real-time Presence: Redis + SSE
- Containerization: Docker Compose
- Additional Tools: phpMyAdmin

## Available Services

After starting with Docker:

| Service | URL | Notes |
|---|---|---|
| Frontend | `http://localhost:5173` | Main application |
| Backend API | `http://localhost:3000/api` | Express API |
| Healthcheck API | `http://localhost:3000/api/health` | Backend + DB health check |
| Swagger UI | `http://localhost:3000/api/docs` | Interactive API documentation |
| MinIO API | `http://localhost:9000` | Public files (`avatars`, `attachments`) |
| MinIO Console | `http://localhost:9001` | MinIO admin |
| phpMyAdmin | `http://localhost:8080` | MySQL administration |
| MySQL | `localhost:3306` | Exposed locally |
| Redis | `localhost:6379` | Exposed locally |

## Quick Start

### 1. Set Up the Environment

```bash
cp .env.example .env
```

The default values work with the project's `docker-compose.yml`.

### 2. Start the Application

```bash
docker compose up -d --build
```

### 3. Open the Application

- Frontend: `http://localhost:5173`
- Admin account seeded automatically: uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `.env`

## Development

The project is configured for in-Docker development with volume mounts.

### Hot Reload

- Backend: `ts-node-dev`
- Frontend: Vite with `watch.usePolling = true` to work properly with Docker on Windows

### Useful Commands

#### Full Project

```bash
docker compose up -d
docker compose up -d --build
docker compose down
docker compose down -v
```

#### Logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

#### Backend (local)

```bash
cd backend
npm install
npm run dev
npm run build
npm run lint
npm run format
```

#### Frontend (local)

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run format
```

## Media Storage

MinIO buckets are created automatically on startup:

- `avatars`
- `attachments`

In development, objects are served with public read access so that media files are directly accessible from the browser via MinIO.

## Authentication & Accounts

- Registration creates a standard account
- An admin account is automatically seeded on first startup
- Sensitive routes require a JWT token
- Authentication state is persisted on the frontend

## Main API

### Auth

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Log in |

### Users

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/users/me` | Current user profile |
| `PUT` | `/api/users/me` | Update own profile |
| `PUT` | `/api/users/me/avatar` | Upload avatar |
| `GET` | `/api/users` | List users (admin) |
| `GET` | `/api/users/:id` | User details (admin) |
| `PUT` | `/api/users/:id` | Update a user (admin) |
| `DELETE` | `/api/users/:id` | Delete a user (admin) |

### Messages

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/messages` | Paginated messages |
| `POST` | `/api/messages` | Create a message with optional file |
| `DELETE` | `/api/messages/:id` | Delete a message (admin) |

Useful parameters for `GET /api/messages`:

- `limit`: page size
- `before`: fetch older messages
- `after`: fetch newer messages

### Presence

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/presence/stream` | SSE presence stream |

## Project Structure

```text
MockWebApp/
├── backend/
│   └── src/
├── frontend/
│   └── src/
├── docs/
├── docker-compose.yml
├── .env.example
├── .env
└── README.md
```

## Notes

- To fully reset local data:

```bash
docker compose down -v
docker compose up -d --build
```

## Default Development Credentials

### MySQL

- Host: `localhost`
- Port: `3306`
- Database: `mockwebapp`
- User: `mockuser`
- Password: `mockpassword`

### MinIO

- Console/API user: `minioadmin`
- Password: `minioadmin`

### Application Admin

Defined via:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`