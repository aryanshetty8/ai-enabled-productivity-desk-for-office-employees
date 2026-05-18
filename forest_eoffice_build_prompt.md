# 🌲 Forest eOffice Productivity Monitoring System — Full Build Prompt

## Project Summary

Build a **full-stack Next.js 14+ application** (App Router) for monitoring and analyzing employee productivity in a government forest department office. The system tracks digital file processing, surfaces performance deviations, and uses an integrated LLM (Claude) for natural language summaries and a chatbot interface.

All data is stored in **CSV files** (no database). Authentication is **JWT-based**, and the project is entirely self-contained in a single Next.js monorepo — no separate backend process.

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Server Components, Server Actions, Route Handlers |
| Language | TypeScript (strict) | All files `.tsx` / `.ts` |
| Styling | Tailwind CSS + shadcn/ui | Government/forest green theme |
| Charts | Recharts | Bar, Line, Radar, Scatter |
| Auth | JWT via `jose` + HttpOnly cookies | No NextAuth |
| CSV parsing | `papaparse` | Read/write CSV from `/data` folder |
| LLM | Anthropic Claude API (`@anthropic-ai/sdk`) | Summaries + chatbot |
| Icons | `lucide-react` | |
| Forms | React Hook Form + Zod | |
| State | React `useState` / `useReducer` + Context | No Redux |

---

## 2. Directory Structure

```
forest-eoffice/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Sidebar + topbar shell
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Main overview dashboard
│   │   ├── employees/
│   │   │   ├── page.tsx              # Employee list + metrics
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Individual employee detail
│   │   ├── sections/
│   │   │   ├── page.tsx              # Section performance
│   │   │   └── [section]/
│   │   │       └── page.tsx          # Section detail
│   │   ├── files/
│   │   │   └── page.tsx              # File processing analytics
│   │   ├── reports/
│   │   │   └── page.tsx              # Exportable reports
│   │   └── chatbot/
│   │       └── page.tsx              # Natural language query interface
│   ├── admin/
│   │   ├── layout.tsx                # Admin-only guard
│   │   ├── page.tsx                  # Admin panel landing
│   │   ├── users/
│   │   │   └── page.tsx              # User management (CRUD)
│   │   ├── data/
│   │   │   └── page.tsx              # CSV data management
│   │   └── settings/
│   │       └── page.tsx              # System config
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts        # POST: issue JWT
│       │   └── logout/route.ts       # POST: clear cookie
│       ├── employees/
│       │   ├── route.ts              # GET all, POST new
│       │   └── [id]/route.ts         # GET, PUT, DELETE by ID
│       ├── sections/route.ts         # GET section aggregates
│       ├── files/route.ts            # GET file records, POST new entry
│       ├── metrics/route.ts          # GET computed productivity metrics
│       ├── chat/route.ts             # POST: LLM chat endpoint
│       └── llm-summary/route.ts      # POST: generate LLM performance summary
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── PageHeader.tsx
│   ├── charts/
│   │   ├── ProductivityBarChart.tsx
│   │   ├── FileVolumeLineChart.tsx
│   │   ├── SectionRadarChart.tsx
│   │   ├── PendingVsCompletedChart.tsx
│   │   └── PerformanceScatterPlot.tsx
│   ├── dashboard/
│   │   ├── KPICard.tsx
│   │   ├── UnderperformerAlert.tsx
│   │   ├── TopPerformersTable.tsx
│   │   └── RecentActivityFeed.tsx
│   ├── employees/
│   │   ├── EmployeeCard.tsx
│   │   ├── EmployeeTable.tsx
│   │   └── PerformanceBadge.tsx
│   ├── chatbot/
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ChatInput.tsx
│   └── admin/
│       ├── DataTable.tsx
│       ├── CSVUploader.tsx
│       └── UserForm.tsx
├── lib/
│   ├── auth.ts                       # JWT sign/verify with jose
│   ├── csv.ts                        # Read/write CSV utilities
│   ├── metrics.ts                    # All productivity metric computations
│   ├── llm.ts                        # Anthropic SDK wrapper
│   └── constants.ts                  # Section names, status enums, thresholds
├── middleware.ts                      # Route protection
├── data/
│   ├── forest_eoffice_data.csv
│   ├── users.csv
│   └── employee_files.csv
├── types/
│   └── index.ts                      # All shared TypeScript types
├── .env.local
└── tailwind.config.ts
```

---

## 3. CSV Data Schemas

### `data/users.csv`
```
id,username,password_hash,role,name,section,designation,joining_date,email
1,admin,<bcrypt_hash>,admin,Admin User,Administration,System Admin,2020-01-01,admin@forest.gov.in
2,ramesh,<bcrypt_hash>,employee,Ramesh Kumar,Wildlife,Forest Ranger,2021-03-15,ramesh@forest.gov.in
3,sita,<bcrypt_hash>,employee,Sita Devi,Plantation,Jr. Officer,2022-06-01,sita@forest.gov.in
4,ajay,<bcrypt_hash>,employee,Ajay Sharma,Administration,Clerk,2020-09-10,ajay@forest.gov.in
5,pooja,<bcrypt_hash>,employee,Pooja Nair,Finance,Accountant,2021-11-20,pooja@forest.gov.in
```

### `data/forest_eoffice_data.csv`
```
file_id,file_number,file_title,file_type,section,received_date,due_date,completed_date,status,priority,assigned_to,remarks
F001,/DFO/2024/001,Timber Permit Application,Permit,Wildlife,2024-01-10,2024-01-20,2024-01-18,completed,high,ramesh,Approved
F002,/DFO/2024/002,Plantation Drive Proposal,Proposal,Plantation,2024-01-12,2024-01-25,,pending,medium,sita,Under review
...
```

**File statuses:** `pending`, `in_progress`, `completed`, `overdue`, `escalated`  
**File types:** `Permit`, `Proposal`, `Inspection Report`, `Complaint`, `Notice`, `Budget`, `Circular`, `Correspondence`  
**Sections:** `Wildlife`, `Plantation`, `Administration`, `Finance`, `Enforcement`, `Research`  
**Priorities:** `low`, `medium`, `high`, `urgent`

### `data/employee_files.csv`
```
assignment_id,employee_id,file_id,assigned_date,role_in_file,status
A001,2,F001,2024-01-10,primary,completed
A002,3,F002,2024-01-12,primary,pending
...
```

---

## 4. TypeScript Types (`types/index.ts`)

```typescript
export type Role = 'admin' | 'employee';
export type FileStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'escalated';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Section = 'Wildlife' | 'Plantation' | 'Administration' | 'Finance' | 'Enforcement' | 'Research';

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: Role;
  name: string;
  section: Section;
  designation: string;
  joining_date: string;
  email: string;
}

export interface FileRecord {
  file_id: string;
  file_number: string;
  file_title: string;
  file_type: string;
  section: Section;
  received_date: string;
  due_date: string;
  completed_date?: string;
  status: FileStatus;
  priority: Priority;
  assigned_to: string; // username
  remarks?: string;
}

export interface EmployeeAssignment {
  assignment_id: string;
  employee_id: string;
  file_id: string;
  assigned_date: string;
  role_in_file: 'primary' | 'secondary';
  status: FileStatus;
}

export interface EmployeeMetrics {
  employeeId: string;
  name: string;
  section: Section;
  totalAssigned: number;
  completed: number;
  pending: number;
  overdue: number;
  inProgress: number;
  completionRate: number;       // completed / totalAssigned
  overdueRate: number;          // overdue / totalAssigned
  avgProcessingDays: number;    // avg days from received to completed
  onTimeRate: number;           // completed before due_date / completed
  productivityScore: number;    // composite 0–100
  performanceTier: 'excellent' | 'good' | 'average' | 'poor';
}

export interface SectionMetrics {
  section: Section;
  totalFiles: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  avgProcessingDays: number;
  employeeCount: number;
  filesPerEmployee: number;
  sectionScore: number;
}

export interface JWTPayload {
  userId: string;
  username: string;
  role: Role;
  name: string;
  section: Section;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

---

## 5. Core Metric Computations (`lib/metrics.ts`)

Implement these exact formulas:

```typescript
// Productivity Score (0–100 composite)
productivityScore =
  (completionRate * 40) +
  (onTimeRate * 30) +
  ((1 - overdueRate) * 20) +
  (speedBonus * 10); // speedBonus = 1 if avgProcessingDays < section median

// Performance Tier
if (score >= 80)  → 'excellent'
if (score >= 60)  → 'good'
if (score >= 40)  → 'average'
else              → 'poor'

// Section Score
sectionScore =
  (sectionCompletionRate * 50) +
  (sectionOnTimeRate * 30) +
  ((1 - sectionOverdueRate) * 20)

// Overdue detection
isOverdue = status !== 'completed' && new Date(due_date) < new Date()
```

Export these functions:
- `computeEmployeeMetrics(files, assignments, users): EmployeeMetrics[]`
- `computeSectionMetrics(files, users): SectionMetrics[]`
- `getUnderperformers(metrics: EmployeeMetrics[], threshold = 40): EmployeeMetrics[]`
- `getTopPerformers(metrics: EmployeeMetrics[], n = 5): EmployeeMetrics[]`
- `detectAnomalies(metrics): { employee: EmployeeMetrics; reason: string }[]`
  - Flags: sudden drop in completion rate, unusually high overdue count, zero completions in 30 days

---

## 6. Authentication (`lib/auth.ts` + `middleware.ts`)

```typescript
// lib/auth.ts
// Use `jose` (not jsonwebtoken — edge-compatible)
// signJWT(payload: JWTPayload): Promise<string>
// verifyJWT(token: string): Promise<JWTPayload>
// Cookie name: 'forest_session', HttpOnly, SameSite=Strict

// middleware.ts
// Protected: /dashboard/*, /admin/*, /api/* (except /api/auth/login)
// Admin-only: /admin/*, /api/admin/*
// Redirect unauthenticated → /login
// Redirect non-admin to /dashboard if accessing /admin
```

Password handling: use **bcryptjs** for hashing (avoid native bcrypt for deployment simplicity).

---

## 7. API Route Handlers

### `POST /api/auth/login`
- Body: `{ username, password }`
- Read `users.csv`, find user, compare bcrypt hash
- On success: sign JWT, set HttpOnly cookie, return `{ user: JWTPayload }`
- On fail: 401 with `{ error: 'Invalid credentials' }`

### `GET /api/metrics`
- Reads all 3 CSV files, runs `computeEmployeeMetrics` + `computeSectionMetrics`
- Returns `{ employees: EmployeeMetrics[], sections: SectionMetrics[], underperformers, topPerformers, anomalies }`
- If employee role: filter to return only own metrics + section aggregates

### `GET /api/employees` / `GET /api/employees/[id]`
- Admin: returns all users (minus password_hash)
- Employee: returns own profile only

### `GET /api/files`
- Query params: `?section=`, `?status=`, `?assigned_to=`, `?from=`, `?to=`
- Returns filtered FileRecord[]
- Employee role: only own assigned files

### `POST /api/files`
- Admin only
- Validates body with Zod, appends row to CSV

### `POST /api/chat`
- Body: `{ messages: ChatMessage[], context?: 'employee' | 'section' | 'overview' }`
- Builds system prompt with current metrics data as context (inject JSON summary)
- Calls Claude claude-sonnet-4-20250514 with streaming
- Returns streamed response

### `POST /api/llm-summary`
- Body: `{ type: 'employee' | 'section' | 'overview', id?: string }`
- Fetches relevant metrics, builds structured prompt
- Returns: `{ summary: string, suggestions: string[], riskFlags: string[] }`

### `GET /api/admin/users` / `POST /api/admin/users` / `PUT /api/admin/users/[id]` / `DELETE /api/admin/users/[id]`
- Full CRUD on `users.csv` — admin token verified

---

## 8. Pages & Components

### Login Page (`/login`)
- Forest-green themed, government aesthetic
- Logo: 🌲 "Forest eOffice" wordmark
- Username + password fields with Zod validation
- On success: redirect to `/dashboard`

### Dashboard (`/dashboard`)
Layout: **Sidebar (fixed, 240px) + Main content area**

**Sidebar links:**
- Dashboard (overview)
- Employees
- Sections
- File Analytics
- Reports
- Chatbot
- Admin (admin only, separator)

**Main Dashboard sections:**

#### KPI Cards row (4 cards):
1. Total Files Processed (month)
2. Avg Completion Rate (%)
3. Overdue Files Count (red badge if > threshold)
4. Active Employees

#### Charts row 1:
- `ProductivityBarChart`: X = employee name, Y = productivityScore, color-coded by tier
- `FileVolumeLineChart`: X = date (monthly), Y = files received vs completed — dual line

#### Charts row 2:
- `SectionRadarChart`: 6-axis radar (one per section), metric = sectionScore
- `PendingVsCompletedChart`: Stacked bar per section

#### Underperformer Alert Panel:
- Red-bordered card listing employees with `performanceTier === 'poor'`
- Shows name, score, top issue (e.g. "67% overdue rate")
- "View Profile" button per row

#### Recent Activity Feed:
- Last 10 file status changes (derived from completed_date sort)

### Employee Detail (`/employees/[id]`)
- Profile header: name, designation, section, joining date
- Metric cards: completion rate, on-time rate, overdue rate, avg processing days
- `PerformanceBadge`: color-coded tier pill
- Line chart: monthly completions over last 6 months
- File table: all assigned files with status filters
- **LLM Summary card**: "Generate AI Summary" button → calls `/api/llm-summary` → renders summary + bullet suggestions

### Section Detail (`/sections/[section]`)
- Section scorecard
- Employee breakdown table (all employees in section, sorted by score)
- Comparison bar chart vs other sections
- LLM summary for section

### Chatbot (`/chatbot`)
Full-page chat interface:
- Chat window with message bubbles (user = right, assistant = left)
- Suggested starter prompts:
  - "Who are the underperformers this month?"
  - "Which section has the most overdue files?"
  - "Give me a summary of Ramesh's performance"
  - "What are the top 3 bottlenecks?"
- Input bar with send button
- Streaming response support (use `ReadableStream`)
- Context selector: "Overview" | "My Section" | "My Profile" (changes system prompt focus)

**LLM system prompt template:**
```
You are a productivity analyst assistant for the Forest Department eOffice system.
You have access to the following data:
<metrics>
{JSON.stringify(metricsContext)}
</metrics>
Answer questions about employee performance, file processing, and section productivity.
Be concise, data-driven, and suggest actionable improvements.
Use Indian government office terminology where appropriate.
```

### Admin Panel (`/admin`)
Tabs:
1. **Users** — DataTable of all users with add/edit/delete. Password reset option.
2. **Data Manager** — Upload new CSV, preview changes, confirm import
3. **File Records** — Full CRUD table for `forest_eoffice_data.csv`
4. **Settings** — LLM API key config (reads from env, shows masked), performance thresholds config (persisted to a `settings.json`)

---

## 9. Visual Design System

**Theme:** Government forest department — authoritative yet modern

```css
/* Tailwind config extension */
colors: {
  forest: {
    50:  '#f0faf0',
    100: '#d6f0d6',
    200: '#aadaaa',
    300: '#74bc74',
    400: '#4a9e4a',
    500: '#2e7d2e',   /* primary */
    600: '#236023',
    700: '#1a461a',
    800: '#122e12',
    900: '#0a1a0a',
  },
  khaki: '#c8b76a',   /* accent */
  bark:  '#8b6914',   /* secondary accent */
}
```

**Typography:**
- Display / headings: `Crimson Pro` (serif) — authoritative, governmental
- Body / UI: `IBM Plex Sans` — clean, technical
- Monospace / data: `JetBrains Mono` — metrics and numbers

**Performance tier colors:**
- Excellent: `#16a34a` (green-600)
- Good: `#2563eb` (blue-600)
- Average: `#d97706` (amber-600)
- Poor: `#dc2626` (red-600)

---

## 10. Environment Variables (`.env.local`)

```env
ANTHROPIC_API_KEY=your_key_here
JWT_SECRET=your_jwt_secret_min_32_chars
ADMIN_TOKEN=supersecret123
NODE_ENV=development
```

---

## 11. CSV Utilities (`lib/csv.ts`)

```typescript
// All CSV ops run server-side only (Node.js fs)
// Path: process.cwd() + '/data/' + filename

readCSV<T>(filename: string): Promise<T[]>
  // Uses papaparse.parse with header: true, skipEmptyLines: true

writeCSV<T>(filename: string, data: T[]): Promise<void>
  // Uses papaparse.unparse, writes with fs.writeFileSync

appendCSVRow<T>(filename: string, row: T): Promise<void>
updateCSVRow<T>(filename: string, idField: keyof T, id: string, updates: Partial<T>): Promise<void>
deleteCSVRow<T>(filename: string, idField: keyof T, id: string): Promise<void>
```

> **Important:** CSV reads/writes happen in Route Handlers only (never in Client Components). Use Server Actions or fetch to API routes from the client.

---

## 12. Key Implementation Notes

1. **No database** — all persistence is CSV files under `/data`. Use file locking pattern for writes (read → mutate → write atomically).

2. **Metrics are computed on every request** — no caching layer needed at this scale. If response time is slow, add `unstable_cache` from Next.js.

3. **Role-based UI** — use a `useCurrentUser()` hook (reads from `/api/auth/me`) to conditionally render admin elements.

4. **Streaming chatbot** — use `new Response(stream)` with `ReadableStream` in the chat route handler. On the client, use `fetch` with `response.body.getReader()` and append chunks to state.

5. **File overdue detection** — run on every metrics fetch. Don't store overdue status in CSV; compute dynamically from `due_date` vs `now`.

6. **Seeding** — create a `scripts/seed.ts` that generates 100+ realistic file records and 5 users with bcrypt-hashed passwords, and writes to CSVs.

7. **Export** — Reports page: "Export to CSV" button (downloads filtered data via a data URL) and a print-friendly view with `@media print` styles.

8. **Mobile responsiveness** — Sidebar collapses to hamburger menu on `< md` breakpoint. Charts use `ResponsiveContainer` from Recharts.

---

## 13. Sample Data Guidelines (for seed script)

Generate records that create interesting productivity patterns:
- Ramesh: high performer, 85%+ completion rate, mostly on time
- Sita: average, ~60% completion, some overdue
- Ajay: underperformer, 35% completion, many overdue files
- Pooja: improving trend — poor 3 months ago, good now
- Wildlife section: best performing
- Administration section: most backlog

Distribute ~120 files across 12 months, across all sections and priorities.

---

## 14. Deliverables Checklist

- [ ] Full Next.js 14+ App Router project (TypeScript)
- [ ] All CSV utilities with read/write/append/update/delete
- [ ] JWT auth with middleware route protection
- [ ] All 8 API route handlers
- [ ] Dashboard with 4 KPI cards + 4 charts
- [ ] Employee list + detail pages
- [ ] Section list + detail pages
- [ ] File analytics page with filters
- [ ] Admin panel (users CRUD + data management)
- [ ] Chatbot with streaming LLM responses
- [ ] LLM summary cards on employee/section pages
- [ ] Underperformer alert system
- [ ] Seed script with realistic data
- [ ] `.env.local.example` with all required variables
- [ ] `README.md` with setup instructions
