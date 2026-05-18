# Forest eOffice Productivity Monitoring System

Next.js App Router project for monitoring Forest Department employee productivity, file disposal, section performance, and AI-generated summaries using CSV-backed storage.

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- CSV persistence with `papaparse`
- JWT auth with `jose` and HttpOnly cookies
- `bcryptjs` password hashing
- Recharts dashboards
- Anthropic Claude integration with a local fallback path when no API key is configured

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment variables:

```bash
copy .env.local.example .env.local
```

3. Set at minimum:

- `JWT_SECRET` to a 32+ character value
- `ANTHROPIC_API_KEY` if you want real Claude summaries and chat

4. Optional but recommended: reseed the CSV data with hashed passwords and a 100+ file dataset.

```bash
npm run seed
```

Default seeded password: `forest@123`

5. Start the app:

```bash
npm run dev
```

## Current Structure

- `app/` route groups for auth, dashboard, admin, and API handlers
- `components/` shared UI, charts, dashboard widgets, chatbot, employees, and admin tools
- `lib/` CSV utilities, metrics engine, auth, LLM wrapper, server-data helpers, settings persistence
- `data/` CSV and JSON storage
- `scripts/seed.ts` deterministic seed script with realistic productivity patterns

## Implemented Features

- Login/logout/session routes with JWT cookie issuance
- Route protection via middleware
- CSV read/write/append/update/delete helpers
- Employee and section metrics computation
- Dashboard overview with KPI cards, charts, underperformer alerts, top performers, and recent activity
- Employee list and employee detail with AI summary panel
- Section list and section detail with comparison chart and AI summary panel
- File analytics filters
- Reports page with CSV export and print support
- Chat interface with streaming route and fallback summarization
- Admin users CRUD, data preview, and settings persistence

## Notes

- The checked-in CSV data is usable for layout and API testing. Running `npm run seed` replaces placeholder password fields with bcrypt hashes and generates a larger sample dataset.
- When `ANTHROPIC_API_KEY` is not configured, chat and summary routes still respond using deterministic local summaries so the UI remains functional.
- CSV writes use a temp-file replace pattern for atomic updates in a single-process deployment model.
