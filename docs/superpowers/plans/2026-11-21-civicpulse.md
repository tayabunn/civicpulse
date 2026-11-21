# CivicPulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build CivicPulse, an enterprise-grade Smart City Infrastructure Management Platform connecting citizens, department managers, maintenance staff, and city administrators with geospatial tracking, full-lifecycle issue workflows, and Recharts analytics.

**Architecture:** Next.js (App Router) + TypeScript modular architecture with Drizzle ORM over PostgreSQL, Redux Toolkit + RTK Query for normalized client caching and server state, Leaflet for interactive maps, and role-based access control.

**Tech Stack:** Next.js 14/15, TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL (`postgres` / `pg`), Redux Toolkit, RTK Query, Leaflet / React-Leaflet, Recharts, Lucide React, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-21-civicpulse-design.md`

## Global Constraints

- Language & Runtime: TypeScript strict mode, Node.js v20+.
- Framework: Next.js App Router with Server Components and Route Handlers.
- Database: PostgreSQL with Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres` client).
- State Management: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) with RTK Query as the server-state caching and data-fetching layer.
- Map: Leaflet / `react-leaflet` with OpenStreetMap tile provider (no paid API key required).
- Charts: `recharts` for responsive charts.
- No client-side dataset dumps: all searching, filtering, sorting, pagination, and analytics must execute on the PostgreSQL server.
- Preserved audit history: all issue status transitions must append immutable records to `issue_activities`.

## Review Focus

1. **Unauthenticated / Unauthorized Mutation Attempts:** Requests to mutate status, assign staff, or submit feedback with missing or invalid role tokens must return 401 Unauthorized or 403 Forbidden without modifying database state.
2. **Invalid GPS Coordinates:** Latitude outside [-90, 90] or Longitude outside [-180, 180] in issue submission must be rejected with 400 Bad Request before database insertion.
3. **Circular or Invalid Duplicate References:** An issue cannot be marked as a duplicate of itself, nor can an issue link to a non-existent `duplicate_of_id`.
4. **Duplicate Issue Status Transitions:** Transitioning an issue to a status that violates the lifecycle machine (e.g. from `Submitted` directly to `Closed` without triage/review) must be rejected with 400 Bad Request unless marked as duplicate/rejected.
5. **Staff Task Collision:** Assigning an issue to a staff member belonging to a different department must be rejected with 400 Bad Request.

---

## File & Module Structure

```
civicpulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── issues/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── status/route.ts
│   │   │   │       └── feedback/route.ts
│   │   │   ├── departments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── analytics/
│   │   │   │   └── route.ts
│   │   │   └── saved-views/
│   │   │       └── route.ts
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── citizen/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   ├── reports/page.tsx
│   │   │   │   └── issues/[id]/page.tsx
│   │   │   ├── manager/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── issues/page.tsx
│   │   │   │   └── team/page.tsx
│   │   │   ├── staff/
│   │   │   │   ├── page.tsx
│   │   │   │   └── tasks/[id]/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── departments/page.tsx
│   │   │   │   └── users/page.tsx
│   │   │   └── explorer/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx, badge.tsx, card.tsx, dialog.tsx,
│   │   │   ├── input.tsx, select.tsx, skeleton.tsx, toast.tsx
│   │   ├── layout/
│   │   │   ├── sidebar.tsx, header.tsx, theme-toggle.tsx
│   │   ├── map/
│   │   │   ├── issue-map.tsx, location-picker.tsx, marker-icons.ts
│   │   ├── table/
│   │   │   ├── data-table.tsx, table-pagination.tsx, column-toggle.tsx
│   │   └── analytics/
│   │       ├── stat-card.tsx, trend-chart.tsx, category-chart.tsx,
│   │       └── sla-scorecard.tsx
│   ├── db/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── lib/
│   │   ├── auth.ts, session.ts, geo.ts, validation.ts, utils.ts
│   ├── store/
│   │   ├── index.ts, provider.tsx, apiSlice.ts,
│   │   ├── authSlice.ts, uiSlice.ts, explorerSlice.ts
│   └── types/
│       └── index.ts
├── drizzle.config.ts
├── tailwind.config.js
└── package.json
```

---

### Task 1: Next.js Project Scaffolding & Core Configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `.env.example`, `.env.local`
- Create: `vitest.config.ts`
- Create: `tests/sanity.test.ts`

**Interfaces:**
- Produces: Working Next.js project with Tailwind CSS, TypeScript, Vitest test runner.

- [ ] **Step 1: Write sanity test for testing framework**
```typescript
// tests/sanity.test.ts
import { describe, it, expect } from 'vitest';

describe('Sanity Check', () => {
  it('should verify test runner executes properly', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 2: Initialize Next.js package.json and dependencies**
Install dependencies:
- Core: `next`, `react`, `react-dom`
- UI: `lucide-react`, `clsx`, `tailwind-merge`
- DB: `drizzle-orm`, `postgres`
- State: `@reduxjs/toolkit`, `react-redux`
- Maps & Charts: `leaflet`, `react-leaflet`, `@types/leaflet`, `recharts`
- Validation & Auth: `zod`, `jose`, `bcryptjs`, `@types/bcryptjs`
- Dev/Test: `drizzle-kit`, `vitest`, `typescript`, `@types/node`, `@types/react`, `tailwindcss`, `postcss`, `autoprefixer`

- [ ] **Step 3: Run sanity test**
Run: `npx vitest run tests/sanity.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add package.json tsconfig.json vitest.config.ts tailwind.config.ts tests/
git commit -m "chore: scaffold Next.js app with TypeScript, Tailwind, and Vitest"
```

---

### Task 2: Database Layer with Drizzle ORM & PostgreSQL Models

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `src/lib/geo.ts`
- Create: `drizzle.config.ts`
- Test: `tests/db-schema.test.ts`

**Interfaces:**
- Produces:
  - `schema.ts`: `users`, `departments`, `issues`, `issueActivities`, `maintenanceTasks`, `savedViews`, `searchHistory`, `notifications` tables and relations.
  - `src/lib/geo.ts`: `calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number`, `isWithinRadius(lat1, lon1, lat2, lon2, radiusMeters): boolean`
  - `src/db/index.ts`: `db` instance exported.

- [ ] **Step 1: Write test for schema definitions and geospatial math**
```typescript
// tests/db-schema.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDistanceMeters, isWithinRadius } from '../src/lib/geo';
import { users, departments, issues, issueActivities } from '../src/db/schema';

describe('Geospatial Math', () => {
  it('calculates distance between two Dhaka coordinates accurately', () => {
    const lat1 = 23.8103, lon1 = 90.4125; // Dhanmondi / central
    const lat2 = 23.8104, lon2 = 90.4126; // ~15 meters away
    const distance = calculateDistanceMeters(lat1, lon1, lat2, lon2);
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(30);
    expect(isWithinRadius(lat1, lon1, lat2, lon2, 50)).toBe(true);
    expect(isWithinRadius(lat1, lon1, 23.8200, 90.4200, 50)).toBe(false);
  });

  it('exports required Drizzle tables', () => {
    expect(users).toBeDefined();
    expect(departments).toBeDefined();
    expect(issues).toBeDefined();
    expect(issueActivities).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/db-schema.test.ts`
Expected: FAIL ("Cannot find module '../src/lib/geo'")

- [ ] **Step 3: Implement `src/lib/geo.ts` and `src/db/schema.ts`**
- `src/lib/geo.ts`: Implement Haversine formula for distance in meters.
- `src/db/schema.ts`: Define pgTable definitions with enums (`userRoleEnum`, `issueCategoryEnum`, `issueStatusEnum`, `issuePriorityEnum`, `taskStatusEnum`), UUID primary keys, foreign keys, and indexes.
- `src/db/index.ts`: Initialize `postgres` connection and Drizzle client.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/db-schema.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/db/ src/lib/geo.ts tests/db-schema.test.ts drizzle.config.ts
git commit -m "feat: implement Drizzle ORM schema, indexes, and geospatial math"
```

---

### Task 3: Database Seeder Script (Enterprise Scale & Demo Credentials)

**Files:**
- Create: `src/db/seed.ts`
- Create: `src/db/mock-data.ts`
- Test: `tests/mock-data.test.ts`

**Interfaces:**
- Produces:
  - `src/db/mock-data.ts`: Generators for 4 demo users, 5 departments, 20+ maintenance staff, 30+ GPS coordinates, and 100+ issues with historical activities.
  - `src/db/seed.ts`: Executable runner to populate PostgreSQL.

- [ ] **Step 1: Write test for mock data generator completeness**
```typescript
// tests/mock-data.test.ts
import { describe, it, expect } from 'vitest';
import { generateSeedData } from '../src/db/mock-data';

describe('Seed Data Generator', () => {
  it('generates the mandatory minimum volume of entities', () => {
    const data = generateSeedData();
    expect(data.users.length).toBeGreaterThanOrEqual(24); // 4 demo + 20 staff
    expect(data.departments.length).toBeGreaterThanOrEqual(5);
    expect(data.issues.length).toBeGreaterThanOrEqual(100);
    expect(data.locations.length).toBeGreaterThanOrEqual(30);

    const roles = new Set(data.users.map(u => u.role));
    expect(roles.has('admin')).toBe(true);
    expect(roles.has('department_manager')).toBe(true);
    expect(roles.has('maintenance_staff')).toBe(true);
    expect(roles.has('citizen')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/mock-data.test.ts`
Expected: FAIL ("Cannot find module '../src/db/mock-data'")

- [ ] **Step 3: Implement `src/db/mock-data.ts` and `src/db/seed.ts`**
Generate:
- 4 Primary demo users with hashed passwords (`admin123`, `manager123`, `staff123`, `citizen123`).
- 5 Departments: Roads & Highways, Electrical & Street Lighting, Water Supply & Sewage, Solid Waste Management, Public Infrastructure & Parks.
- 20 Maintenance Staff distributed 4 per department.
- 30 Sample coordinate locations with realistic street addresses.
- 100 Issues distributed across all 6 categories, 4 priorities, and statuses (`submitted`, `under_review`, `assigned`, `in_progress`, `resolved`, `closed`).
- Audit logs for each issue in `issue_activities`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/mock-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/db/mock-data.ts src/db/seed.ts tests/mock-data.test.ts
git commit -m "feat: add enterprise database seed data generator"
```

---

### Task 4: Authentication & Role-Based Authorization Guards

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/session.ts`
- Create: `src/lib/validation.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/auth/logout/route.ts`
- Create: `src/app/api/auth/me/route.ts`
- Test: `tests/auth.test.ts`

**Interfaces:**
- Produces:
  - `hashPassword(password: string): Promise<string>`
  - `verifyPassword(password: string, hash: string): Promise<boolean>`
  - `createSessionToken(payload: SessionUser): Promise<string>`
  - `verifySessionToken(token: string): Promise<SessionUser | null>`
  - `requireRole(req: Request, allowedRoles: UserRole[]): Promise<SessionUser>` (throws/returns 401/403)

- [ ] **Step 1: Write test for password hashing, token creation, and role guards**
```typescript
// tests/auth.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from '../src/lib/auth';

describe('Auth & Session Security', () => {
  it('hashes and verifies passwords accurately', async () => {
    const raw = 'admin123';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword('wrongpassword', hash)).toBe(false);
  });

  it('signs and validates JWT session tokens', async () => {
    const user = { id: 'usr-123', email: 'admin@civicpulse.gov', role: 'admin' as const, name: 'Admin User' };
    const token = await createSessionToken(user);
    const verified = await verifySessionToken(token);
    expect(verified?.id).toBe(user.id);
    expect(verified?.role).toBe('admin');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/auth.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/auth.ts`, `src/lib/session.ts`, and auth route handlers**
- Implement bcrypt hashing and `jose` JWT cookie encoding/decoding.
- Add Zod validation schemas for login and registration (`src/lib/validation.ts`).
- Implement `/api/auth/login`, `/register`, `/logout`, `/me` route handlers.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/auth.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/auth.ts src/lib/session.ts src/lib/validation.ts src/app/api/auth/ tests/auth.test.ts
git commit -m "feat: implement JWT authentication and role verification"
```

---

### Task 5: Redux Toolkit Store & RTK Query API Services

**Files:**
- Create: `src/store/index.ts`
- Create: `src/store/provider.tsx`
- Create: `src/store/authSlice.ts`
- Create: `src/store/uiSlice.ts`
- Create: `src/store/explorerSlice.ts`
- Create: `src/store/apiSlice.ts`
- Test: `tests/redux-store.test.ts`

**Interfaces:**
- Consumes: User and Issue types.
- Produces:
  - `store`: Root Redux store.
  - `apiSlice`: RTK Query endpoints (`useGetIssuesQuery`, `useGetIssueDetailsQuery`, `useUpdateIssueStatusMutation`, `useAssignTaskMutation`, `useGetDepartmentsQuery`, `useGetAnalyticsQuery`, `useGetStaffTasksQuery`).
  - `authSlice`: `setCredentials`, `logout`.
  - `uiSlice`: `toggleSidebar`, `setTheme`.
  - `explorerSlice`: `setFilters`, `setSelectedIssues`, `setVisibleColumns`, `setViewMode`.

- [ ] **Step 1: Write test for Redux slices and initial store state**
```typescript
// tests/redux-store.test.ts
import { describe, it, expect } from 'vitest';
import { store } from '../src/store';
import { setCredentials, logout } from '../src/store/authSlice';
import { toggleSidebar } from '../src/store/uiSlice';
import { setFilters } from '../src/store/explorerSlice';

describe('Redux Toolkit Store', () => {
  it('handles auth state transitions', () => {
    store.dispatch(setCredentials({ user: { id: '1', email: 'test@gov.bd', role: 'citizen', name: 'Citizen' }, token: 'mock-token' }));
    expect(store.getState().auth.isAuthenticated).toBe(true);
    store.dispatch(logout());
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('updates UI preferences and explorer filters', () => {
    const initialSidebar = store.getState().ui.sidebarCollapsed;
    store.dispatch(toggleSidebar());
    expect(store.getState().ui.sidebarCollapsed).toBe(!initialSidebar);

    store.dispatch(setFilters({ category: 'road_damage', status: 'in_progress' }));
    expect(store.getState().explorer.activeFilters.category).toBe('road_damage');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/redux-store.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement Redux store, slices, and RTK Query `apiSlice.ts`**
- Configure `apiSlice` with tag types: `['Issues', 'Departments', 'Tasks', 'Analytics', 'SavedViews']`.
- Set up query endpoints with cache tags and mutation endpoints with invalidations.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/redux-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/store/ tests/redux-store.test.ts
git commit -m "feat: implement Redux Toolkit store and RTK Query services"
```

---

### Task 6: Core Issue API Route Handlers (Server-Side Filtering, Pagination & Audit Trail)

**Files:**
- Create: `src/app/api/issues/route.ts`
- Create: `src/app/api/issues/[id]/route.ts`
- Create: `src/app/api/issues/[id]/status/route.ts`
- Create: `src/app/api/issues/[id]/feedback/route.ts`
- Create: `src/lib/issue-service.ts`
- Test: `tests/issue-service.test.ts`

**Interfaces:**
- Consumes: Drizzle `db`, `schema`, `calculateDistanceMeters`.
- Produces:
  - `listIssues(params: IssueQueryFilters): Promise<{ items: Issue[]; total: number; page: number; totalPages: number }>`
  - `createIssue(data: CreateIssueInput, userId: string): Promise<Issue>`
  - `getIssueById(id: string): Promise<IssueWithDetails | null>`
  - `updateIssueStatus(id: string, newStatus: IssueStatus, userId: string, notes?: string): Promise<Issue>`
  - `submitFeedback(id: string, rating: number, comment: string, userId: string): Promise<Issue>`

- [ ] **Step 1: Write test for issue validation, filtering logic, and state transitions**
```typescript
// tests/issue-service.test.ts
import { describe, it, expect } from 'vitest';
import { issueFilterSchema, createIssueSchema, validateStatusTransition } from '../src/lib/validation';

describe('Issue Business Logic & State Machine', () => {
  it('validates status transitions according to spec workflow', () => {
    expect(validateStatusTransition('submitted', 'under_review')).toBe(true);
    expect(validateStatusTransition('under_review', 'assigned')).toBe(true);
    expect(validateStatusTransition('assigned', 'in_progress')).toBe(true);
    expect(validateStatusTransition('in_progress', 'resolved')).toBe(true);
    expect(validateStatusTransition('resolved', 'closed')).toBe(true);
    // Invalid jump
    expect(validateStatusTransition('submitted', 'resolved')).toBe(false);
  });

  it('validates GPS coordinates within valid ranges', () => {
    const valid = { title: 'Pothole', description: 'Deep hole', category: 'road_damage', latitude: 23.8103, longitude: 90.4125, address: 'Road 27' };
    expect(createIssueSchema.safeParse(valid).success).toBe(true);

    const invalidLat = { ...valid, latitude: 120.0 };
    expect(createIssueSchema.safeParse(invalidLat).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/issue-service.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/issue-service.ts`, route handlers in `/api/issues/`**
- Route handlers enforce server-side offset pagination, composite filters (category, priority, status, department, search query `q` via SQL `ILIKE`), nearby duplicate detection, and create immutable `issue_activities` records on every status change.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/issue-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/app/api/issues/ src/lib/issue-service.ts tests/issue-service.test.ts
git commit -m "feat: implement issue management APIs with server-side filtering and audit logging"
```

---

### Task 7: Department, Task & Analytics API Route Handlers

**Files:**
- Create: `src/app/api/departments/route.ts`
- Create: `src/app/api/departments/[id]/route.ts`
- Create: `src/app/api/tasks/route.ts`
- Create: `src/app/api/tasks/[id]/route.ts`
- Create: `src/app/api/analytics/route.ts`
- Create: `src/lib/analytics-service.ts`
- Test: `tests/analytics-service.test.ts`

**Interfaces:**
- Consumes: Drizzle `db`, `schema`.
- Produces:
  - `getSystemAnalytics(): Promise<AnalyticsData>` (calculates counts, monthly trends, avg resolution times, category distribution, SLA compliance).
  - `/api/tasks`: Staff work order retrieval and updates with completion image and notes.

- [ ] **Step 1: Write test for SLA compliance and analytics calculations**
```typescript
// tests/analytics-service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateSlaCompliance } from '../src/lib/analytics-service';

describe('Analytics Calculations', () => {
  it('calculates SLA compliance rate accurately', () => {
    const issues = [
      { priority: 'critical', hoursTaken: 12 }, // within 24h -> PASS
      { priority: 'critical', hoursTaken: 36 }, // over 24h -> FAIL
      { priority: 'high', hoursTaken: 40 },     // within 48h -> PASS
      { priority: 'low', hoursTaken: 100 },     // within 168h -> PASS
    ];
    const rate = calculateSlaCompliance(issues);
    expect(rate).toBe(75); // 3 out of 4 met SLA = 75%
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/analytics-service.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/analytics-service.ts` and routes `/api/departments`, `/api/tasks`, `/api/analytics`**
- Write SQL aggregations for monthly trend counts, resolution time averages, and SLA metrics.
- Support maintenance staff task completion and field photo updates.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/analytics-service.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/app/api/departments/ src/app/api/tasks/ src/app/api/analytics/ src/lib/analytics-service.ts tests/analytics-service.test.ts
git commit -m "feat: implement department, task, and analytics APIs"
```

---

### Task 8: Design System & Reusable UI Components

**Files:**
- Create: `src/components/ui/button.tsx`, `badge.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `skeleton.tsx`, `toast.tsx`
- Create: `src/components/layout/sidebar.tsx`, `header.tsx`, `theme-toggle.tsx`
- Create: `src/components/table/data-table.tsx`, `table-pagination.tsx`, `column-toggle.tsx`
- Test: `tests/ui-components.test.tsx`

**Interfaces:**
- Produces:
  - Accessible, theme-aware UI component library styled with Tailwind CSS.
  - `DataTable`: Generic reusable table with server-side pagination, sorting, dynamic column visibility, and multi-row selection.

- [ ] **Step 1: Write test for Badge and Button variant helpers**
```typescript
// tests/ui-components.test.tsx
import { describe, it, expect } from 'vitest';
import { getStatusBadgeClass, getPriorityBadgeClass } from '../src/lib/utils';

describe('UI Style Utilities', () => {
  it('returns proper color mappings for issue status and priorities', () => {
    expect(getStatusBadgeClass('submitted')).toContain('blue');
    expect(getStatusBadgeClass('in_progress')).toContain('amber');
    expect(getStatusBadgeClass('resolved')).toContain('emerald');
    expect(getPriorityBadgeClass('critical')).toContain('red');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/ui-components.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement UI primitives, layout components, and DataTable**
- Create responsive layout with collapsible sidebar, navigation links based on user role, dark/light theme toggle, and DataTable component with multi-row checkboxes.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/ui-components.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/ src/lib/utils.ts tests/ui-components.test.tsx
git commit -m "feat: build enterprise design system, layout, and reusable data table"
```

---

### Task 9: Interactive Map & Geospatial Location Components (Leaflet)

**Files:**
- Create: `src/components/map/issue-map.tsx`
- Create: `src/components/map/location-picker.tsx`
- Create: `src/components/map/marker-icons.ts`
- Create: `src/components/map/index.ts`
- Test: `tests/map-icons.test.ts`

**Interfaces:**
- Produces:
  - `IssueMap`: Interactive Leaflet map displaying issue markers color-coded by category, popups with issue previews, and 50m radius circles.
  - `LocationPicker`: Map pin clicker with HTML5 GPS geolocation trigger and reverse-geocoded coordinates.

- [ ] **Step 1: Write test for marker icon category resolver**
```typescript
// tests/map-icons.test.ts
import { describe, it, expect } from 'vitest';
import { getCategoryIconConfig } from '../src/components/map/marker-icons';

describe('Map Marker Icons', () => {
  it('returns appropriate icon config and colors for all 6 categories', () => {
    const categories = ['road_damage', 'streetlight', 'drainage', 'footpath', 'waste_management', 'public_infrastructure'] as const;
    for (const cat of categories) {
      const config = getCategoryIconConfig(cat);
      expect(config.color).toBeDefined();
      expect(config.label).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest run tests/map-icons.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement dynamic Leaflet map components and custom SVG marker icons**
- Use dynamic SSR `next/dynamic` (`ssr: false`) to avoid server-side `window is not defined` errors.
- Include nearby issue duplicate detection circle visualizer.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run tests/map-icons.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/map/ tests/map-icons.test.ts
git commit -m "feat: implement interactive Leaflet map and category marker icons"
```

---

### Task 10: Citizen Portal (Create Issue, My Reports, Issue Details & Feedback)

**Files:**
- Create: `src/app/(dashboard)/citizen/page.tsx`
- Create: `src/app/(dashboard)/citizen/create/page.tsx`
- Create: `src/app/(dashboard)/citizen/reports/page.tsx`
- Create: `src/app/(dashboard)/citizen/issues/[id]/page.tsx`
- Create: `src/components/citizen/duplicate-alert.tsx`
- Create: `src/components/citizen/feedback-modal.tsx`

**Interfaces:**
- Consumes: RTK Query `useGetIssuesQuery`, `useCreateIssueMutation`, `useSubmitFeedbackMutation`.
- Produces: Complete citizen issue lifecycle UI (create with GPS/photo, live duplicate alert, progress tracking, 5-star feedback).

- [ ] **Step 1: Implement Create Issue Page (`/citizen/create`)**
Form with Title, Description, Category, Image upload (file preview), LocationPicker (map pin + browser GPS), and real-time nearby duplicate detection warning if an issue exists within 50 meters.

- [ ] **Step 2: Implement My Reports Page (`/citizen/reports`)**
Table & cards displaying citizen's submitted reports with status filters, category badges, and direct links to details.

- [ ] **Step 3: Implement Citizen Issue Detail Page (`/citizen/issues/[id]`)**
Timeline of status events, assigned department, maintenance completion proof photo display, and post-resolution feedback form modal.

- [ ] **Step 4: Run build check to verify syntax and types**
Run: `npx next build` or `npx tsc --noEmit`
Expected: Clean compilation

- [ ] **Step 5: Commit**
```bash
git add src/app/(dashboard)/citizen/ src/components/citizen/
git commit -m "feat: build citizen portal with issue reporting, duplicate detection, and feedback"
```

---

### Task 11: Department Manager Portal (Triage, Verification & Staff Assignment)

**Files:**
- Create: `src/app/(dashboard)/manager/page.tsx`
- Create: `src/app/(dashboard)/manager/issues/page.tsx`
- Create: `src/app/(dashboard)/manager/team/page.tsx`
- Create: `src/components/manager/triage-dialog.tsx`
- Create: `src/components/manager/workload-bar.tsx`

**Interfaces:**
- Consumes: RTK Query `useGetIssuesQuery`, `useUpdateIssueStatusMutation`, `useAssignTaskMutation`.
- Produces: Department manager triage workflow UI, staff workload indicators, duplicate tagging.

- [ ] **Step 1: Implement Manager Dashboard (`/manager`)**
Department overview: pending issues requiring triage, active work orders, team workload gauges.

- [ ] **Step 2: Implement Department Issues Queue (`/manager/issues`)**
List and map view of department-specific issues with priority and status filters.

- [ ] **Step 3: Implement Triage & Assignment Dialog**
Verify issue, set priority (`Low`, `Medium`, `High`, `Critical`), select available maintenance crew member showing current task count, or flag as duplicate of another issue.

- [ ] **Step 4: Implement Team Management Page (`/manager/team`)**
View department staff members, their assigned vs completed task metrics, and active assignments.

- [ ] **Step 5: Commit**
```bash
git add src/app/(dashboard)/manager/ src/components/manager/
git commit -m "feat: build department manager portal with triage, staff assignment, and workload tracking"
```

---

### Task 12: Maintenance Staff Portal (Mobile Work Orders, Location & Completion Proof)

**Files:**
- Create: `src/app/(dashboard)/staff/page.tsx`
- Create: `src/app/(dashboard)/staff/tasks/[id]/page.tsx`
- Create: `src/components/staff/completion-dialog.tsx`

**Interfaces:**
- Consumes: RTK Query `useGetStaffTasksQuery`, `useUpdateTaskStatusMutation`.
- Produces: Mobile-optimized field maintenance interface.

- [ ] **Step 1: Implement Staff Dashboard (`/staff`)**
List of assigned maintenance tasks sorted by priority (Critical first) with quick status toggles ("Start Task").

- [ ] **Step 2: Implement Task Detail & Field Work Order Page (`/staff/tasks/[id]`)**
Map view of target infrastructure location, "Open in Maps" GPS link, issue photos and description.

- [ ] **Step 3: Implement Work Order Resolution Dialog**
Submit completion photograph (repair proof), field notes, and mark task `Resolved`.

- [ ] **Step 4: Commit**
```bash
git add src/app/(dashboard)/staff/ src/components/staff/
git commit -m "feat: build maintenance staff portal with mobile work orders and repair proof upload"
```

---

### Task 13: Admin Portal & Executive Analytics Dashboard (Recharts)

**Files:**
- Create: `src/app/(dashboard)/admin/page.tsx`
- Create: `src/app/(dashboard)/admin/analytics/page.tsx`
- Create: `src/app/(dashboard)/admin/departments/page.tsx`
- Create: `src/app/(dashboard)/admin/users/page.tsx`
- Create: `src/components/analytics/trend-chart.tsx`
- Create: `src/components/analytics/category-chart.tsx`
- Create: `src/components/analytics/sla-scorecard.tsx`

**Interfaces:**
- Consumes: RTK Query `useGetAnalyticsQuery`, `useGetDepartmentsQuery`.
- Produces: Executive BI analytics dashboard, department lifecycle controls, user management.

- [ ] **Step 1: Implement Admin Analytics Dashboard (`/admin/analytics`)**
- Recharts Area Chart for 12-month report vs. resolution trends.
- Recharts Bar Chart for Average Resolution Time by department.
- Recharts Donut Chart for Category distribution.
- SLA Compliance Scorecard ranking departments by performance.

- [ ] **Step 2: Implement Department & User Governance (`/admin/departments`, `/admin/users`)**
- Create/edit departments, activate/deactivate.
- Assign department managers and maintenance personnel.

- [ ] **Step 3: Commit**
```bash
git add src/app/(dashboard)/admin/ src/components/analytics/
git commit -m "feat: build executive analytics dashboard with Recharts and admin governance"
```

---

### Task 14: Data Explorer, Advanced Search & Saved Views

**Files:**
- Create: `src/app/(dashboard)/explorer/page.tsx`
- Create: `src/components/explorer/filter-builder.tsx`
- Create: `src/components/explorer/saved-views-dropdown.tsx`
- Create: `src/components/explorer/bulk-actions-toolbar.tsx`
- Create: `src/app/api/saved-views/route.ts`

**Interfaces:**
- Consumes: `explorerSlice`, RTK Query `useGetIssuesQuery`.
- Produces: Enterprise data exploration suite with multi-field search conditions, saved views, search history, and bulk CSV export.

- [ ] **Step 1: Implement Advanced Filter Builder**
Multi-condition builder combining Category, Status, Priority, Department, Date Range, and Debounced Full-Text Search.

- [ ] **Step 2: Implement Saved Views & Search History Dropdown**
Allows saving current filter state with a custom name, recalling saved views, and deleting views.

- [ ] **Step 3: Implement Bulk Actions Toolbar**
Bulk CSV export of selected rows, bulk department reassignment, and bulk priority change.

- [ ] **Step 4: Commit**
```bash
git add src/app/(dashboard)/explorer/ src/components/explorer/ src/app/api/saved-views/
git commit -m "feat: build Data Explorer with advanced filter builder, saved views, and bulk export"
```

---

### Task 15: Landing Page, Authentication Views & Public Access

**Files:**
- Create: `src/app/page.tsx` (Public Landing Page)
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`
- Create: `src/components/auth/demo-account-switcher.tsx`

**Interfaces:**
- Produces: Professional landing page showcasing city infrastructure stats, login with one-click demo role switcher (Admin, Manager, Staff, Citizen), and user registration.

- [ ] **Step 1: Implement Public Landing Page (`src/app/page.tsx`)**
Hero section with live issue counters, feature showcase (Report, Track, Resolve), and quick portal access buttons.

- [ ] **Step 2: Implement Login & Registration Pages**
Login form featuring one-click demo credentials picker for instant role switching during evaluations.

- [ ] **Step 3: Commit**
```bash
git add src/app/page.tsx src/app/\(auth\)/ src/components/auth/
git commit -m "feat: implement public landing page and one-click demo credentials picker"
```

---

### Task 16: Verification, End-to-End Testing & Technical Documentation

**Files:**
- Create: `README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `tests/e2e-workflow.test.ts`

**Interfaces:**
- Produces: Comprehensive technical documentation, automated end-to-end workflow verification, and deployment instructions.

- [ ] **Step 1: Write and run end-to-end issue lifecycle verification test**
Verify issue creation → manager triage & staff assignment → staff completion with proof photo → citizen 5-star rating & auto-close.
Run: `npx vitest run tests/`
Expected: ALL TESTS PASS

- [ ] **Step 2: Author comprehensive `README.md` and `docs/ARCHITECTURE.md`**
Include:
- System overview & GovTech problem statement
- Tech stack rationale (PostgreSQL, Drizzle ORM, Redux Toolkit, RTK Query, Leaflet, Recharts)
- ERD & Database schema documentation
- 8 Mandatory Technical Decision Records (Data fetching, Pagination, State management, Search, Indexing, Map selection, Geo math, Audit strategy)
- Demo credentials table for all 4 roles
- Setup and database seeding instructions

- [ ] **Step 3: Commit and final verification**
```bash
git add README.md docs/ tests/e2e-workflow.test.ts
git commit -m "docs: finalize architecture documentation, technical decision records, and test suite"
```
