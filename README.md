# CivicPulse — Smart City Infrastructure Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791.svg)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.40-C5F74F.svg)](https://orm.drizzle.team/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.6-764ABC.svg)](https://redux-toolkit.js.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-6E9F18.svg)](https://vitest.dev/)

CivicPulse is an enterprise-grade **GovTech** platform that unites citizens, municipal
department managers, field maintenance technicians, and city leadership in one transparent,
real-time infrastructure issue-resolution workflow.

> **See a problem. Report it. Track the progress. Improve your city.**

A citizen reports a pothole, broken streetlight, blocked drain, damaged footpath, or overflowing
bin with GPS coordinates and a photo. CivicPulse routes the report to the responsible
department, lets managers triage and dispatch crews, gives technicians a mobile work-order
board, and closes the loop with proof-of-repair photos and a citizen satisfaction rating.

---

## Table of Contents

1. [Key Features](#key-features)
2. [User Roles](#user-roles)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Repository Structure](#repository-structure)
6. [Getting Started](#getting-started)
7. [Demo Credentials](#demo-credentials)
8. [Available Scripts](#available-scripts)
9. [Testing](#testing)
10. [Documentation](#documentation)
11. [API at a Glance](#api-at-a-glance)
12. [Database at a Glance](#database-at-a-glance)
13. [Deployment](#deployment)
14. [License](#license)

---

## Key Features

### Citizen experience

- Geotagged issue reporting with photo upload (URL or base64 data URI).
- **50-metre duplicate radar** — automatically links a new report to a nearby existing issue.
- Public issue explorer with search, category/status/priority filters, sorting, and pagination.
- Personal report tracking with a live audit trail and status timeline.
- Community upvotes ("I see this too") and 1–5 star post-resolution feedback.
- Role-scoped notification feed.

### Department manager experience

- Department-scoped triage queue and issue detail views.
- Server-enforced lifecycle transitions (`submitted → under_review → assigned → in_progress → resolved → closed`).
- Crew assignment with automatic work-order creation.
- Duplicate linking, priority changes, and department re-routing.
- Department workload and SLA visibility.

### Field technician experience

- Mobile-friendly work-order board showing only assigned tasks.
- GPS coordinates and address for navigation.
- Start work, add field notes, upload completion proof photos.
- Task completion automatically resolves the parent issue.

### Administrator experience

- Citywide KPIs: total/pending/resolved counts, resolution rate, monthly trends.
- Department performance rankings with SLA compliance, grades, and medals.
- Citizen satisfaction (CSAT) and rating distribution.
- User provisioning and role/department management.
- Department lifecycle management.
- Immutable security audit log feed.
- Global system configuration (SLA targets, duplicate radius, working hours).

### Platform engineering

- Strict TypeScript across backend and frontend.
- Zod validation at every API boundary.
- JWT sessions with bcrypt password hashing and HTTP-only cookies.
- Role-based access control enforced **server-side**, not just in the UI.
- Append-only per-issue audit trail and system-wide security audit log.
- Composite database indexes on all high-frequency query paths.
- Rate limiting (brute-force protection for auth, request throttling for the API).
- Monorepo with npm workspaces and 37 unit tests (Vitest).

---

## User Roles

| Role | Primary Capabilities |
|---|---|
| **Citizen** | Register, report issues with GPS/photo, track progress, upvote, submit feedback. |
| **Department Manager** | Verify reports, assign crews, change priority, close issues — own department only. |
| **Maintenance Staff** | View assigned work orders, start work, add notes, upload completion proof. |
| **City Administrator** | Full governance: users, departments, analytics, settings, audit logs. |

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+, TypeScript 5.8 |
| Framework | Express 4 |
| Database | PostgreSQL (Neon Cloud) |
| ORM | Drizzle ORM 0.40 + `postgres-js` |
| Validation | Zod 3 |
| Auth | `jsonwebtoken` (JWT), `bcryptjs` |
| Email | Resend + React Email templates |
| Security | `cookie-parser`, custom rate limiter, security headers |
| Testing | Vitest 3 |
| Dev runner | `tsx watch` |

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 3.4 |
| State / Data | Redux Toolkit 2.6 + RTK Query |
| Maps | Leaflet + `react-leaflet` (OpenStreetMap tiles) |
| Charts | Recharts 2 |
| Icons | Lucide React |
| Motion | GSAP + Motion |
| Testing | Vitest 3 |

### Infrastructure

- npm workspaces monorepo (`backend`, `frontend`).
- Vercel serverless entry points (`api/index.js`, `server.js`).
- Neon PostgreSQL with SSL and pooled connections.

---

## System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                              Browser                                    │
│  Next.js 15 App Router                                                  │
│  ├─ Public site: landing, features, services, portals, FAQs             │
│  ├─ Auth: login, register, forgot password                              │
│  └─ Dashboards: citizen, manager, staff, admin                          │
│                                                                         │
│  Redux Toolkit + RTK Query  ·  Leaflet maps  ·  Recharts analytics      │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTPS / JSON (REST)
                                    │ Bearer JWT or HTTP-only cookie
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Express + TypeScript API (:5000)                    │
│                                                                         │
│  Routes       /api/auth  /api/issues  /api/departments  /api/tasks      │
│               /api/analytics  /api/users  /api/saved-views              │
│               /api/settings  /api/notifications                         │
│                                                                         │
│  Middleware   JWT authentication · role guards · rate limiters          │
│               CORS · security headers · Zod validation                  │
│                                                                         │
│  Services     issue routing · 50 m Haversine duplicate radar            │
│               SLA analytics · audit logging · Resend OTP email          │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ Drizzle ORM (SQL)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PostgreSQL (Neon Cloud)                           │
│                                                                         │
│  users · departments · issues · issue_activities · maintenance_tasks    │
│  saved_views · search_history · notifications · audit_logs              │
│                                                                         │
│  Native enums · composite B-tree indexes · referential integrity        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Issue lifecycle state machine

```text
[Submitted] → [Under Review] → [Assigned] → [In Progress] → [Resolved] → [Closed]
```

Managers and administrators can also reopen a closed issue to `Under Review`, and a resolved
issue can return to `In Progress` when rework is required.

Every transition is validated server-side against an explicit transition graph and appended to
`issue_activities` as an immutable audit record.

---

## Repository Structure

```text
civicpulse/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts        # Drizzle schema (9 tables, 5 enums, indexes)
│   │   │   ├── index.ts         # Neon/PostgreSQL connection + Drizzle client
│   │   │   ├── seed.ts          # Idempotent seed runner
│   │   │   └── mock-data.ts     # 5 departments, 33 users, 108 issues
│   │   ├── lib/
│   │   │   ├── auth.ts          # bcrypt hashing, JWT session tokens
│   │   │   ├── geo.ts           # Haversine distance + bounding box
│   │   │   ├── issue-service.ts # Category routing, duplicate radar, activity logging
│   │   │   ├── analytics-service.ts # KPIs, SLA, rankings, CSAT, trends
│   │   │   ├── audit.ts         # System-wide security audit logger
│   │   │   ├── email.ts         # Resend OTP delivery
│   │   │   └── validation.ts    # Zod schemas + lifecycle transition graph
│   │   ├── middleware/
│   │   │   ├── auth.ts          # authenticateToken + authorizeRole
│   │   │   └── rate-limiter.ts  # Auth/API/admin rate limiters
│   │   ├── routes/              # auth, issues, departments, tasks, analytics,
│   │   │                        # users, saved-views, settings, notifications
│   │   ├── emails/              # React Email templates
│   │   └── server.ts            # Express bootstrap, CORS, security headers
│   └── tests/                   # 6 backend Vitest suites
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/          # login, register, forgot-password
│   │   │   ├── (dashboard)/     # citizen, manager, staff, admin, issues, profile
│   │   │   ├── features/ services/ portals/ about/ contact/ faqs/
│   │   │   └── api/             # Next.js route handlers
│   │   ├── components/          # analytics, auth, issues, landing, layout,
│   │   │                        # map, table, ui
│   │   ├── store/               # Redux Toolkit + RTK Query slices
│   │   ├── lib/                 # Utilities and badge resolvers
│   │   └── types/               # Shared frontend types
│   └── tests/                   # 5 frontend Vitest suites
├── docs/
│   ├── DATABASE_DESIGN.md       # ERD, data dictionary, indexes, lifecycle
│   ├── API_DOCUMENTATION.md     # Full REST API reference
│   └── superpowers/             # Design specification and execution plans
├── api/index.js                 # Vercel serverless entry
├── server.js                    # Vercel serverless entry (root)
├── drizzle.config.ts
└── package.json                 # npm workspaces root
```

---

## Getting Started

### 1. Prerequisites

- **Node.js** v20 or newer
- **npm** v10 or newer
- **PostgreSQL 14+** — either a local instance or a free
  [Neon Cloud](https://neon.tech/) account

### 2. Clone and install

```bash
git clone https://github.com/tayabunn/civicpulse.git
cd civicpulse

# Installs dependencies for the root, backend, and frontend workspaces
npm install
```

### 3. Configure environment variables

Create a `.env` file in the repository root (or in `backend/`):

```env
# PostgreSQL connection string (Neon or local)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/civicpulse

# JWT signing secret — use a long random value in production
JWT_SECRET=change-me-to-a-long-random-string

# Frontend origin allowed by CORS
FRONTEND_URL=http://localhost:3000

# Backend port (optional, defaults to 5000)
PORT=5000

# Optional: Resend API key for OTP emails
# RESEND_API_KEY=re_xxxxxxxxxxxx
# EMAIL_FROM=CivicPulse <onboarding@resend.dev>
```

For the frontend, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> `RESEND_API_KEY` is optional. Without it, OTP codes are printed to the backend console, and the
> development master code `123456` always works.

### 4. Create the schema and seed demo data

```bash
# Push the Drizzle schema to PostgreSQL
npm run db:push

# Populate with 5 departments, 33 users, and 108 realistic issues
npm run db:seed
```

### 5. Run the development servers

```bash
# Terminal 1 — Express API on http://localhost:5000
npm run dev:backend

# Terminal 2 — Next.js frontend on http://localhost:3000
npm run dev:frontend
```

Open **http://localhost:3000** and use the 1-click demo persona switcher in the navigation
header, or sign in with the credentials below.

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **City Administrator** | `admin@civicpulse.gov` | `admin123` |
| **Department Manager** (Roads) | `manager.roads@civicpulse.gov` | `manager123` |
| **Field Technician** (Electrical) | `staff.electric@civicpulse.gov` | `staff123` |
| **Citizen** | `citizen.jane@civicpulse.gov` | `citizen123` |

The frontend also supports instant persona switching via `demo-token-admin`,
`demo-token-manager`, `demo-token-staff`, and `demo-token-citizen`.

---

## Available Scripts

Run from the repository root:

| Script | Description |
|---|---|
| `npm run dev:backend` | Start the Express API with hot reload (`tsx watch`) on port 5000. |
| `npm run dev:frontend` | Start the Next.js dev server on port 3000. |
| `npm run build` | Build backend (`tsc`) and frontend (`next build`). |
| `npm run build:backend` | Build the backend only. |
| `npm run build:frontend` | Build the frontend only. |
| `npm run test` | Run all backend and frontend Vitest suites. |
| `npm run test:backend` | Run backend tests only. |
| `npm run test:frontend` | Run frontend tests only. |
| `npm run db:push` | Push the Drizzle schema to the configured database. |
| `npm run db:seed` | Seed departments, users, issues, activities, and tasks. |

Backend workspace extras (`npm --workspace=backend run <script>`):

| Script | Description |
|---|---|
| `db:generate` | Generate SQL migrations with `drizzle-kit`. |
| `start` | Run the compiled backend from `dist/server.js`. |

---

## Testing

CivicPulse ships with **37 unit tests** across 11 suites (24 backend, 13 frontend):

```bash
# All tests
npm run test

# Backend only
npm run test:backend

# Frontend only
npm run test:frontend
```

**Backend suites** (`backend/tests/`)

- `db-schema.test.ts` (2 tests) — schema enums, tables, and relationships.
- `auth.test.ts` (2 tests) — password hashing, JWT session creation/verification.
- `issue-service.test.ts` (4 tests) — category routing, duplicate radar, activity logging.
- `analytics-service.test.ts` (3 tests) — SLA compliance and KPI calculations.
- `security-integrity.test.ts` (10 tests) — role and lifecycle guard behavior.
- `mock-data.test.ts` (3 tests) — seed data shape and referential consistency.

**Frontend suites** (`frontend/tests/`)

- `redux-store.test.ts` (3 tests) — store configuration and slices.
- `advanced-features.test.ts` (5 tests) — advanced UI/data behavior.
- `map-icons.test.ts` (1 test) — map marker icon resolution.
- `utils.test.ts` (3 tests) — utility functions.
- `sanity.test.ts` (1 test) — environment sanity checks.

---

## Documentation

| Document | Contents |
|---|---|
| **[Database Design](docs/DATABASE_DESIGN.md)** | ER diagram, 9-table data dictionary, enums, relationships, indexes, normalization decisions, lifecycle state machine, seed data, query patterns, migration workflow. |
| **[API Documentation](docs/API_DOCUMENTATION.md)** | Base URLs, authentication, rate limits, authorization matrix, every endpoint with request/response examples, error reference. |
| **[Design Specification](docs/superpowers/specs/2026-11-21-civicpulse-design.md)** | Goals, non-goals, architectural decisions, and detailed requirements. |
| **[Advanced Requirements](docs/superpowers/plans/2026-11-22-advanced-requirements.md)** | Bonus challenge requirements and implementation plan. |
| **[Frontend Structure](CivicPulse-Frontend-Structure.md)** | Public site and dashboard content plan. |

---

## API at a Glance

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Service health check. |
| `POST` | `/auth/login` | Public | Email/password login; returns JWT. |
| `POST` | `/auth/register` | Public | Citizen self-registration. |
| `POST` | `/auth/send-code` | Public | Send a 6-digit OTP email. |
| `POST` | `/auth/verify-code` | Public | Verify OTP and create a session. |
| `POST` | `/auth/forgot-password` | Public | Send a password reset code. |
| `POST` | `/auth/reset-password` | Public | Reset password with a code. |
| `GET` | `/auth/me` | Bearer | Current session user. |
| `GET` | `/issues` | Public | Filter, search, sort, paginate; duplicate radar. |
| `POST` | `/issues` | Bearer | Create a report with auto-routing and duplicate detection. |
| `GET` | `/issues/:id` | Public | Issue detail + audit trail + tasks. |
| `PUT` | `/issues/:id` | Bearer | Edit issue details (ownership rules). |
| `DELETE` | `/issues/:id` | Bearer | Cancel a pre-triage report (soft close). |
| `PATCH` | `/issues/:id/status` | Bearer | Validated lifecycle transition / assignment. |
| `POST` | `/issues/:id/feedback` | Bearer | Submit 1–5 star feedback; closes the issue. |
| `POST` | `/issues/:id/upvote` | Bearer | Community confirmation (idempotent). |
| `GET` | `/departments` | Bearer | Departments with manager info and stats. |
| `POST` / `PATCH` | `/departments` | Admin | Create / update departments. |
| `GET` | `/tasks` | Bearer | Work orders (staff see only their own). |
| `PATCH` | `/tasks/:id` | Bearer | Update task status, notes, and proof photo. |
| `GET` | `/analytics` | Public | KPIs, SLA, rankings, CSAT, trends. |
| `GET` | `/users` | Admin / Manager | List users with role and search filters. |
| `GET` | `/users/audit-logs` | Admin | Latest 100 security audit entries. |
| `POST` / `PATCH` / `DELETE` | `/users` | Admin | User provisioning and management. |
| `GET` / `POST` | `/saved-views` | Bearer | Saved explorer views. |
| `GET` | `/settings` | Bearer | System configuration. |
| `PATCH` | `/settings` | Admin | Update configuration. |
| `GET` | `/notifications` | Bearer | Role-scoped notification feed. |
| `PATCH` | `/notifications/read-all` | Bearer | Mark all notifications read. |
| `PATCH` | `/notifications/:id/read` | Bearer | Mark one notification read. |

See **[API Documentation](docs/API_DOCUMENTATION.md)** for full request/response examples.

---

## Database at a Glance

| Table | Purpose |
|---|---|
| `users` | All identities and roles (admin, manager, staff, citizen). |
| `departments` | Municipal operating units and category routing. |
| `issues` | Central report fact table with status, priority, GPS, feedback. |
| `issue_activities` | Append-only per-issue audit trail. |
| `maintenance_tasks` | Field work orders connecting issues to technicians. |
| `saved_views` | Per-user explorer filter/sort/column presets. |
| `search_history` | Recent search queries per user. |
| `notifications` | Persisted in-app notifications. |
| `audit_logs` | System-wide security and administration audit trail. |

Key indexes: `(department_id, status)`, `(reporter_id, created_at)`,
`(category, priority)`, `(latitude, longitude)`, `(issue_id, created_at)`,
`(staff_id, status)`, and three audit-log indexes.

See **[Database Design](docs/DATABASE_DESIGN.md)** for the full ER diagram and data dictionary.

---

## Deployment

### Backend (Vercel serverless)

- `api/index.js` and `server.js` load the compiled Express app from `backend/dist/server.js`.
- Set the following environment variables in the Vercel project:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `FRONTEND_URL`
  - `RESEND_API_KEY` (optional)
- Build command: `npm run build:backend`
- The server detects `VERCEL=1` and skips `app.listen()`.

### Frontend (Vercel / any Node host)

- Set `NEXT_PUBLIC_API_URL` to the deployed API base (e.g. `https://api.example.com/api`).
- Build command: `npm run build:frontend`
- Output: standard Next.js build.

### Database

1. Provision Neon PostgreSQL (or any PostgreSQL 14+ instance).
2. Run `npm run db:push` against the production `DATABASE_URL`.
3. Optionally run `npm run db:seed` for demo data.
4. Confirm SSL is enabled (`sslmode=require`).

---

## License

MIT © 2026 CivicPulse Team
