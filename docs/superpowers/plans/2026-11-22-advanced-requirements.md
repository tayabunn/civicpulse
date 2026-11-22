# Advanced Requirements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement comprehensive advanced capabilities for CivicPulse: Advanced Search & Filtering, Date Range & Priority Filtering, Debounced Search, Server-Side Pagination, Image Upload with Preview, Inline Form Validation, Notification System, Activity History Audit Trail, Responsive Layouts, and Interactive Analytics Charts.

**Architecture:** Monorepo with Next.js 15 App Router frontend and Express + Drizzle ORM backend. Extends existing PostgreSQL schema queries for date bounds, adds debounce and custom filter hooks on frontend, provides client-side image dropzone with base64 serialization, introduces a global notification context with animated toasts, and enhances Recharts with interactive timeframes and tooltips.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Express, Drizzle ORM, Neon PostgreSQL, Redux Toolkit, RTK Query, Recharts, Lucide React, Zod, Vitest.

**Spec:** Section 4 of user requirements:
1. Advanced Search and Filtering
2. Sorting and Pagination
3. Date Range Filtering
4. Priority-based Filtering
5. Debounced Search
6. Server-side Pagination
7. Image Upload and Preview
8. Form Validation
9. Notification System
10. Activity History
11. Responsive Dashboard
12. Loading, Error, Empty, and Success States
13. Interactive Analytics Charts

## Global Constraints

- Language & Runtime: TypeScript strict mode, Node.js v20+.
- All searching, filtering, date range slicing, sorting, and pagination must execute on the PostgreSQL server.
- All 4 roles (Citizen, Manager, Staff, Admin) must have seamless mobile-responsive views.
- Retain Signal City Design System tokens (Midnight Navy `#202B45`, Cobalt `#315CFF`, Yellow `#FFD447`).
- Zero regression on existing 13 backend unit tests and 8 frontend unit tests.

## Review Focus

1. **Date Range Filtering Edge Cases:** Querying `startDate` without `endDate` (or vice versa), and queries with `startDate > endDate` must be safely validated without SQL injection or crash.
2. **Debounced Search Race Conditions:** Rapid typing in search bar must cancel previous pending queries or yield to the latest debounced term without flickering.
3. **Image Upload Restrictions:** Files > 5MB or non-image types (e.g. PDF, executable) must be rejected with an inline error before preview or upload.
4. **Form Validation Coverage:** Submitting without required fields must highlight invalid fields with inline error messages and block network dispatch.
5. **Pagination Boundary Guards:** Navigating to page < 1 or page > `totalPages` must be clamped gracefully.

---

### Task 1: Backend Advanced Date Range Filtering & Multi-Column Sorting

**Files:**
- Modify: `backend/src/lib/validation.ts`
- Modify: `backend/src/routes/issues.ts`
- Test: `backend/tests/issue-service.test.ts`

**Interfaces:**
- Consumes: `issues` table from `backend/src/db/schema.ts`
- Produces: Query parameters `startDate`, `endDate`, `priority`, `sort`, `order` accepted by `GET /api/issues`

- [ ] **Step 1: Write test for date range and priority filtering**
In `backend/tests/issue-service.test.ts`, add test verifying date bounds filtering and priority ordering.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm --workspace=backend run test tests/issue-service.test.ts`

- [ ] **Step 3: Update `backend/src/lib/validation.ts`**
Add `startDate: z.string().optional()` and `endDate: z.string().optional()` to `issueFilterSchema`.

- [ ] **Step 4: Update `backend/src/routes/issues.ts`**
Add `gte(issues.createdAt, new Date(startDate))` and `lte(issues.createdAt, new Date(endDate))` conditions. Support sorting by `createdAt`, `priority`, `status`, and `title`.

- [ ] **Step 5: Run tests and verify they pass**
Run: `npm --workspace=backend run test`

---

### Task 2: Debounced Search Input & Advanced Filter Toolbar Component

**Files:**
- Create: `frontend/src/components/ui/debounced-search-input.tsx`
- Create: `frontend/src/components/table/filter-toolbar.tsx`
- Modify: `frontend/src/types/index.ts`
- Modify: `frontend/src/store/apiSlice.ts`

**Interfaces:**
- Consumes: `IssueFilters` from `frontend/src/types/index.ts`
- Produces: Reusable `<FilterToolbar />` component with text search, date range pickers, category/priority/status dropdowns, sorting toggles, and active filter reset.

- [ ] **Step 1: Update `frontend/src/types/index.ts` and `frontend/src/store/apiSlice.ts`**
Add `startDate?: string`, `endDate?: string`, `sort?: string`, `order?: 'asc' | 'desc'` to `IssueFilters`.

- [ ] **Step 2: Create `frontend/src/components/ui/debounced-search-input.tsx`**
Implement input with 300ms debounce, clear button (X), search icon, and loading indicator.

- [ ] **Step 3: Create `frontend/src/components/table/filter-toolbar.tsx`**
Build the full toolbar containing:
- Debounced search bar
- Status filter dropdown
- Priority filter dropdown
- Category filter dropdown
- Start Date and End Date inputs
- Sort by & Sort Order toggles
- "Reset Filters" button with active filters badge counter

---

### Task 3: Server-Side Pagination, Responsive Table & Empty/Loading States

**Files:**
- Modify: `frontend/src/components/table/data-table.tsx`
- Modify: `frontend/src/app/(dashboard)/manager/issues/page.tsx`
- Modify: `frontend/src/app/(dashboard)/citizen/reports/page.tsx`

**Interfaces:**
- Consumes: `<DataTable />` props (`issues`, `total`, `page`, `limit`, `totalPages`, `onPageChange`, `onLimitChange`, `isLoading`, `error`)
- Produces: Server-paginated responsive data view with skeletons, empty illustration, and page size selector.

- [ ] **Step 1: Enhance `frontend/src/components/table/data-table.tsx`**
- Add skeleton rows with animated pulse effect when `isLoading` is true.
- Add rich empty state with icon, descriptive text, and clear action button.
- Add server-side page size selector (10, 20, 50 records per page).
- Add responsive card layout for mobile screens (`block md:hidden`).
- Add sortable column headers that trigger sorting on `trackingCode`, `title`, `priority`, `status`, `createdAt`.

- [ ] **Step 2: Update `frontend/src/app/(dashboard)/manager/issues/page.tsx`**
Connect `<FilterToolbar />` with debounced search, date range, priority, category, status, and server pagination.

- [ ] **Step 3: Update `frontend/src/app/(dashboard)/citizen/reports/page.tsx`**
Equip citizen reports view with search, filter tabs, sorting, and pagination.

---

### Task 4: Client-Side Image Upload with Drag-and-Drop & Form Validation

**Files:**
- Create: `frontend/src/components/ui/image-uploader.tsx`
- Modify: `frontend/src/app/(dashboard)/citizen/create/page.tsx`

**Interfaces:**
- Consumes: File input / drag & drop events
- Produces: Base64 data URL with preview thumbnail, remove button, and file validation.

- [ ] **Step 1: Create `frontend/src/components/ui/image-uploader.tsx`**
Implement drag-and-drop zone with:
- Drag-over highlight styling
- File size check (< 5MB)
- File type check (`image/jpeg`, `image/png`, `image/webp`)
- Instant preview image with full-screen preview modal or expand
- Delete/Remove photo button
- Fallback sample photo picker

- [ ] **Step 2: Update `frontend/src/app/(dashboard)/citizen/create/page.tsx`**
- Integrate `ImageUploader`.
- Add inline form validation with real-time feedback:
  - Title: required, min 5 chars
  - Category: required, valid enum
  - Description: required, min 15 chars
  - Address: required, min 5 chars
  - Coordinates: valid latitude & longitude
- Highlight fields with red border and helper error text.
- Add Loading and Success submission states.

---

### Task 5: Global Notification Toast System & Header Notification Center

**Files:**
- Create: `frontend/src/context/notification-context.tsx`
- Create: `frontend/src/components/ui/toast-container.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/components/layout/header.tsx`

**Interfaces:**
- Produces: `useNotification()` hook exposing `notifySuccess(msg)`, `notifyError(msg)`, `notifyInfo(msg)`, `notifyWarning(msg)`.
- Top header notification bell with unread badge counter and drop-down drawer.

- [ ] **Step 1: Create notification context and toast container**
Build `NotificationContext` providing auto-dismissing toasts (4s) with icons, progress animation, and manual dismiss.

- [ ] **Step 2: Mount toast container in `frontend/src/app/layout.tsx`**
Ensure toasts render globally above all modals and pages.

- [ ] **Step 3: Enhance `frontend/src/components/layout/header.tsx`**
Add interactive notification bell icon with badge count and dropdown panel showing recent system activities.

---

### Task 6: Complete Activity History Audit Trail on Issue Details

**Files:**
- Modify: `frontend/src/app/(dashboard)/citizen/issues/[id]/page.tsx`
- Modify: `backend/src/routes/issues.ts`

**Interfaces:**
- Consumes: `activities` from issue details
- Produces: Visual vertical audit trail with actor name, role badge, timestamp, action type, and status transition notes.

- [ ] **Step 1: Enhance `backend/src/routes/issues.ts` activity fetching**
Ensure `issueActivities` includes user details (`name`, `role`, `avatarUrl`).

- [ ] **Step 2: Update `frontend/src/app/(dashboard)/citizen/issues/[id]/page.tsx`**
Build visual vertical activity timeline with:
- Status transition chips (`Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved` → `Closed`)
- Actor details (avatar, name, role badge)
- Relative and exact timestamps
- Triage action panel for Managers and Admins to reassign priority, department, staff, and update status.

---

### Task 7: Mobile-Responsive Layout & Interactive Analytics Dashboard

**Files:**
- Modify: `frontend/src/components/layout/sidebar.tsx`
- Modify: `frontend/src/components/layout/header.tsx`
- Modify: `frontend/src/app/(dashboard)/admin/analytics/page.tsx`

**Interfaces:**
- Produces: Mobile drawer navigation for screens < 768px, and interactive Recharts with timeframe selectors, custom tooltips, and data series toggles.

- [ ] **Step 1: Mobile navigation drawer in `sidebar.tsx` and `header.tsx`**
Add responsive sheet drawer that opens on mobile via hamburger menu and closes on link click or outside click.

- [ ] **Step 2: Interactive Analytics Charts in `admin/analytics/page.tsx`**
- Timeframe filter selector (Last 7 Days, Last 30 Days, Last 90 Days, All Time).
- Recharts interactive hover tooltips with custom Signal City styling.
- Metric KPI cards with percentage indicators and trend badges.
- Category breakdown with interactive bar chart.
- Department resolution time scorecards.

---

### Task 8: Verification, Test Suite & Deployment

- [ ] **Step 1: Run backend tests**
Run: `npm run test:backend` (verify 13+ tests pass).

- [ ] **Step 2: Run frontend tests**
Run: `npm run test:frontend` (verify 8+ tests pass).

- [ ] **Step 3: Run Next.js production build**
Run: `npm run build:frontend` (verify all pages compile with 0 errors).

- [ ] **Step 4: Commit and push to GitHub `main`**
Push changes to trigger Vercel deployment.
