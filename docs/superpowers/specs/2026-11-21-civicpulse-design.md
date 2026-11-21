# CivicPulse — Enterprise Smart City Infrastructure Management Platform
## Design Specification Document

**Date:** 2026-11-21  
**Project Category:** GovTech / Data-Intensive Enterprise Web Platform  
**Architecture:** Next.js (App Router) + TypeScript + Drizzle ORM + PostgreSQL + Redux Toolkit & RTK Query + Tailwind CSS + Leaflet + Recharts  

---

## 1. Intent & The Why

Modern municipal governance relies heavily on timely identification and resolution of infrastructure failures (e.g., potholes, blown streetlights, clogged drainage networks, broken footpaths, and overflowing waste bins). Today, municipalities often suffer from siloed systems where citizens lack transparency into issue resolution, field crews lack centralized digital dispatch, and city administrators lack geospatial insights and performance analytics.

**CivicPulse** is an enterprise-grade Smart City Infrastructure Management Platform that bridges citizens, municipal departments, maintenance crews, and executive leadership into a unified, transparent, and auditable operational loop.

---

## 2. Goals, Non-Goals & Anti-Goals

### 2.1 Goals
- **Full Operational Lifecycle:** End-to-end state transitions (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`) with immutable audit trails (`IssueActivity`).
- **Strict Role-Based Access Control (RBAC):** Dedicated views and server-enforced permissions for 4 distinct user roles:
  - **Citizen:** Submit issues with GPS and photos, track status, view resolution history, submit post-resolution ratings/feedback.
  - **Department Manager:** Review incoming department issues, assign priority and maintenance staff, detect duplicates, track crew workloads.
  - **Maintenance Staff:** Inspect assigned work orders, view GPS location on map, update task status, submit completion photos and field notes.
  - **Admin:** City-wide governance, department lifecycle management, user assignment, global configuration, and executive KPI analytics.
- **Enterprise-Grade Data Architecture:**
  - High-performance data layer powered by **PostgreSQL** and **Drizzle ORM** with indexes on high-frequency query paths.
  - Centralized state management via **Redux Toolkit** and **RTK Query** with automatic query caching, request deduplication, cache invalidation tags, and URL search param synchronization.
- **Geospatial & Map Visualization:**
  - Interactive map (Leaflet / OpenStreetMap) with category-based markers, GPS capture, reverse geocoding, radius-based duplicate detection, and density clusters.
- **Analytics & BI Dashboard:**
  - Server-aggregated metrics visualized with Recharts: resolution times, monthly trends, category breakdown, department performance ranking, and citizen satisfaction.
- **Pre-seeded Enterprise Scale:**
  - Database seeding generating 4 user roles, 5 realistic municipal departments, 20+ maintenance staff, 30+ geographic city locations, and 100+ diverse issues with activity logs.

### 2.2 Non-Goals
- Hardware IoT telemetry sensor ingestion (the platform focuses on human-in-the-loop municipal issue tracking).
- Multi-tenancy across multiple independent sovereign cities (operates as a unified single-city platform with multi-department tenancy).
- Mobile native application compilation (PWA / responsive web-first architecture).

### 2.3 Anti-Goals
- **No Client-Side Dataset Dumps:** The frontend will never fetch or store the entire dataset in memory to perform filtering, pagination, or analytics. All search, filtering, sorting, and aggregation must execute on the PostgreSQL database server.
- **No Mutable History:** Status transitions and assignments must never overwrite past history; every action creates an auditable log entry.
- **No Unprotected Routes or APIs:** Client-side route hides are insufficient; every API mutation must verify session authenticity and role privileges.

---

## 3. Constraints

- **Language & Runtime:** TypeScript (strict mode), Node.js v20+.
- **Framework:** Next.js (App Router, Server Components + Route Handlers + Client Components where stateful).
- **Database:** PostgreSQL (compatible with local instance, Supabase, Neon, or Railway connection strings).
- **ORM:** Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres` driver).
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) with RTK Query as the data-fetching and server-cache layer.
- **Styling:** Tailwind CSS with modern UI component primitives (dialogs, dropdowns, tabs, toast notifications, badges, skeletons).
- **Map:** Leaflet / `react-leaflet` with OpenStreetMap tile provider (no paid API key required).
- **Charts:** `recharts` for responsive charts.

---

## 4. Architectural Approaches & Selection

### 4.1 Approaches Evaluated
1. **Prisma ORM + NextAuth + Standard React Context:** Common Next.js setup, but lacks enterprise query-level state caching, request deduplication, and low-level SQL optimization.
2. **Drizzle ORM + Redux Toolkit & RTK Query + NextAuth / Secure JWT Session (Selected):**
   - **Why Selected:** Combines Drizzle's ultra-fast, zero-overhead relational SQL generation and fine-grained indexing with RTK Query's enterprise server-state caching, tag invalidation (`providesTags` / `invalidatesTags`), and normalized client store. It directly fulfills both CivicPulse's GovTech requirements and DataScope's enterprise data-intensive architectural standards.
3. **Full BaaS (Supabase client-only):** Rejected due to external cloud lock-in and inability to run standalone or manage custom full-stack Redux pipelines cleanly.

---

## 5. System Architecture & Component Design

```
+--------------------------------------------------------------------------+
|                            Browser / Client                              |
|  Next.js App Router Pages (Citizen, Manager, Staff, Admin, Explorer)      |
|                                                                          |
|  +----------------------------+   +------------------------------------+ |
|  |     Redux Toolkit Store    |   |         React Components           | |
|  | - Auth Slice               |   | - Data Explorer & Filter Builder   | |
|  | - UI & Filter Slice        |   | - Leaflet Map & Category Markers   | |
|  | - Saved Views Slice        |   | - Recharts Analytics Dashboards    | |
|  | - RTK Query API Services   |<--+ - Work Order & Photo Upload Dialogs| |
|  +----------------------------+   +------------------------------------+ |
+--------------------------------------------------------------------------+
                                    | HTTP / JSON (REST APIs)
                                    v
+--------------------------------------------------------------------------+
|                       Next.js App Router Server                          |
|  Route Handlers (/api/auth, /api/issues, /api/departments, /api/analytics)|
|                                                                          |
|  - Auth Middleware & Role Guard (`requireAuth`, `requireRole`)           |
|  - Zod Request Validators (Search params, Geo coords, Mutation bodies)   |
|  - Image Handler (Data URI / Local Storage)                              |
+--------------------------------------------------------------------------+
                                    | Drizzle ORM Queries
                                    v
+--------------------------------------------------------------------------+
|                           PostgreSQL Database                            |
|  - Tables: users, departments, issues, issue_activities, tasks, feedback |
|  - Indexes: B-tree on status, department, category, reporter, timestamps |
|  - Full-Text & Trigram Search: pg_trgm / tsvector on title & description |
+--------------------------------------------------------------------------+
```

---

## 6. Database Schema Design (Drizzle ORM)

### 6.1 Core Tables & Relations

1. **`users`**
   - `id`: UUID (Primary Key)
   - `name`: VARCHAR(255)
   - `email`: VARCHAR(255) UNIQUE NOT NULL
   - `password_hash`: VARCHAR(255) NOT NULL
   - `role`: ENUM ('admin', 'department_manager', 'maintenance_staff', 'citizen')
   - `department_id`: UUID (Nullable, foreign key to `departments.id`)
   - `phone`: VARCHAR(50)
   - `avatar_url`: TEXT
   - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

2. **`departments`**
   - `id`: UUID (Primary Key)
   - `name`: VARCHAR(255) UNIQUE NOT NULL (e.g., "Roads & Highways", "Electrical & Lighting", "Water Supply & Drainage", "Solid Waste Management", "Public Infrastructure & Parks")
   - `code`: VARCHAR(50) UNIQUE NOT NULL (e.g., "DEPT-ROAD", "DEPT-ELEC")
   - `description`: TEXT
   - `manager_id`: UUID (Nullable, foreign key to `users.id`)
   - `is_active`: BOOLEAN DEFAULT TRUE
   - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

3. **`issues`**
   - `id`: UUID (Primary Key)
   - `title`: VARCHAR(255) NOT NULL
   - `description`: TEXT NOT NULL
   - `category`: ENUM ('road_damage', 'streetlight', 'drainage', 'footpath', 'waste_management', 'public_infrastructure') NOT NULL
   - `status`: ENUM ('submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed') NOT NULL DEFAULT 'submitted'
   - `priority`: ENUM ('low', 'medium', 'high', 'critical') DEFAULT 'medium'
   - `latitude`: DOUBLE PRECISION NOT NULL
   - `longitude`: DOUBLE PRECISION NOT NULL
   - `address`: TEXT NOT NULL
   - `image_url`: TEXT
   - `reporter_id`: UUID (Foreign key to `users.id` NOT NULL)
   - `department_id`: UUID (Nullable, foreign key to `departments.id`)
   - `assigned_staff_id`: UUID (Nullable, foreign key to `users.id`)
   - `duplicate_of_id`: UUID (Nullable, foreign key to `issues.id`)
   - `feedback_rating`: INTEGER (Nullable, 1 to 5)
   - `feedback_comment`: TEXT (Nullable)
   - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - `updated_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - `resolved_at`: TIMESTAMP WITH TIME ZONE (Nullable)

4. **`issue_activities`** (Audit Trail)
   - `id`: UUID (Primary Key)
   - `issue_id`: UUID (Foreign key to `issues.id` CASCADE)
   - `user_id`: UUID (Foreign key to `users.id` NOT NULL)
   - `action`: VARCHAR(100) NOT NULL (e.g., 'STATUS_CHANGE', 'ASSIGNED', 'COMMENT_ADDED', 'DUPLICATE_FLAGGED')
   - `previous_status`: VARCHAR(50)
   - `new_status`: VARCHAR(50)
   - `notes`: TEXT
   - `attachment_url`: TEXT
   - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

5. **`maintenance_tasks`**
   - `id`: UUID (Primary Key)
   - `issue_id`: UUID (Foreign key to `issues.id` CASCADE)
   - `staff_id`: UUID (Foreign key to `users.id` NOT NULL)
   - `status`: ENUM ('pending', 'in_progress', 'completed') DEFAULT 'pending'
   - `field_notes`: TEXT
   - `proof_image_url`: TEXT
   - `assigned_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   - `started_at`: TIMESTAMP WITH TIME ZONE
   - `completed_at`: TIMESTAMP WITH TIME ZONE

6. **`saved_views` & `search_history`** (DataScope enterprise features)
   - `saved_views`: `(id, user_id, name, filters_json, sort_json, columns_json, is_shared, created_at)`
   - `search_history`: `(id, user_id, query_text, filters_json, executed_at)`

7. **`notifications`**
   - `id`: UUID (Primary Key)
   - `user_id`: UUID (Foreign key to `users.id` CASCADE)
   - `title`: VARCHAR(255) NOT NULL
   - `message`: TEXT NOT NULL
   - `type`: VARCHAR(50) NOT NULL
   - `link`: TEXT
   - `is_read`: BOOLEAN DEFAULT FALSE
   - `created_at`: TIMESTAMP WITH TIME ZONE DEFAULT NOW()

### 6.2 Indexing & Geospatial Strategy
- `CREATE INDEX idx_issues_dept_status ON issues (department_id, status);`
- `CREATE INDEX idx_issues_reporter ON issues (reporter_id, created_at DESC);`
- `CREATE INDEX idx_issues_category_priority ON issues (category, priority);`
- `CREATE INDEX idx_issues_coords ON issues (latitude, longitude);`
- `CREATE INDEX idx_issue_activities_issue ON issue_activities (issue_id, created_at ASC);`
- `CREATE INDEX idx_maintenance_tasks_staff ON maintenance_tasks (staff_id, status);`
- **Geospatial Math (PostGIS-free portability):** Radius duplicate detection (50m) and spatial density clusters are executed using standard Haversine SQL formulas and bounding-box bounding prefilters over `(latitude, longitude)`. This ensures seamless compatibility with standard PostgreSQL (Neon, Supabase, local, Docker) without external extension dependencies.

---

## 7. State Machine, SLA & Workflow Rules

### 7.1 Issue Lifecycle State Machine
- **Submission:** Created with status `submitted`. Automatically mapped to the responsible department based on category:
  - `road_damage` → Roads & Highways (`DEPT-ROAD`)
  - `streetlight` → Electrical & Street Lighting (`DEPT-ELEC`)
  - `drainage` → Water Supply & Sewage (`DEPT-WATER`)
  - `waste_management` → Solid Waste Management (`DEPT-WASTE`)
  - `footpath` & `public_infrastructure` → Public Infrastructure & Parks (`DEPT-INFRA`)
  - Department Managers and Admins retain full authority to reassign departments during triage.
- **Triage & Review:** Department Manager verifies the report, sets priority (`low`, `medium`, `high`, `critical`), and updates status to `under_review`.
- **Assignment:** Manager assigns to a specific maintenance staff member (`assigned`). A corresponding `maintenance_tasks` record is generated.
- **Field Execution:** Staff marks task `in_progress` upon arriving at location and adding initial notes.
- **Resolution:** Staff uploads completion proof photograph and marks task `completed`. The parent issue transitions to `resolved`, setting `resolved_at = NOW()`.
- **Closure:**
  - When citizen submits feedback rating and comments, status transitions to `closed`.
  - Alternatively, if marked as duplicate (`duplicate_of_id`) or rejected during triage (with activity log note), it transitions directly to `closed`.

### 7.2 SLA & Performance Calculation
- System SLAs are defined by priority:
  - **Critical:** 24 hours
  - **High:** 48 hours
  - **Medium:** 96 hours (4 days)
  - **Low:** 168 hours (7 days)
- SLA Compliance Rate: `(Count of issues resolved within target SLA / Total resolved issues) * 100%`, computed server-side via SQL date-diff aggregations (`resolved_at - created_at`).

### 7.3 Data Explorer & Bulk Operations
- Accessible to Admins and Department Managers (Managers defaulted to their department's data with city-wide view toggle).
- Supports batch operations on `selectedIssueIds`:
  - Bulk CSV Export
  - Bulk Department Reassignment
  - Bulk Priority Update

---

## 8. State Management & Data Fetching Architecture

### 8.1 Redux Store Hierarchy
```typescript
interface RootState {
  auth: {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
  };
  ui: {
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'system';
    activeModal: string | null;
  };
  explorer: {
    activeFilters: IssueFilterState;
    selectedIssueIds: string[];
    visibleColumns: string[];
    viewMode: 'table' | 'map' | 'split';
  };
  [api.reducerPath]: ReturnType<typeof api.reducer>; // RTK Query Cache
}
```

### 8.2 RTK Query API Service (`apiSlice`)
Endpoints with dedicated tag types for granular cache invalidation:
- **`getIssues`**: `providesTags: (result) => result ? [...result.items.map(i => ({ type: 'Issues', id: i.id })), { type: 'Issues', id: 'LIST' }] : [{ type: 'Issues', id: 'LIST' }]`
- **`getIssueDetails`**: `providesTags: (result, error, id) => [{ type: 'Issues', id }]`
- **`updateIssueStatus`**: `invalidatesTags: (result, error, { id }) => [{ type: 'Issues', id }, { type: 'Issues', id: 'LIST' }, 'Analytics']`
- **`assignTask`**: `invalidatesTags: ['Issues', 'Tasks', 'Analytics']`
- **`getDepartments`**: `providesTags: ['Departments']`
- **`getAnalytics`**: `providesTags: ['Analytics']`
- **`getStaffTasks`**: `providesTags: ['Tasks']`

### 8.3 URL-State Synchronization
Search queries (`q`), category (`category`), status (`status`), priority (`priority`), page (`page`), and sort (`sort`, `order`) are bidirectionally synced with browser query params using a custom `useSyncedFilters` hook.

---

## 9. Role-Based Workflows & User Interfaces

### 9.1 Citizen Portal
- **Dashboard:** Recent submissions summary, resolution status timeline, quick "Report Issue" action button.
- **Create Issue Flow:**
  - Form validation with Zod.
  - Interactive map click to pin location + browser HTML5 GPS detection.
  - Image upload with live thumbnail preview.
  - Real-time nearby duplicate detector: warns citizen if an issue exists within a 50-meter radius in the same category.
- **My Reports & Detail Page:** Real-time timeline of issue progress, assigned department badge, maintenance proof photo display, and 5-star rating with review comment once marked `Resolved`.

### 9.2 Department Manager Portal
- **Department Issue Inbox:** Filtered automatically to the manager's department.
- **Verification & Triage Modal:**
  - Update status (`Submitted` → `Under Review`).
  - Assign priority (`Low`, `Medium`, `High`, `Critical`).
  - Mark duplicate of existing issue ID.
  - Assign to department maintenance staff member (loads staff workloads in real-time).
- **Team Workload Overview:** View staff member active tasks vs. completed tasks.

### 9.3 Maintenance Staff Portal
- **Work Orders List:** Mobile-friendly cards showing urgent tasks, target address, GPS coordinates with "Open in Maps" trigger.
- **Action Drawer / Dialog:**
  - Mark task "Started" (`In Progress`).
  - Add field progress notes.
  - Upload repair completion photograph.
  - Mark task "Resolved" (triggers automatic notification to citizen).

### 9.4 Admin Governance & Analytics Portal
- **Executive BI Dashboard:**
  - Total reported, pending, in-progress, resolved, and closed counts.
  - Average resolution time (hours/days) aggregated by department.
  - 12-month historical reporting vs. resolution trends (Area/Bar Chart).
  - Issue category distribution (Donut / Pie Chart).
  - Department performance ranking scorecard (SLA compliance rate).
- **User & Department Management:**
  - Create/edit departments, activate/deactivate.
  - Assign department managers.
  - Manage users, roles, and department affiliations.

---

## 10. Seed Data Specifications (Mandatory Data Requirements)

The seed script (`src/db/seed.ts`) will insert:
1. **4 Primary Demo Users:**
   - Admin: `admin@civicpulse.gov` (Password: `admin123`)
   - Department Manager: `manager.roads@civicpulse.gov` (Password: `manager123`)
   - Maintenance Staff: `staff.electric@civicpulse.gov` (Password: `staff123`)
   - Citizen: `citizen.jane@civicpulse.gov` (Password: `citizen123`)
2. **5 Core Departments:**
   - Roads & Highways (`DEPT-ROAD`)
   - Electrical & Street Lighting (`DEPT-ELEC`)
   - Water Supply & Sewage (`DEPT-WATER`)
   - Solid Waste Management (`DEPT-WASTE`)
   - Public Infrastructure & Parks (`DEPT-INFRA`)
3. **20+ Maintenance Crew Members:** Distributed across the 5 departments with realistic skill profiles.
4. **30+ Realistic GPS Coordinates:** Realistic urban coordinate clusters (e.g. Dhaka or metropolitan grid) with real street names and landmarks.
5. **100+ Detailed Issues:**
   - Spanning all 6 categories and all 4 priorities.
   - Varied status distribution (`submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `closed`).
   - Attached audit activity logs for each issue.
   - High-quality SVG/curated image attachments for reported problems and resolution proofs.

---

## 11. Technical Decisions & Documentation Rationale

| Decision | Selected Choice | Rejected Alternatives | Primary Justification |
| :--- | :--- | :--- | :--- |
| **ORM** | Drizzle ORM | Prisma, TypeORM | Near-zero runtime overhead, pure SQL-like relational schema definition, rapid query compilation, and direct composite indexing. |
| **Global State** | Redux Toolkit | Zustand, Context API | Fulfills enterprise state architecture; provides RTK Query with tag-based cache invalidation, request deduplication, and normalized store. |
| **Database** | PostgreSQL | MySQL, MongoDB | Native support for composite B-tree indexes, spatial coordinate querying, trigram full-text search, and relational consistency for audit trails. |
| **Pagination** | Server-Side Offset & Limit | Client-side slicing | Prevents memory saturation on the client and maintains lightning-fast response times on datasets with thousands or millions of records. |
| **Map Rendering** | Leaflet / React-Leaflet | Mapbox GL | Open-source, lightweight, no external vendor billing or token expiration, full custom HTML/SVG pin markers support. |
| **Search Strategy** | PostgreSQL Trigram / ILIKE + Debounce | Client-side regex, ElasticSearch | Zero additional infrastructure overhead while providing sub-50ms search response times across titles, descriptions, and addresses. |
| **Audit Strategy** | Dedicated `issue_activities` log | JSON column on issue | Guarantees relational referential integrity, historical preservation, timestamp ordering, and prevents accidental audit tampering. |

---

## 12. What is Left to the Builder

- Exact color palette, component design tokens, and CSS animations.
- Specific mock asset URLs / SVG illustrations for sample issues.
- Responsive breakpoint nuances (drawer vs dialog for mobile work orders).
- Seed data helper generation algorithm.
