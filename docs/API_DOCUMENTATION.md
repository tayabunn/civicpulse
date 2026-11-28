# CivicPulse — REST API Documentation

**Service:** CivicPulse Smart City Infrastructure API
**Version:** 1.0.0
**Base URL (local):** `http://localhost:5000/api`
**Content type:** `application/json`
**Source:** [`backend/src/routes`](../backend/src/routes)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication](#2-authentication)
3. [Rate Limiting & Security Headers](#3-rate-limiting--security-headers)
4. [Response Conventions](#4-response-conventions)
5. [Authorization Matrix](#5-authorization-matrix)
6. [Data Types & Enums](#6-data-types--enums)
7. [System Endpoints](#7-system-endpoints)
8. [Authentication Endpoints](#8-authentication-endpoints)
9. [Issue Endpoints](#9-issue-endpoints)
10. [Department Endpoints](#10-department-endpoints)
11. [Task Endpoints](#11-task-endpoints)
12. [Analytics Endpoints](#12-analytics-endpoints)
13. [User Endpoints](#13-user-endpoints)
14. [Saved View Endpoints](#14-saved-view-endpoints)
15. [Settings Endpoints](#15-settings-endpoints)
16. [Notification Endpoints](#16-notification-endpoints)
17. [Error Reference](#17-error-reference)

---

## 1. Overview

The CivicPulse API is an Express + TypeScript REST service backed by PostgreSQL through Drizzle
ORM. It exposes resources for authentication, issue reporting and triage, department management,
field work orders, analytics, notifications, saved views, and system settings.

### Base paths

| Environment | Base URL |
|---|---|
| Local backend | `http://localhost:5000/api` |
| Local frontend (proxied) | `http://localhost:3000/api` (client uses `NEXT_PUBLIC_API_URL`) |
| Production (Vercel) | `https://<your-deployment>.vercel.app/api` |

### Request format

- All request bodies are JSON (`Content-Type: application/json`).
- Query parameters are URL-encoded.
- Timestamps are ISO 8601 strings in UTC (e.g. `2026-11-28T09:30:00.000Z`).
- IDs are UUID v4 strings.

### Quick smoke test

```bash
curl http://localhost:5000/api/health
```

```json
{
  "status": "online",
  "service": "CivicPulse Smart City Infrastructure API",
  "timestamp": "2026-11-28T09:30:00.000Z"
}
```

---

## 2. Authentication

CivicPulse uses **JWT session tokens** signed with `JWT_SECRET` (7-day token expiry) and an
HTTP-only session cookie (7–30 days depending on the authentication flow).

### 2.1 Sending credentials

Two mechanisms are accepted by `authenticateToken`:

| Mechanism | How |
|---|---|
| **Bearer header** (recommended for API clients) | `Authorization: Bearer <token>` |
| **Session cookie** (used by the web app) | `civicpulse_session=<token>` |

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/issues
```

### 2.2 Login flow

1. `POST /api/auth/login` (or `POST /api/auth/verify-code` for OTP login).
2. The response returns a `token` and also sets:
   - `civicpulse_session` — HTTP-only JWT cookie.
   - `civicpulse_trusted_device` — 30-day trusted-device flag.
3. Send the token on subsequent requests.

### 2.3 Demo persona tokens

For frictionless testing, the backend accepts special tokens without a login round-trip:

| Token | Persona | Role |
|---|---|---|
| `demo-token-admin` | Sarah Rahman (City Administrator) | `admin` |
| `demo-token-manager` | Rafiqul Islam (Roads Manager) | `department_manager` |
| `demo-token-staff` | Kamal Hossain (Field Electrician) | `maintenance_staff` |
| `demo-token-citizen` | Jane Citizen | `citizen` |

```bash
curl -H "Authorization: Bearer demo-token-admin" http://localhost:5000/api/auth/me
```

### 2.4 Demo credentials

| Role | Email | Password |
|---|---|---|
| City Administrator | `admin@civicpulse.gov` | `admin123` |
| Department Manager | `manager.roads@civicpulse.gov` | `manager123` |
| Field Technician | `staff.electric@civicpulse.gov` | `staff123` |
| Citizen | `citizen.jane@civicpulse.gov` | `citizen123` |

### 2.5 One-time-code (OTP) authentication

The login screen supports a 6-digit email code:

1. `POST /api/auth/send-code` — generates a cryptographically random code valid for **10 minutes** and emails it via Resend.
2. `POST /api/auth/verify-code` — verifies the code, auto-registers unknown users, and returns a session.
3. Development master code: `123456` (accepted for demo/testing).

> If `RESEND_API_KEY` is not configured, the code is printed to the backend console instead of emailed.

---

## 3. Rate Limiting & Security Headers

### 3.1 Rate limits

| Scope | Limit | Window | Key |
|---|---|---|---|
| `/api/auth/*` | 15 requests | 15 minutes | Client IP (`x-forwarded-for` aware) |
| `/api/*` | 150 requests | 1 minute | Client IP |

Health endpoints (`/health`, `/api/health`) are excluded from rate limiting.

Auth routes pass through **both** limiters.

### 3.2 Rate-limit headers

Every limited response includes:

```
X-RateLimit-Limit: 150
X-RateLimit-Remaining: 149
X-RateLimit-Reset: 42
```

On HTTP 429:

```
Retry-After: 42
```

```json
{
  "error": "API rate limit exceeded. Please throttle your requests.",
  "retryAfterSeconds": 42
}
```

### 3.3 Security headers

The server sets on every response:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

CORS allows credentialed requests from the configured frontend origin and `*.vercel.app`
deployments.

---

## 4. Response Conventions

### 4.1 Success responses

Most responses return a JSON object. Common shapes:

```json
{ "success": true, "issue": { "...": "..." } }
```

```json
{ "items": [], "total": 0, "page": 1, "limit": 10, "totalPages": 0 }
```

```json
{ "departments": [] }
```

### 4.2 Error responses

Single-message errors:

```json
{ "error": "Issue not found" }
```

Validation errors return Zod's structured format:

```json
{
  "error": {
    "title": {
      "_errors": ["Title must be at least 5 characters"]
    }
  }
}
```

### 4.3 HTTP status codes

| Code | Meaning in this API |
|---|---|
| `200 OK` | Successful read or update. |
| `201 Created` | Resource created (register, issue, department, user, saved view). |
| `400 Bad Request` | Missing/invalid fields, invalid status transition, invalid rating, self-deletion. |
| `401 Unauthorized` | Missing/invalid/expired token; wrong password or OTP code. |
| `403 Forbidden` | Authenticated but role/ownership does not permit the action. |
| `404 Not Found` | Resource does not exist. |
| `409 Conflict` | Duplicate email on registration or user creation. |
| `429 Too Many Requests` | Rate limit exceeded. |
| `500 Internal Server Error` | Unexpected server failure. |

---

## 5. Authorization Matrix

**Legend:** `Yes` = allowed · `No` = forbidden · `Scoped` = ownership/department rules apply ·
`Public` = no authentication required

| Resource / Action | Public | Citizen | Manager | Staff | Admin |
|---|---|---|---|---|---|
| `GET /api/issues` | Public | Yes | Yes | Yes | Yes |
| `GET /api/issues/:id` | Public | Yes | Yes | Yes | Yes |
| `POST /api/issues` | No | Yes | Yes | Yes | Yes |
| `PUT /api/issues/:id` | No | Scoped: own, `submitted` only | Yes | No | Yes |
| `DELETE /api/issues/:id` | No | Scoped: own, `submitted` only | No | No | Yes |
| `PATCH /api/issues/:id/status` | No | No | Scoped: own dept | Scoped: assigned only | Yes |
| `POST /api/issues/:id/feedback` | No | Scoped: reporter only | No | No | Yes |
| `POST /api/issues/:id/upvote` | No | Yes | Yes | Yes | Yes |
| `GET /api/departments` | No | Yes | Yes | Yes | Yes |
| `POST/PATCH /api/departments` | No | No | No | No | Yes |
| `GET /api/tasks` | No | Yes (all) | Yes (all) | Scoped: own tasks | Yes (all) |
| `PATCH /api/tasks/:id` | No | No | Yes | Scoped: assigned only | Yes |
| `GET /api/analytics` | Public | Yes | Yes | Yes | Yes |
| `GET /api/users` | No | No | Yes | No | Yes |
| `GET /api/users/audit-logs` | No | No | No | No | Yes |
| `POST/PATCH/DELETE /api/users` | No | No | No | No | Yes |
| `GET/POST /api/saved-views` | No | Yes | Yes | Yes | Yes |
| `GET /api/settings` | No | Yes | Yes | Yes | Yes |
| `PATCH /api/settings` | No | No | No | No | Yes |
| `GET /api/notifications` | No | Scoped: own feed | Scoped: dept feed | Scoped: own feed | Yes all |
| `PATCH /api/notifications/*` | No | Scoped: own | Scoped: own | Scoped: own | Yes |

### Issue status transition rules

| Actor | Permitted transitions |
|---|---|
| Citizen | None directly. Feedback submission closes the issue. Cancellation (DELETE) closes own pre-triage report. |
| Maintenance staff | `assigned → in_progress`, `in_progress → resolved` — only for issues assigned to them. |
| Department manager | Any valid transition, restricted to their own department. |
| Admin | Any valid transition. |

Valid transitions are defined in [Database Design § 8](./DATABASE_DESIGN.md#8-issue-lifecycle-state-machine).

---

## 6. Data Types & Enums

### 6.1 Enums

| Enum | Values |
|---|---|
| `user_role` | `admin`, `department_manager`, `maintenance_staff`, `citizen` |
| `issue_category` | `road_damage`, `streetlight`, `drainage`, `footpath`, `waste_management`, `public_infrastructure` |
| `issue_status` | `submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `closed` |
| `issue_priority` | `low`, `medium`, `high`, `critical` |
| `task_status` | `pending`, `in_progress`, `completed` |

### 6.2 Core object shapes

**User (session)**

```json
{
  "id": "10000000-0000-0000-0000-000000000004",
  "email": "citizen.jane@civicpulse.gov",
  "name": "Jane Citizen",
  "role": "citizen",
  "departmentId": null,
  "phone": "+880 1711 000004",
  "avatarUrl": null
}
```

**Issue (list item)**

```json
{
  "id": "a0000000-0000-0000-0000-000000000001",
  "title": "Hazardous pothole expanding near traffic signal #1",
  "description": "Citizens in Dhanmondi 27 have reported...",
  "category": "road_damage",
  "status": "submitted",
  "priority": "low",
  "latitude": 23.7539,
  "longitude": 90.3771,
  "address": "House 42, Road 27, Dhanmondi, Dhaka",
  "imageUrl": "https://images.unsplash.com/...",
  "reporterId": "10000000-0000-0000-0000-000000000004",
  "departmentId": "d0000000-0000-0000-0000-000000000001",
  "assignedStaffId": null,
  "duplicateOfId": null,
  "feedbackRating": null,
  "feedbackComment": null,
  "createdAt": "2026-11-20T10:00:00.000Z",
  "updatedAt": "2026-11-20T16:00:00.000Z",
  "resolvedAt": null,
  "departmentName": "Roads & Highways",
  "reporterName": "Jane Citizen"
}
```

**Tracking code:** `CP-` + first 8 characters of the issue UUID, uppercased
(e.g. `CP-A0000000`).

---

## 7. System Endpoints

### 7.1 `GET /`

API discovery and health summary. **Public.**

**Response `200`**

```json
{
  "status": "online",
  "service": "CivicPulse Smart City Infrastructure API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "issues": "/api/issues",
    "departments": "/api/departments",
    "tasks": "/api/tasks",
    "analytics": "/api/analytics"
  },
  "timestamp": "2026-11-28T09:30:00.000Z"
}
```

### 7.2 `GET /health` and `GET /api/health`

Lightweight health check. **Public**, excluded from rate limiting.

```json
{
  "status": "online",
  "service": "CivicPulse Smart City Infrastructure API",
  "timestamp": "2026-11-28T09:30:00.000Z"
}
```

---

## 8. Authentication Endpoints

Base path: `/api/auth`

### 8.1 `POST /api/auth/login`

Authenticate with email + password, or a trusted device cookie.

**Auth:** Public
**Body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | Case-insensitive. |
| `password` | string | No | Required unless the trusted-device flag is present. |
| `trustedDevice` | boolean | No | Skips password verification (demo/trusted-device flow). |

**Response `200`**

```json
{
  "success": true,
  "user": {
    "id": "10000000-0000-0000-0000-000000000004",
    "email": "citizen.jane@civicpulse.gov",
    "name": "Jane Citizen",
    "role": "citizen",
    "departmentId": null,
    "phone": "+880 1711 000004",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "trustedUntil": 1796000000000
}
```

Sets cookies `civicpulse_session` (HTTP-only, 30 days) and `civicpulse_trusted_device` (30 days).

**Errors:** `400` missing email · `401` unknown account / invalid password · `500`.

**Example**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"citizen.jane@civicpulse.gov","password":"citizen123"}'
```

---

### 8.2 `POST /api/auth/register`

Create a public account. **Self-registration always creates a `citizen`.**

**Auth:** Public
**Body**

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | string | Yes | ≥ 2 characters |
| `email` | string | Yes | Valid email |
| `password` | string | Yes | ≥ 6 characters |
| `phone` | string | No | — |

**Response `201`**

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "...", "role": "citizen", "departmentId": null },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Errors:** `400` validation · `409` email already registered · `500`.

---

### 8.3 `POST /api/auth/google`

Lightweight Google-style sign-in. Creates a citizen account if the email is unknown.

**Auth:** Public
**Body:** `email` (required), `name` (optional), `avatarUrl` (optional)

**Response `200`:** same shape as login, plus trusted-device cookie.

---

### 8.4 `POST /api/auth/logout`

Clear the session cookie.

**Auth:** Public
**Response `200`**

```json
{ "success": true, "message": "Logged out successfully" }
```

---

### 8.5 `GET /api/auth/me`

Return the currently authenticated user.

**Auth:** Bearer / cookie
**Response `200`**

```json
{
  "user": {
    "id": "10000000-0000-0000-0000-000000000001",
    "email": "admin@civicpulse.gov",
    "name": "City Administrator (Chief Operations)",
    "role": "admin",
    "departmentId": null
  }
}
```

**Errors:** `401`.

---

### 8.6 `PATCH /api/auth/profile`

Update display name, phone, or avatar.

**Body**

| Field | Type | Required |
|---|---|---|
| `id` | uuid | Yes |
| `name` | string | No |
| `phone` | string | No |
| `avatarUrl` | string | No |

**Response `200`**

```json
{
  "success": true,
  "user": { "id": "...", "email": "...", "name": "...", "role": "citizen", "departmentId": null, "phone": "...", "avatarUrl": "..." }
}
```

**Errors:** `400` missing id · `404` user not found · `500`.

---

### 8.7 `PATCH /api/auth/password`

Change password by verifying the current password.

**Body:** `id` (uuid), `currentPassword`, `newPassword` (all required)

**Response `200`**

```json
{ "success": true, "message": "Password updated successfully" }
```

**Errors:** `400` missing fields · `401` current password mismatch · `404` user not found · `500`.

---

### 8.8 `POST /api/auth/send-code`

Generate and email a 6-digit login code (10-minute expiry).

**Auth:** Public
**Body:** `email` (required), `role` (optional)

**Response `200`**

```json
{
  "success": true,
  "message": "Verification code sent to jane@example.com",
  "emailSent": true,
  "expiresInSeconds": 600
}
```

`emailSent` is `false` when `RESEND_API_KEY` is not configured (the code is logged to the
server console in that case).

**Errors:** `400` missing email · `500`.

---

### 8.9 `POST /api/auth/verify-code`

Verify an OTP, auto-register the user if needed, and create a session.

**Auth:** Public
**Body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | — |
| `code` | string | Yes | 6 digits; `123456` is the development master code. |
| `role` | string | No | Used only for `@civicpulse.gov` addresses. |
| `name` | string | No | Display name for auto-registered users. |

**Role resolution**

| Email pattern | Resulting role |
|---|---|
| `admin@civicpulse.gov` | `admin` |
| `manager.*` or `@civicpulse.gov` + `role=manager` | `department_manager` |
| `staff.*` or `@civicpulse.gov` + `role=staff` | `maintenance_staff` |
| Everything else (e.g. `@gmail.com`) | `citizen` |

**Response `200`:** same shape as login.
**Errors:** `400` missing fields · `401` invalid/expired code · `500`.

---

### 8.10 `POST /api/auth/forgot-password`

Send a 6-digit password reset code (10-minute expiry).

**Auth:** Public
**Body:** `email` (required)

**Response `200`**

```json
{
  "success": true,
  "message": "A 6-digit password reset code has been sent to jane@example.com",
  "emailSent": true,
  "expiresInSeconds": 600
}
```

**Errors:** `400` missing email · `404` no account with that email · `500`.

---

### 8.11 `POST /api/auth/reset-password`

Complete a password reset with the emailed code.

**Auth:** Public
**Body:** `email`, `code`, `newPassword` (≥ 6 chars) — all required

**Response `200`**

```json
{
  "success": true,
  "message": "Your password has been reset successfully. You can now sign in with your new password."
}
```

**Errors:** `400` missing fields / short password · `401` invalid/expired code · `404` user not found · `500`.

---

## 9. Issue Endpoints

Base path: `/api/issues`

### 9.1 `GET /api/issues`

List issues with filtering, full-text search, sorting, and pagination. Also acts as the
**duplicate radar** when coordinates are supplied.

**Auth:** Public

**Query parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `q` | string | — | Case-insensitive search over title, description, address. |
| `category` | enum | — | `issue_category`. |
| `status` | enum | — | `issue_status`. |
| `priority` | enum | — | `issue_priority`. |
| `departmentId` | uuid | — | Filter by department. |
| `startDate` | date | — | `createdAt >= startDate` (00:00). |
| `endDate` | date | — | `createdAt <= endDate` (23:59:59.999). |
| `page` | integer | `1` | 1-indexed page. |
| `limit` | integer | `10` | Page size. |
| `sort` | enum | `createdAt` | `createdAt`, `updatedAt`, `priority`, `status`, `title`, `category`. |
| `order` | enum | `desc` | `asc` or `desc`. |
| `lat` | number | — | Latitude for duplicate radar. |
| `lng` | number | — | Longitude for duplicate radar. |
| `radius` | number | `50` | Duplicate radius in metres. |
| `myReports` | boolean | — | Accepted by the filter schema. |

**Standard response `200`**

```json
{
  "items": [
    {
      "id": "a0000000-0000-0000-0000-000000000001",
      "title": "Hazardous pothole expanding near traffic signal #1",
      "description": "Citizens in Dhanmondi 27 have reported...",
      "category": "road_damage",
      "status": "submitted",
      "priority": "low",
      "latitude": 23.7539,
      "longitude": 90.3771,
      "address": "House 42, Road 27, Dhanmondi, Dhaka",
      "imageUrl": "https://images.unsplash.com/...",
      "reporterId": "10000000-0000-0000-0000-000000000004",
      "departmentId": "d0000000-0000-0000-0000-000000000001",
      "assignedStaffId": null,
      "duplicateOfId": null,
      "feedbackRating": null,
      "feedbackComment": null,
      "createdAt": "2026-11-20T10:00:00.000Z",
      "updatedAt": "2026-11-20T16:00:00.000Z",
      "resolvedAt": null,
      "departmentName": "Roads & Highways",
      "reporterName": "Jane Citizen"
    }
  ],
  "total": 108,
  "page": 1,
  "limit": 10,
  "totalPages": 11
}
```

**Duplicate radar response**

When `lat`, `lng`, **and** `category` are provided and a match is found within `radius`
(default 50 m), the endpoint returns early with:

```json
{
  "duplicateFound": true,
  "duplicate": {
    "id": "a0000000-0000-0000-0000-000000000042",
    "title": "Hazardous pothole expanding near traffic signal #42",
    "category": "road_damage",
    "latitude": 23.7539,
    "longitude": 90.3771,
    "status": "assigned",
    "address": "House 42, Road 27, Dhanmondi, Dhaka"
  }
}
```

**Errors:** `400` invalid query · `500`.

**Examples**

```bash
# Filtered list
curl "http://localhost:5000/api/issues?category=road_damage&status=assigned&page=1&limit=20&sort=priority&order=desc"

# Duplicate check (50 m radius)
curl "http://localhost:5000/api/issues?category=road_damage&lat=23.7539&lng=90.3771&radius=50"
```

---

### 9.2 `POST /api/issues`

Create a new issue report. Runs the 50 m duplicate radar, auto-routes to a department, and
writes the initial audit activity.

**Auth:** Bearer / cookie (any authenticated role)

**Body**

| Field | Type | Required | Validation |
|---|---|---|---|
| `title` | string | Yes | 5–200 chars |
| `description` | string | Yes | ≥ 10 chars |
| `category` | enum | Yes | `issue_category` |
| `priority` | enum | No | Defaults to `medium` |
| `latitude` | number | Yes | −90…90 |
| `longitude` | number | Yes | −180…180 |
| `address` | string | Yes | ≥ 3 chars |
| `imageUrl` | string | No | HTTP(S) URL or base64 data URI ≤ 8 MB |

**Response `201`**

```json
{
  "success": true,
  "issue": {
    "id": "a0000000-0000-0000-0000-000000000109",
    "title": "Deep pothole on Mirpur Road",
    "description": "Large pothole near the bus stop, dangerous for motorcycles.",
    "category": "road_damage",
    "status": "submitted",
    "priority": "high",
    "latitude": 23.8069,
    "longitude": 90.3687,
    "address": "Mirpur 10 Roundabout, Dhaka",
    "imageUrl": null,
    "reporterId": "10000000-0000-0000-0000-000000000004",
    "departmentId": "d0000000-0000-0000-0000-000000000001",
    "assignedStaffId": null,
    "duplicateOfId": null,
    "feedbackRating": null,
    "feedbackComment": null,
    "createdAt": "2026-11-28T09:30:00.000Z",
    "updatedAt": "2026-11-28T09:30:00.000Z",
    "resolvedAt": null,
    "trackingCode": "CP-A0000000"
  },
  "duplicateDetected": false,
  "duplicateOfId": null,
  "duplicateTrackingCode": null
}
```

If a duplicate is found, `duplicateDetected` is `true`, `duplicateOfId` holds the original
issue's id, and `issue.duplicateOfId` is set.

**Side effects**
- Department is resolved from `category` via the category→code map.
- Activity `SUBMITTED` (or `SUBMITTED_WITH_AUTO_DUPLICATE_LINK`) is appended.

**Errors:** `400` validation · `401` unauthenticated · `500`.

**Example**

```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token-citizen" \
  -d '{
    "title": "Deep pothole on Mirpur Road",
    "description": "Large pothole near the bus stop, dangerous for motorcycles.",
    "category": "road_damage",
    "priority": "high",
    "latitude": 23.8069,
    "longitude": 90.3687,
    "address": "Mirpur 10 Roundabout, Dhaka"
  }'
```

---

### 9.3 `GET /api/issues/:id`

Issue detail with the full audit trail and maintenance tasks.

**Auth:** Public

**Response `200`**

```json
{
  "issue": {
    "id": "a0000000-0000-0000-0000-000000000001",
    "title": "Hazardous pothole expanding near traffic signal #1",
    "category": "road_damage",
    "status": "resolved",
    "priority": "high",
    "latitude": 23.7539,
    "longitude": 90.3771,
    "address": "House 42, Road 27, Dhanmondi, Dhaka",
    "imageUrl": "https://images.unsplash.com/...",
    "reporterId": "...",
    "departmentId": "d0000000-0000-0000-0000-000000000001",
    "assignedStaffId": "...",
    "duplicateOfId": null,
    "feedbackRating": 5,
    "feedbackComment": "Prompt repair!",
    "createdAt": "2026-11-01T08:00:00.000Z",
    "updatedAt": "2026-11-02T10:00:00.000Z",
    "resolvedAt": "2026-11-02T09:00:00.000Z",
    "departmentName": "Roads & Highways",
    "reporterName": "Jane Citizen"
  },
  "activities": [
    {
      "id": "a0000000-0000-0000-0000-000000000003",
      "action": "STATUS_CHANGE_TO_RESOLVED",
      "previousStatus": "in_progress",
      "newStatus": "resolved",
      "notes": "Maintenance completed and proof photograph uploaded.",
      "attachmentUrl": "https://example.com/proof.jpg",
      "createdAt": "2026-11-02T09:00:00.000Z",
      "userName": "Karim Mia (Crew Tech)",
      "userRole": "maintenance_staff"
    }
  ],
  "tasks": [
    {
      "id": "b0000000-0000-0000-0000-000000000001",
      "status": "completed",
      "fieldNotes": "Site inspected, repairs finished.",
      "proofImageUrl": "https://example.com/proof.jpg",
      "assignedAt": "2026-11-01T12:00:00.000Z",
      "startedAt": "2026-11-01T16:00:00.000Z",
      "completedAt": "2026-11-02T09:00:00.000Z",
      "staffName": "Karim Mia (Crew Tech)"
    }
  ]
}
```

**Errors:** `404` issue not found · `500`.

---

### 9.4 `PUT /api/issues/:id`

Edit issue details. Citizens may edit only their own reports while `status = submitted`;
department managers and admins may edit any issue's details. Maintenance staff cannot edit issue
details directly.

**Auth:** Bearer / cookie
**Body:** `title`, `description`, `address`, `imageUrl` (all optional)

**Response `200`**

```json
{ "success": true, "issue": { "...": "..." } }
```

**Errors:** `400` issue already in triage (citizen) · `401` · `403` not owner / insufficient role · `404` · `500`.

---

### 9.5 `DELETE /api/issues/:id`

Cancel a report. Citizens may cancel their own report before triage; admins may cancel any
issue. The issue is not deleted — it is closed and the cancellation is audited.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "success": true,
  "message": "Issue cancelled successfully",
  "issue": { "id": "...", "status": "closed", "...": "..." }
}
```

**Errors:** `400` already in triage · `401` · `403` · `404` · `500`.

---

### 9.6 `PATCH /api/issues/:id/status`

Change status, priority, department, assignee, or duplicate link. Enforces the lifecycle graph
and role rules server-side.

**Auth:** Bearer / cookie (admin, manager, staff)

**Body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum | No | Must be a valid transition from the current status. |
| `priority` | enum | No | Any priority. |
| `departmentId` | uuid | No | Re-route the issue. |
| `assignedStaffId` | uuid | No | Assign a technician. |
| `duplicateOfId` | uuid | No | Link to an original report. |
| `notes` | string | No | Stored in the activity log. |

**Response `200`**

```json
{ "success": true, "issue": { "id": "...", "status": "assigned", "assignedStaffId": "...", "...": "..." } }
```

**Side effects**
- `status = resolved` stamps `resolvedAt`.
- Assigning staff (`assignedStaffId` with `status = assigned` or omitted) creates a
  `maintenance_tasks` row with `status = pending`.
- A `STATUS_CHANGE_TO_<STATUS>` activity is appended.

**Errors**
- `400` invalid transition
- `401` unauthenticated
- `403` citizen attempt, staff not assigned, manager outside department, insufficient role
- `404` issue not found
- `500`

**Example**

```bash
curl -X PATCH http://localhost:5000/api/issues/a0000000-0000-0000-0000-000000000001/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token-manager" \
  -d '{
    "status": "assigned",
    "priority": "high",
    "assignedStaffId": "10000000-0000-0000-0000-000000000010",
    "notes": "Assigned to road crew for urgent patching."
  }'
```

---

### 9.7 `POST /api/issues/:id/feedback`

Submit a 1–5 star rating and optional comment. Closes the issue and records the feedback.

**Auth:** Bearer / cookie — reporter or admin only

**Body**

| Field | Type | Required | Validation |
|---|---|---|---|
| `rating` | integer | Yes | 1–5 |
| `comment` | string | No | Free text |

**Response `200`**

```json
{
  "success": true,
  "issue": { "id": "...", "status": "closed", "feedbackRating": 5, "feedbackComment": "Great work!", "...": "..." }
}
```

**Errors:** `400` rating out of range · `401` · `403` not the reporter · `404` · `500`.

---

### 9.8 `POST /api/issues/:id/upvote`

Community confirmation ("I see this too"). Idempotent per user.

**Auth:** Bearer / cookie

**Response `200` (new upvote)**

```json
{ "success": true, "upvotes": 7 }
```

**Response `200` (already upvoted)**

```json
{ "success": true, "alreadyUpvoted": true }
```

**Errors:** `401` · `404` issue not found · `500`.

---

## 10. Department Endpoints

Base path: `/api/departments`

### 10.1 `GET /api/departments`

List departments with manager info and live statistics.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "departments": [
    {
      "id": "d0000000-0000-0000-0000-000000000001",
      "name": "Roads & Highways",
      "code": "DEPT-ROAD",
      "description": "Municipal road paving, pothole repairs, street markers and bridges.",
      "isActive": true,
      "managerId": "10000000-0000-0000-0000-000000000002",
      "createdAt": "2026-11-01T08:00:00.000Z",
      "managerName": "Tariq Rahman (Roads Dept Manager)",
      "managerEmail": "manager.roads@civicpulse.gov",
      "staffCount": 4,
      "totalIssues": 18,
      "activeIssues": 12
    }
  ]
}
```

**Errors:** `401` · `500`.

---

### 10.2 `POST /api/departments`

Create a department.

**Auth:** Bearer / cookie — **admin only**
**Body:** `name` (required), `code` (required), `description`, `managerId`

**Response `201`**

```json
{ "success": true, "department": { "id": "...", "name": "...", "code": "...", "managerId": null, "isActive": true, "...": "..." } }
```

**Errors:** `400` missing name/code · `401` · `403` non-admin · `500`.
Writes `DEPARTMENT_CREATED` to `audit_logs`.

---

### 10.3 `PATCH /api/departments/:id`

Update a department.

**Auth:** Bearer / cookie — **admin only**
**Body:** `name`, `description`, `managerId`, `isActive` (all optional)

**Response `200`**

```json
{ "success": true, "department": { "...": "..." } }
```

**Errors:** `401` · `403` · `500`.
Writes `DEPARTMENT_MODIFIED` to `audit_logs`.

---

## 11. Task Endpoints

Base path: `/api/tasks`

### 11.1 `GET /api/tasks`

List maintenance tasks. Maintenance staff see only their own; other roles see all.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "tasks": [
    {
      "id": "b0000000-0000-0000-0000-000000000001",
      "issueId": "a0000000-0000-0000-0000-000000000001",
      "staffId": "10000000-0000-0000-0000-000000000010",
      "status": "pending",
      "fieldNotes": "Work order received.",
      "proofImageUrl": null,
      "assignedAt": "2026-11-20T14:00:00.000Z",
      "startedAt": null,
      "completedAt": null,
      "issueTitle": "Hazardous pothole expanding near traffic signal #1",
      "issueCategory": "road_damage",
      "issuePriority": "high",
      "issueAddress": "House 42, Road 27, Dhanmondi, Dhaka",
      "issueLatitude": 23.7539,
      "issueLongitude": 90.3771,
      "staffName": "Karim Mia (Crew Tech)"
    }
  ]
}
```

**Errors:** `401` · `500`.

---

### 11.2 `PATCH /api/tasks/:id`

Update a work order. Staff may update only tasks assigned to them.

**Auth:** Bearer / cookie (admin, manager, staff)

**Body**

| Field | Type | Required | Notes |
|---|---|---|---|
| `status` | enum | No | `pending`, `in_progress`, `completed`. |
| `fieldNotes` | string | No | Technician notes. |
| `proofImageUrl` | string | No | Valid HTTP(S) URL or base64 image data URI. |

**Response `200`**

```json
{ "success": true, "task": { "id": "...", "status": "completed", "completedAt": "2026-11-28T09:30:00.000Z", "...": "..." } }
```

**Side effects**
- `status = in_progress` (first time): sets `startedAt`, moves the issue to `in_progress`, logs activity.
- `status = completed`: sets `completedAt`, moves the issue to `resolved`, stamps `resolvedAt`, logs activity with the proof URL.

**Errors:** `400` invalid proof image · `401` · `403` citizen or staff not assigned · `404` task not found · `500`.

---

## 12. Analytics Endpoints

### 12.1 `GET /api/analytics`

Server-aggregated citywide analytics for dashboards. **Public.**

**Response `200`** (abridged)

```json
{
  "overview": {
    "total": 108,
    "pending": 72,
    "resolved": 36,
    "closed": 18,
    "resolutionRate": 33
  },
  "categoryDistribution": [
    { "category": "road_damage", "count": 18 },
    { "category": "streetlight", "count": 18 }
  ],
  "statusCounts": {
    "submitted": 18,
    "under_review": 18,
    "assigned": 18,
    "in_progress": 18,
    "resolved": 18,
    "closed": 18
  },
  "priorityCounts": { "low": 27, "medium": 27, "high": 27, "critical": 27 },
  "departmentMetrics": [
    {
      "departmentId": "d0000000-0000-0000-0000-000000000001",
      "departmentName": "Roads & Highways",
      "code": "DEPT-ROAD",
      "totalIssues": 18,
      "pendingIssues": 12,
      "resolvedIssues": 6,
      "avgResolutionHours": 57,
      "slaComplianceRate": 100
    }
  ],
  "departmentRankings": [
    {
      "departmentId": "d0000000-0000-0000-0000-000000000001",
      "departmentName": "Roads & Highways",
      "rank": 1,
      "score": 70,
      "grade": "C",
      "medal": "Gold",
      "trend": "+4%",
      "slaComplianceRate": 100,
      "avgResolutionHours": 57
    }
  ],
  "citizenSatisfaction": {
    "avgRating": 4.0,
    "totalRatings": 18,
    "csatPercentage": 100,
    "ratingDistribution": [
      { "stars": 5, "count": 0, "percentage": 0 },
      { "stars": 4, "count": 18, "percentage": 100 },
      { "stars": 3, "count": 0, "percentage": 0 },
      { "stars": 2, "count": 0, "percentage": 0 },
      { "stars": 1, "count": 0, "percentage": 0 }
    ]
  },
  "monthlyTrends": [
    { "month": "Jul 2026", "reported": 12, "resolved": 9 },
    { "month": "Aug 2026", "reported": 18, "resolved": 14 }
  ]
}
```

**SLA targets** (hours): `critical` 24, `high` 48, `medium` 96, `low` 168.

**Errors:** `500`.

---

## 13. User Endpoints

Base path: `/api/users`

### 13.1 `GET /api/users`

List users with optional role and search filters.

**Auth:** Bearer / cookie — **admin or department_manager**
**Query:** `role` (optional), `search` (optional; matches name, email, department name)

**Response `200`**

```json
{
  "users": [
    {
      "id": "10000000-0000-0000-0000-000000000010",
      "name": "Karim Mia (Crew Tech)",
      "email": "staff.karimmia@civicpulse.gov",
      "role": "maintenance_staff",
      "departmentId": "d0000000-0000-0000-0000-000000000001",
      "phone": "+880 1711 000010",
      "avatarUrl": null,
      "createdAt": "2026-11-01T08:00:00.000Z",
      "updatedAt": "2026-11-01T08:00:00.000Z",
      "departmentName": "Roads & Highways",
      "departmentCode": "DEPT-ROAD"
    }
  ],
  "total": 33
}
```

**Errors:** `401` · `403` · `500`.

---

### 13.2 `GET /api/users/audit-logs`

Latest 100 security audit entries, newest first.

**Auth:** Bearer / cookie — **admin only**

**Response `200`**

```json
{
  "success": true,
  "logs": [
    {
      "id": "c0000000-0000-0000-0000-000000000001",
      "actorId": "10000000-0000-0000-0000-000000000001",
      "actorEmail": "admin@civicpulse.gov",
      "actorRole": "admin",
      "action": "USER_CREATED",
      "resource": "users",
      "resourceId": "...",
      "details": "{\"email\":\"new@example.com\",\"role\":\"citizen\"}",
      "ipAddress": "127.0.0.1",
      "userAgent": "Mozilla/5.0 ...",
      "status": "SUCCESS",
      "createdAt": "2026-11-28T09:30:00.000Z"
    }
  ],
  "total": 1
}
```

**Errors:** `401` · `403` · `500`.

---

### 13.3 `POST /api/users`

Create a user with any role (admin provisioning).

**Auth:** Bearer / cookie — **admin only**
**Body:** `name`, `email`, `password` (required); `role`, `departmentId`, `phone` (optional)

**Response `201`**

```json
{
  "success": true,
  "user": { "id": "...", "name": "...", "email": "...", "role": "maintenance_staff", "departmentId": "..." }
}
```

**Errors:** `400` missing fields · `401` · `403` · `409` email exists · `500`.
Writes `USER_CREATED` to `audit_logs`.

---

### 13.4 `PATCH /api/users/:id`

Update a user's role, department, name, or phone.

**Auth:** Bearer / cookie — **admin only**
**Body:** `role`, `departmentId`, `name`, `phone` (all optional)

**Response `200`**

```json
{ "success": true, "user": { "id": "...", "name": "...", "email": "...", "role": "...", "departmentId": "..." } }
```

**Errors:** `401` · `403` · `404` · `500`.
Writes `USER_ROLE_OR_DEPT_MODIFIED` with previous/new values.

---

### 13.5 `DELETE /api/users/:id`

Delete a user. Administrators cannot delete their own account.

**Auth:** Bearer / cookie — **admin only**

**Response `200`**

```json
{ "success": true, "message": "User deleted successfully" }
```

**Errors:** `400` self-deletion · `401` · `403` · `404` · `500`.
Writes `USER_DELETED` to `audit_logs`.

---

## 14. Saved View Endpoints

Base path: `/api/saved-views`

### 14.1 `GET /api/saved-views`

List the authenticated user's saved explorer views.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "views": [
    {
      "id": "e0000000-0000-0000-0000-000000000001",
      "userId": "10000000-0000-0000-0000-000000000002",
      "name": "Critical Roads",
      "filtersJson": "{\"category\":\"road_damage\",\"priority\":\"critical\"}",
      "sortJson": "{\"field\":\"createdAt\",\"order\":\"desc\"}",
      "columnsJson": null,
      "isShared": false,
      "createdAt": "2026-11-28T09:30:00.000Z"
    }
  ]
}
```

**Errors:** `401` · `500`.

---

### 14.2 `POST /api/saved-views`

Create a saved view.

**Auth:** Bearer / cookie
**Body:** `name` and `filtersJson` (required); `sortJson`, `columnsJson`, `isShared` (optional)

**Response `201`**

```json
{ "success": true, "view": { "id": "...", "name": "...", "filtersJson": "...", "...": "..." } }
```

**Errors:** `400` missing name/filters · `401` · `500`.

---

## 15. Settings Endpoints

Base path: `/api/settings`

> **Implementation note:** settings are stored in an in-memory object on the server and reset on
> restart. They are not persisted to PostgreSQL.

### 15.1 `GET /api/settings`

Fetch current system configuration.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "success": true,
  "settings": {
    "cityCorporationName": "Dhaka North City Corporation (DNCC)",
    "platformVersion": "Signal City 1.0.0",
    "duplicateRadarRadiusMeters": 50,
    "emergencyEscalationHours": 4,
    "autoAssignPriorityIssues": true,
    "emailNotificationsEnabled": true,
    "smsAlertsEnabled": true,
    "slaTargetsHours": { "critical": 12, "high": 24, "medium": 48, "low": 96 },
    "workingHours": { "start": "08:00", "end": "18:00", "timezone": "Asia/Dhaka" }
  }
}
```

**Errors:** `401` · `500`.

---

### 15.2 `PATCH /api/settings`

Update system configuration (shallow merge; `slaTargetsHours` and `workingHours` merge deeply).

**Auth:** Bearer / cookie — **admin only**
**Body:** any subset of the settings object above

**Response `200`**

```json
{
  "success": true,
  "message": "System configuration updated successfully",
  "settings": { "...": "..." }
}
```

**Errors:** `401` · `403` · `500`.
Writes `SYSTEM_SETTINGS_UPDATED` to `audit_logs`.

---

## 16. Notification Endpoints

Base path: `/api/notifications`

### 16.1 `GET /api/notifications`

Role-scoped notification feed. Merges persisted notifications with recent issue activities,
sorted newest-first, capped at 15 items.

**Auth:** Bearer / cookie

**Response `200`**

```json
{
  "items": [
    {
      "id": "act-a0000000-0000-0000-0000-000000000003",
      "title": "Status Updated: Resolved",
      "description": "Hazardous pothole expanding near traffic signal #1 — Maintenance completed and proof photograph uploaded.",
      "type": "success",
      "link": "/issues/a0000000-0000-0000-0000-000000000001",
      "read": false,
      "createdAt": "2026-11-02T09:00:00.000Z",
      "source": "activity"
    },
    {
      "id": "c0000000-0000-0000-0000-000000000010",
      "title": "New Issue Submitted",
      "description": "Your report was received.",
      "type": "info",
      "link": "/citizen/reports",
      "read": true,
      "createdAt": "2026-11-01T08:00:00.000Z",
      "source": "db"
    }
  ]
}
```

**Scoping**

| Role | Feed scope |
|---|---|
| `citizen` | Own reported issues. |
| `maintenance_staff` | Issues assigned to them. |
| `department_manager` | Own department's issues. |
| `admin` | All issues. |

**Errors:** `401` · `500`.

---

### 16.2 `PATCH /api/notifications/read-all`

Mark all persisted notifications for the current user as read.

**Auth:** Bearer / cookie

**Response `200`**

```json
{ "success": true }
```

**Errors:** `401` · `500`.

---

### 16.3 `PATCH /api/notifications/:id/read`

Mark one persisted notification as read. IDs beginning with `act-` (live activity items) are
acknowledged without a database write.

**Auth:** Bearer / cookie

**Response `200`**

```json
{ "success": true }
```

**Errors:** `401` · `500`.

---

## 17. Error Reference

### 17.1 Common error messages

| Status | Message | Cause |
|---|---|---|
| `400` | `Email is required` | Missing required auth field. |
| `400` | `Rating must be between 1 and 5` | Feedback rating out of range. |
| `400` | `Invalid status transition from X to Y` | Lifecycle rule violation. |
| `400` | `Issue has already entered triage and cannot be edited by citizen` | Citizen edit after triage. |
| `400` | `Security constraint: Cannot delete your own administrative account` | Admin self-deletion. |
| `401` | `Unauthorized: Authentication required` | No token/cookie provided. |
| `401` | `Unauthorized: Invalid or expired token` | Bad JWT. |
| `401` | `Invalid password. Please check your credentials.` | Wrong password. |
| `401` | `Invalid verification code. Please check your email.` | Wrong OTP. |
| `403` | `Forbidden: Insufficient permissions` | Role guard rejection. |
| `403` | `Forbidden: Citizens cannot modify issue status` | Citizen status change. |
| `403` | `Forbidden: Maintenance staff can only update tasks assigned to them` | Staff ownership violation. |
| `403` | `Forbidden: Department managers can only manage issues within their own department` | Cross-department action. |
| `404` | `Issue not found` | Unknown issue id. |
| `404` | `Task not found` | Unknown task id. |
| `404` | `User not found` | Unknown user id. |
| `409` | `Email already registered` | Duplicate registration. |
| `429` | `Too many authentication attempts from this IP...` | Auth rate limit. |
| `429` | `API rate limit exceeded. Please throttle your requests.` | API rate limit. |
| `500` | `Internal server error` | Unhandled server exception. |

### 17.2 Debugging checklist

1. Confirm the backend is running on port `5000`.
2. Confirm `DATABASE_URL` points to a reachable PostgreSQL/Neon instance.
3. Confirm the token is not expired (7-day JWT lifetime).
4. Check `X-RateLimit-Remaining`; back off on `429`.
5. For `403`, verify the persona's role and `departmentId` match the action.
6. For `400` status transitions, compare against the allowed transition table.

---

**Related documents**

- [Database Design](./DATABASE_DESIGN.md)
- [Project README](../README.md)
