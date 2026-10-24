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

### 🔎 Outage Detective (Root-Cause Inference from Complaint Clusters)
- **Infrastructure Graph:** Models campus physical topologies (substations, distribution boards, water risers, routers, switches) in a directed graph.
- **Deterministic Clustering:** Automatically triggers when $\ge 3$ complaints cluster within a 24-hour window across $\ge 2$ distinct rooms or floors.
- **Lowest Common Ancestor (LCA):** Algorithmic traversal identifies the most specific upstream shared point of failure (e.g. Tagore Hostel Riser Valve A or Floor 2 Distribution Board).
- **Transparent Confidence Scoring:** Calculates an audit score based on ticket volume, geographic dispersion, temporal concentration, and parent node specificity.
- **Incident Lifecycle:** Controlled state machine (`proposed` $\to$ `confirmed` $\to$ `resolved` / `dismissed`).
- **Staff Operations:** Dedicated Incidents Queue (`/staff/incidents`) and Interactive SVG Topology Drilldown (`/staff/incidents/[id]`).

### 📹 Show-Me Reporting (Gemini Multimodal Video & Voice Complaints)
- **In-Browser Capture:** Native video and voice recording (`ShowMeRecorder.tsx`) with a strict 15-second cap, real-time countdown, and Web Audio API live visualizer.
- **Gemini 2.0 Multimodal Intelligence:** Extracts objective visual observations and audio cues without hallucinating unverified root causes.
- **Bilingual Transcription:** Transcribes Hindi, Hinglish, and English audio with automatic English translation.
- **Deterministic Hazard Escalation:** Detects high-risk safety cues (*sparking, exposed wires, bare wires, smoke, water near electric, flooding, gas leaks*) and automatically escalates ticket priority to **Urgent** with safety hazard alerts.
- **Voice Q&A:** Synthesizes single-sentence follow-up questions to resolve missing context.
- **Biometric Face Verification:** Confirms student identity via camera capture prior to ticket submission.

### 🛠️ Repair Copilot (Technician Knowledge Retrieval)
- **Campus Knowledge Base:** 28+ verified repair entries retrieved from historical resolved tickets across plumbing, electricity, internet, and cleanliness.
- **Factual Aggregates:** Calculates deterministic median resolution times and top most-frequently used parts and tools.
- **Gemini Preparation Guidance:** Synthesizes structured preparation checklists, required tools, and safety warnings citing specific past ticket numbers.
- **Feedback Loop:** Technicians can upvote or downvote suggestions to continuously refine retrieval quality.
- **Extended Resolution Capture:** Records specific parts used, tools utilized, and actual time spent upon ticket resolution to enrich the knowledge base.

### 📚 Student Verified Campus Assistant & Admin Knowledge Base
- **Zero-Hallucination Policy:** Answers synthesized exclusively around admin-managed knowledge entries and student-safe live operational lookups. Never speculates.
- **Grounded Source Attribution:** Every claim references document title, owner department, and last-reviewed date. Amber warning banner displayed when a source is $> 6$ months old.
- **Honest Fallback:** If no verified match exists, answers: *"I don’t have verified information on this topic"* and provides relevant department contact and a prefilled ticket creation action.
- **Signature Wi-Fi Flow:** Correlates Wi-Fi inquiries with active hostel outages; offers instant "Follow this ticket" SMS/app subscriptions to suppress duplicate queues without inventing fix times.
- **Emergency Safety Interception:** Life-safety terms (*fire, bleeding, unconscious, suicide, electric shock, assault*) immediately halt standard generation and display certified 24/7 campus emergency dispatch (`1800-CAMPUS-911` and Ambulance).
- **Strict Student Privacy & Access Control:** Students can check only their own maintenance tickets (`studentId` validated); querying other students' tickets is refused.
- **Admin Knowledge Governance (`/staff/knowledge`):** Complete admin portal to create, edit, publish, and archive entries, plus automated Knowledge Gap mining from student questions and negative feedback.
- **Bilingual Support:** Native English and Hindi answering with verified source citations.

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

## 8. Authentication & Security Architecture (Clerk Integration)

CampusConnect integrates **Clerk Authentication** (`app_3L7XtzGjCoAeeiA8Wx7bFbkJ4TF`) tailored to our warm ivory paper aesthetic, with built-in fallback for local/demo evaluation:

- **Sign-In & Sign-Up Routes:**
  - `/sign-in/[[...sign-in]]`: Warm ivory split composition embedding Clerk's `<SignIn />` component with custom `#35483A` buttons, `#FCFAF6` paper background, and `#24251F` ink typography.
  - `/sign-up/[[...sign-up]]`: Registration portal defaulting newly created accounts to `student` role.
  - `/auth/redirect`: Dynamic role dispatcher redirecting `student` to `/student/dashboard` and `staff`/`admin` to `/staff/dashboard`.
- **Middleware Role Protection:** `middleware.ts` guards `/student/*`, `/staff/*`, and `/admin/*` routes using `clerkMiddleware()`.
- **Webhook Synchronization:** `/api/webhooks/clerk` validates Svix signatures to synchronize user metadata with the application database.
- **Cryptographic Demo Mode:** For offline/local hackathon evaluation without active Clerk keys, the app automatically enables local demo authentication with 1-click role switching between Student, Staff, and Admin.

### Default Seeded Accounts for Testing:
| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campusconnect.demo` | `CampusOps2026!` |
| **Staff** | `staff@campusconnect.demo` | `CampusOps2026!` |
| **Administrator** | `admin@campusconnect.demo` | `CampusOps2026!` |

---

## 9. Verification & Automated Tests

Run the domain test suite:
```bash
npm test
```
```
✔ Category validation accepts valid categories and rejects invalid (0.86ms)
✔ Priority validation behaves correctly (0.09ms)
✔ Ticket status transition state machine (0.09ms)
✔ Department routing mappings are exact and non-empty (0.08ms)
✔ SLA Matrix deadline calculation (0.67ms)
✔ AIComplaintAnalysisSchema parses structured output correctly (2.52ms)
✔ Duplicate matching score algorithm calculates accurately (0.09ms)
✔ AIResolutionReviewSchema parses Proof-of-Fix structured verdict (0.48ms)
✔ Outage Detective: Lowest Common Ancestor (LCA) finds shared infrastructure upstream node (0.16ms)
✔ Outage Detective: Confidence score calculation increases with cluster dispersion and volume (0.14ms)
✔ Outage Detective: Probable Incident status transitions conform to lifecycle (0.07ms)
✔ Show-Me Reporting: Deterministic hazard escalation flags dangerous keywords (0.11ms)
✔ Show-Me Reporting: Video recording duration limit enforces 15 seconds cap (0.08ms)
✔ Repair Copilot: Median resolution time calculation handles even, odd, and empty arrays (0.08ms)
✔ Repair Copilot: Most common parts counts frequencies accurately and sorts descending (0.09ms)
✔ Clerk Auth: Role-based destination routing redirects correctly (0.05ms)
✔ Student Assistant: Emergency detection interrupts immediately and returns emergency contacts (0.06ms)
✔ Student Assistant: Knowledge base search performs audience filtering and token scoring (0.15ms)
✔ Student Assistant: Access control strictly refuses access to another student ticket (0.06ms)
✔ Student Assistant: Freshness validator flags source documents older than 180 days as stale (0.04ms)
✔ Student Assistant: 30-Question Evaluation Dataset runs with complete accuracy and zero hallucinations (0.28ms)
ℹ tests 21, suites 0, pass 21, fail 0
```

Verify Next.js production build:
```bash
npm run build --prefix frontend
```
All 37 Next.js routes compile statically and dynamically with Turbopack with 0 errors.

---

## 10. License

Developed for the Campus Operations Intelligence Hackathon. Built with Next.js, Three.js, and Google Gemini AI.
