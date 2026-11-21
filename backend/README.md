# CivicPulse Backend API & PostgreSQL Database Layer

Enterprise backend service for the CivicPulse Smart City Infrastructure Management Platform.

## Architecture & Tech Stack
- **Runtime:** Node.js v20+ with TypeScript
- **Server:** Express.js with CORS, JSON body parser, and Cookie Parser
- **Database:** PostgreSQL (Optimized for **Neon.tech Serverless PostgreSQL** with SSL)
- **ORM:** Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`, `@neondatabase/serverless`)
- **Authentication:** JWT session tokens (`jose`) with HTTP-only cookies and bcrypt password hashing
- **Validation:** Zod request schemas and state machine transition guards
- **Testing:** Vitest

---

## Neon Database Setup Instructions

When you create your free project on [Neon.tech](https://neon.tech):

1. Copy your connection string from the Neon Console dashboard. It looks like:
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_xxxxxx@ep-xxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```
2. Paste this connection string into `backend/.env`:
   ```env
   DATABASE_URL="your-neon-connection-string-here"
   ```
3. Push the tables directly to your Neon database:
   ```bash
   npm run db:push
   ```
4. Populate your Neon database with 100+ issues, 5 departments, 20 staff, and demo accounts:
   ```bash
   npm run db:seed
   ```

---

## Available Commands

From the root monorepo directory:
- `npm run dev:backend` — Starts the backend server with auto-reload at `http://localhost:5000`
- `npm run test:backend` — Runs all 13 backend unit tests
- `npm run db:push` — Pushes Drizzle schemas to Neon PostgreSQL
- `npm run db:seed` — Runs database seeder

From the `backend/` directory:
- `npm run dev` — Starts development server
- `npm test` — Runs unit test suite
- `npm run db:push` — Syncs schema with database
- `npm run db:seed` — Seeds sample infrastructure data

---

## API Endpoints Overview

| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server healthcheck | Public |
| `POST` | `/api/auth/login` | User login (issues JWT cookie & token) | Public |
| `POST` | `/api/auth/register` | Citizen registration | Public |
| `POST` | `/api/auth/logout` | Clears session cookie | Authenticated |
| `GET` | `/api/auth/me` | Current session user profile | Authenticated |
| `GET` | `/api/issues` | List issues (search, filter, paginate, 50m duplicate check) | Public / Auth |
| `POST` | `/api/issues` | Report new issue with GPS and image | Citizen |
| `GET` | `/api/issues/:id` | Issue details with complete audit trail & tasks | Public / Auth |
| `PATCH`| `/api/issues/:id/status`| Transition status / assign manager or staff | Manager / Admin / Staff |
| `POST` | `/api/issues/:id/feedback` | Submit 5-star rating (auto-closes issue) | Reporter (Citizen) |
| `GET` | `/api/departments` | List departments with staff and active issue counts | Authenticated |
| `POST` | `/api/departments` | Create new department | Admin |
| `PATCH`| `/api/departments/:id`| Update department info or active status | Admin |
| `GET` | `/api/tasks` | List maintenance work orders | Staff / Manager / Admin |
| `PATCH`| `/api/tasks/:id` | Update task status, field notes, proof image | Maintenance Staff |
| `GET` | `/api/analytics` | Executive BI stats (trends, SLA compliance, SLA scorecard) | Authenticated |
| `GET` | `/api/saved-views` | List user's saved search queries | Authenticated |
| `POST` | `/api/saved-views` | Save a search query filter configuration | Authenticated |

---

## Demo Credentials

- **Admin:** `admin@civicpulse.gov` / `admin123`
- **Roads Manager:** `manager.roads@civicpulse.gov` / `manager123`
- **Electrical Staff:** `staff.electric@civicpulse.gov` / `staff123`
- **Citizen:** `citizen.jane@civicpulse.gov` / `citizen123`
