# Frontend Build Progress

Step-by-step module plan for the Recruitment AI frontend.

| Module | Scope | Status |
|--------|-------|--------|
| **0** | Project setup (Vite, React, TS, MUI, Router) | ✅ Done |
| **1** | Auth — Login & Register + dark/light theme | ✅ Done |
| **2** | App shell — AppBar, sidebar, layout | ✅ Done |
| **3** | Dashboard — stats cards, recent jobs | ✅ Done |
| **4** | Jobs list & Create job form | ⏳ Next |
| **5** | Job detail — Overview tab (JD + requirements) | Pending |
| **6** | Job detail — Upload tab | Pending |
| **7** | Candidates list | Pending |
| **8** | Candidate detail (AI report) | Pending |
| **9** | Workflow builder (React Flow) | Pending |

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Module 2 — App shell

- `AppLayout` — AppBar + permanent sidebar + main content area
- `Sidebar` — Dashboard & Jobs navigation with active state
- `UserMenu` — avatar dropdown with logout
- Theme toggle in AppBar (auth pages keep fixed toggle)
- Responsive mobile drawer

## Module 3 — Dashboard

- 3 stat cards (Total Jobs, Candidates, Avg Score)
- Recent jobs table with status chips & score badges
- Mock data (`src/data/mockDashboard.ts`)
- `/jobs` placeholder page for sidebar nav
