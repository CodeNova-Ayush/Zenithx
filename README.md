# CampusConnect — AI Campus Operations Intelligence Platform

> **"One campus. One intelligent operations layer. Every issue accounted for."**  
> *From campus complaints to intelligent action.*

CampusConnect is a production-quality, full-stack campus operations intelligence platform built for modern universities. It eliminates friction by transforming unstructured, fragmented student complaints (in English, Hindi, voice, or photos) into structured, prioritized maintenance tickets, automated technician dispatch recommendations, duplicate detection, and verified Proof-of-Fix resolution histories.

---

## 1. Product Overview

Traditional campus operations suffer from four critical breakdown points:
1. **Intake Friction:** Students must guess technical category codes, select confusing departments, or resort to chaotic WhatsApp groups and paper registers.
2. **Missing Context:** Complaints like *"AC not working"* or *"water leaking"* lack exact floor, room, or severity clues.
3. **Premature Closures:** Maintenance tickets get closed without visual evidence, leading to student frustration and repeated re-openings.
4. **Blind Recurrence:** Chronic infrastructure failures (e.g. repeated riser pipe pressure surges or overloaded Wi-Fi access points) are treated as isolated one-off repairs.

**CampusConnect solves this with an 8-layer operational intelligence architecture.**

---

## Monorepo Architecture

CampusConnect is structured as a full-stack monorepo with separated **Frontend** and **Backend** directories:

```
Zenith/
├── frontend/               # Next.js 16 Client Portal (React 19, Three.js 3D Living Campus, Biometrics)
│   ├── src/
│   │   ├── app/            # App Router pages, layout, and editorial views
│   │   ├── components/     # LivingCampus 3D model, FaceRecognitionModal, TopBar
│   │   ├── context/        # Client AuthContext & session state
│   │   └── lib/            # Client types, constants, and utilities
│   ├── public/             # Paper dot-grid background, branding, and assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                # Node.js & Express TypeScript API Server (Port 5000)
│   ├── src/
│   │   ├── controllers/    # Express route handlers (AI, Auth, Tickets)
│   │   ├── routes/         # REST API endpoints (/api/ai, /api/auth, /api/tickets)
│   │   ├── services/       # Google Gemini SDK, Complaint Analysis, Campus Brain, Auth
│   │   ├── models/         # Domain TypeScript types & Zod schemas
│   │   ├── data/           # In-memory operations database & seed records
│   │   └── server.ts       # Express application entry point with CORS & JSON body parser
│   ├── supabase/           # PostgreSQL migration schemas
│   ├── package.json
│   └── tsconfig.json
│
├── tests/                  # Automated domain test suite
├── package.json            # Root workspace orchestrator (runs frontend & backend concurrently)
└── README.md
```

### Quick Start

```bash
# 1. Install all workspace dependencies
npm install

# 2. Run both Frontend and Backend concurrently
npm run dev

# Or run individually:
npm run dev:frontend   # Launches Next.js on http://localhost:3000
npm run dev:backend    # Launches Express API on http://localhost:5000

# Run automated domain tests
npm test
```

---

## 2. Platform Architecture & Features

### 🏛️ The Living Campus (Three.js WebGL Digital Twin)
- Procedural 3D campus visualization rendered directly in WebGL.
- Stylized architectural models with glowing incident pins for **Plumbing**, **Electricity**, **Cleanliness**, and **Internet**.
- Dynamic pointer parallax, interactive raycasting on facilities, building inspector drawer, and camera reset controls.
- Automatic fallback to high-contrast 2D sector view when WebGL is unavailable or reduced-motion is requested.

### 🧠 Gemini AI Multimodal Complaint Intake
- Students describe problems naturally via text (English, Hindi, or Hinglish), Web Speech API voice dictation, or camera upload.
- Gemini 2.5 Flash / 1.5 Flash extracts:
  - Technical Category (`plumbing` | `electricity` | `cleanliness` | `internet`)
  - Responsible Operations Department
  - Suggested Priority (`low` | `normal` | `high` | `urgent`)
  - Missing information list & targeted single-sentence follow-up questions
  - Visual observations and safety hazard alerts
- Resilient deterministic demo fallback if API keys are absent.

### 🔍 Duplicate Incident Review Queue
- Real-time spatial and textual cross-referencing checks incoming complaints against existing active tickets.
- Flags high-confidence duplicate pairs (e.g., 92% match in Tagore Hostel Block C 2nd floor).
- Triage interface allows staff to link duplicate reports to a single incident while keeping all reporting students notified.

### ⚡ Smart Dispatch Recommendation Engine
- Eliminates manual assignment guesswork.
- Evaluates technician skills, certifications, active workload, and building stationing proximity.
- Ranks candidates with transparent, auditable rationale bullets (e.g., *“Tagore Hostel Block Specialist with only 2 active jobs”*).

### 🛡️ Proof-of-Fix Resolution Verification
- Prevents premature ticket closure.
- Technicians upload post-repair completion photographs and technical logs.
- Gemini assesses visible corrections, residual water/wiring concerns, and confidence scores.
- Mandatory student sign-off allows students to verify the fix with a 5-star rating or reopen with escalated priority.

### 📡 Recurrence Radar (Preventive Maintenance)
- Historical clustering algorithms detect systemic equipment failures across facilities.
- Highlights root causes (e.g., main riser valve pressure surges) and enables one-click scheduling of preventive engineering inspections.

### 💬 Campus Brain Natural Language Command
- Conversational command interface for operations directors.
- Translates questions (*"What needs attention first?"*, *"Which buildings have the most plumbing leaks?"*) into controlled deterministic query aggregations over live database records.

### 📜 Operational Trust Ledger & Notifications
- Append-only event history tracking every creation, AI categorization, assignment, status transition, and student feedback.
- Real-time in-app notification center with unread badge count.

---

## 3. Technology Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript 5 (Strict Mode)
- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons
- **3D Graphics:** Three.js (Procedural geometries, raycasting, custom shaders)
- **Validation:** Zod schemas for all domain entities & structured AI outputs
- **AI SDK:** Official Google Gen AI SDK (`@google/genai`)
- **Database / Auth:** Supabase PostgreSQL with Row Level Security (RLS) policies & local persistent store
- **Audio / Voice:** Web Speech Recognition API
- **Testing:** Node.js native test runner (`node --test`)

---

## 4. Getting Started Locally

### Prerequisites
- Node.js v18.18+ or v20+ (tested on Node v24)
- npm v9+

### Installation

```bash
# Clone or navigate to the workspace
cd Zenith

# Install dependencies
npm install

# Run the automated unit test suite
npm test

# Build production bundle
npm run build

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

```ini
# Google Gemini API Key (Get free from https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-flash

# Optional: Supabase Production Persistence
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Explicit Demo Mode (Works locally out-of-the-box without external keys)
NEXT_PUBLIC_DEMO_MODE=true
```

> **Note on Demo Mode:** CampusConnect runs seamlessly out-of-the-box with pre-seeded data, instant role switching, and deterministic AI intelligence even if no API keys are provided.

---

## 6. Supabase Setup & Database Migrations

To connect a live Supabase PostgreSQL backend:
1. Create a project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open and run `supabase/migrations/01_campusconnect_schema.sql`.
   - Creates all tables: `profiles`, `tickets`, `ticket_events`, `ticket_attachments`, `resolution_assessments`, `duplicate_candidates`, `notifications`.
   - Configures foreign keys, performance indexes, and Row Level Security (RLS) policies.
4. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

---

## 7. Role-Based Demo Accounts

Use the role switcher in the navigation bar or log in at `/login`:

| Persona | Demo Email | Role | Access |
|---|---|---|---|
| **Ananya Roy** | `student@campusconnect.demo` | Student | File complaints, track tickets, confirm Proof-of-Fix |
| **Rajesh Sharma** | `staff@campusconnect.demo` | Maintenance Staff | Dispatch, resolve tickets, upload proof, triage duplicates |
| **Dr. Meenakshi Sundaram** | `admin@campusconnect.demo` | Campus Administrator | Campus Brain, Recurrence Radar, Settings, Executive KPIs |

---

## 8. Complete Hackathon Demonstration Walkthrough

Follow this 5-minute judge demonstration script:

1. **The Living Campus (Landing Page):**
   - Open `http://localhost:3000`.
   - Move pointer across the 3D scene to observe smooth parallax.
   - Click on glowing incident pins to reveal facility details. Click "Reset View".
2. **Student Natural Intake (`/student/report`):**
   - Click **"Report Issue"**.
   - Click the preset `💧 Hostel bathroom leak` or dictate with the microphone.
   - Advance to Location (defaults to Tagore Hostel Block C).
   - Click **"Analyze with Gemini AI"**.
   - Observe real-time structured classification (`PLUMBING`, `URGENT`), assigned department (`Plumbing & Hydraulic Services`), and follow-up question.
   - Click **"Review Final Ticket"** and **"Confirm & Dispatch Ticket"**.
   - Observe confetti celebration and generated ticket number (e.g. `CAMPUS-1050`).
3. **Ticket Progress Tracking (`/student/tickets/...`):**
   - Click **"Track Ticket Progress"**.
   - Inspect the live SLA timer, location details, and the immutable audit timeline.
4. **Staff Operations Dashboard (`/staff`):**
   - Switch role to **Staff** using the top navigation bar dropdown.
   - Navigate to `/staff` to view real database-backed KPIs: Unassigned tickets, Urgent hazards, SLA breach alerts.
5. **Duplicate Incident Triage (`/staff/duplicates`):**
   - Inspect the pending candidate pair with 92% similarity matching.
   - Click **"Confirm Duplicate & Link Incidents"** to merge parallel reports.
6. **Smart Dispatch Recommendation (`/staff/dispatch`):**
   - Select an unassigned ticket.
   - Inspect ranked specialist candidates with workload and proximity rationale. Click **"Dispatch"**.
7. **Proof-of-Fix Evidence Verification:**
   - Open ticket `/staff/tickets/ticket-101`.
   - Upload repair photo and click **"Verify Proof-of-Fix & Mark Resolved"**.
   - Switch role back to **Student** on the ticket detail page.
   - Click **"Confirm Issue is Fixed"**, select 5 stars, and sign off.
8. **Campus Pulse (`/staff/campus-pulse`):**
   - Toggle between 2D Sector View and 3D Living Campus.
   - Inspect incident density across campus buildings.
9. **Campus Brain AI Assistant (`/staff/campus-brain`):**
   - Click suggested question: *"What needs attention first?"*
   - Observe AI response synthesized strictly from authorized live records with supporting metrics.
10. **Recurrence Radar (`/staff/recurrence`):**
    - Review systemic patterns (e.g., chronic washroom plumbing failure in Tagore Hostel).
    - Click **"Schedule Inspection"** to dispatch preventive maintenance.

---

---

## 8. Authentication & Security Architecture

CampusConnect implements **real cryptographic session authentication** with zero mock logins:
- **Provider & Hashing:** Server-side PBKDF2 with unique cryptographic salts (10,000 rounds of SHA-512) and optional Supabase Auth bridge.
- **Session Tokens:** 256-bit cryptographically secure tokens stored in `HttpOnly`, `SameSite=lax` cookies (`campusconnect_session_token`).
- **Role-Based Authorization:** Server-side role resolution (`student`, `staff`, `admin`) preventing client-side privilege escalation. Public registration strictly defaults to `student`.
- **Routes Implemented:**
  - `/login`: Split-editorial authentication page with password visibility toggles and real server validation.
  - `/signup`: Multi-field registration with confirmation validation and server-side user provisioning.
  - `/forgot-password`: Real recovery workflow.
  - `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/me`.

### Default Seeded Accounts for Testing:
| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campusconnect.demo` | `CampusOps2026!` |
| **Staff** | `staff@campusconnect.demo` | `CampusOps2026!` |
| **Administrator** | `admin@campusconnect.demo` | `CampusOps2026!` |

---

## 9. Verification & Automated Tests

Run the test suite:
```bash
npm test
```
```
✔ Category validation accepts valid categories and rejects invalid (0.78ms)
✔ Priority validation behaves correctly (0.08ms)
✔ Ticket status transition state machine (0.09ms)
✔ Department routing mappings are exact and non-empty (0.05ms)
✔ SLA Matrix deadline calculation (0.77ms)
✔ AIComplaintAnalysisSchema parses structured output correctly (2.51ms)
✔ Duplicate matching score algorithm calculates accurately (0.09ms)
✔ AIResolutionReviewSchema parses Proof-of-Fix structured verdict (0.47ms)
ℹ tests 8, suites 0, pass 8, fail 0
```

Verify production build:
```bash
npm run build
```
All 30 Next.js routes compile statically and dynamically with Turbopack with 0 errors.

---

## 10. License

Developed for the Campus Operations Intelligence Hackathon. Built with Next.js, Three.js, and Google Gemini AI.
