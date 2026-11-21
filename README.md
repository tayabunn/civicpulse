# CivicPulse — Smart City Infrastructure Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.2-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791.svg)](https://neon.tech/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.6-764ABC.svg)](https://redux-toolkit.js.org/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-6E9F18.svg)](https://vitest.dev/)

**CivicPulse** is an enterprise-grade Smart City Infrastructure Management Platform (GovTech) designed to unite citizens, municipal department managers, field maintenance technicians, and city leadership into a seamless, real-time incident resolution workflow.

---

## 🏛️ System Architecture & Workflow

CivicPulse is organized as an npm workspaces monorepo:
- **`backend/`**: Node.js + Express + TypeScript + Drizzle ORM + Neon Cloud PostgreSQL. Includes geospatial Haversine math (50m duplicate radar), cryptographic JWT sessions, and composite-indexed relational models.
- **`frontend/`**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Redux Toolkit & RTK Query + Leaflet maps + Recharts analytics.

### 🔄 Issue Lifecycle State Machine
```
[Submitted] ──> [Under Review] ──> [Assigned] ──> [In Progress] ──> [Resolved] ──> [Closed]
```
Every status transition appends an immutable cryptographic record to `issue_activities` for auditing.

---

## 🎨 Signal City Design System (v1.0)

CivicPulse adheres to the Signal City Design System:
- **60% Neutral Surfaces**: Warm White (`#F7F5EF`) light background, Deep Slate (`#111827`) dark background.
- **25% Midnight Navy (`#202B45`)**: Navigation authority, structural sidebar, high-contrast framing.
- **10% Electric Cobalt (`#315CFF`)**: Primary brand identity, CTAs, interactive highlights.
- **5% Signal Yellow (`#FFD447`)**: Critical emphasis, active status indicators, map halos.
- **Typography**: Space Grotesk (Headings/KPIs), Inter (UI & tables), IBM Plex Mono (GPS coords & Tracking IDs).

---

## 👥 User Roles & Demo Credentials

| Role | Demo Email | Password | Primary Capabilities |
|---|---|---|---|
| **City Administrator** | `admin@civicpulse.gov` | `admin123` | Citywide governance, BI analytics, department management, SLA monitoring. |
| **Department Manager** | `manager.roads@civicpulse.gov` | `manager123` | Triage incoming reports, assign tasks to crew members, monitor team workloads. |
| **Field Maintenance Staff** | `staff.electric@civicpulse.gov` | `staff123` | Mobile work order board, Google Maps navigation, upload repair completion photos. |
| **Citizen** | `citizen.jane@civicpulse.gov` | `citizen123` | Geotagged issue reporting, 50m duplicate radar, progress tracking, 5-star feedback. |

*Note: The frontend includes an instant **1-Click Demo Persona Switcher** in the navigation header to frictionlessly test any role.*

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+
- PostgreSQL or Neon Cloud Account (Pre-configured connection included)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/tayabunn/civicpulse.git
cd civicpulse

# Install dependencies across all monorepo workspaces
npm install
```

### 3. Database Migration & Seeding
```bash
# Push Drizzle schema to Neon Cloud PostgreSQL
npm run db:push

# Populate database with realistic demo data (5 departments, 33 staff, 108 issues)
npm run db:seed
```

### 4. Running the Development Servers
```bash
# Terminal 1: Start Backend API Server (Port 5000)
npm run dev:backend

# Terminal 2: Start Next.js Frontend Server (Port 3000)
npm run dev:frontend
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

```bash
# Run all 21 unit tests across backend & frontend
npm run test

# Run backend tests only (Vitest)
npm run test:backend

# Run frontend tests only (Vitest)
npm run test:frontend
```

---

## 📁 Repository Structure

```
civicpulse/
├── backend/
│   ├── src/
│   │   ├── db/          # Drizzle schema, Neon connection, seed script
│   │   ├── lib/         # Auth (jose, bcryptjs), geo math (Haversine)
│   │   ├── middleware/  # JWT authentication & role-based guards
│   │   ├── routes/      # Express REST routes (auth, issues, tasks, analytics)
│   │   └── server.ts    # Server bootstrap & CORS configuration
│   └── tests/           # Backend unit tests
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (Citizen, Manager, Staff, Admin)
│   │   ├── components/  # Signal City UI, Leaflet map, Recharts components
│   │   ├── store/       # Redux Toolkit & RTK Query client caching
│   │   └── lib/         # Utility functions & badge resolvers
│   └── tests/           # Frontend unit tests
├── docs/                # Architecture design docs & execution plans
└── package.json         # Monorepo workspaces definition
```

---

## 📄 License
MIT © 2026 CivicPulse Team
