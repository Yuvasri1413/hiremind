# Frontend Build Progress

Step-by-step module plan for the HireMind frontend.

| Module | Scope | Status |
|--------|-------|--------|
| **0** | Project setup (Vite, React, TS, MUI, Router) | ✅ Done |
| **1** | Auth — Login & Register + dark/light theme | ✅ Done |
| **2** | App shell — AppBar, sidebar, layout | ✅ Done |
| **3** | Dashboard — stats cards, recent jobs | ✅ Done |
| **4** | Jobs list, create/edit modals, view job | ✅ Done |
| **5** | Job detail — Overview tab (JD + requirements) | ✅ Done |
| **6** | Job detail — Upload tab | ✅ Done |
| **7** | Candidates list | ✅ Done |
| **8** | Candidate detail (AI report) | ✅ Done |
| **9** | Workflow builder (React Flow) | ✅ Done |

**Frontend MVP complete.** Switch between mock and live API with `VITE_API_MODE` in `.env`.

## API modes

| Mode | Env | Data source |
|------|-----|-------------|
| **mock** (default) | `VITE_API_MODE=mock` | localStorage |
| **live** | `VITE_API_MODE=live` | FastAPI backend at `VITE_API_BASE_URL` |

### Live mode setup

```bash
# Terminal 1
cd backend && .venv\Scripts\uvicorn app.main:app --reload --port 8000

# Terminal 2
cd frontend
# .env: VITE_API_MODE=live
npm run dev
```

Login with demo account: `recruiter@hiremind.com` / `password123`

## Mock / Live API layer

All data flows go through `src/api` — implemented in `src/api/live/` for production.

| Service | Mock | Live |
|---------|------|------|
| Auth | localStorage | `/auth/*` |
| Jobs | localStorage | `/jobs/*` |
| Dashboard stats | computed from jobs | `/dashboard/stats` |
| Candidates | seed data | `/jobs/:id/candidates` |
| Workflows | localStorage | `/jobs/:id/workflow` |
| Uploads | localStorage | `/jobs/:id/candidates/upload` + `/process` |
| Requirements | mock AI extract | `/jobs/:id` |
| Candidate reports | mock AI report | `/candidates/:id/report` |

Copy `frontend/.env.example` to `frontend/.env` (defaults to mock mode).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

## Module 9 — Workflow builder (complete)

- `@xyflow/react` — visual pipeline canvas
- `WorkflowBuilderPage` at `/jobs/:jobId/workflow` — palette, canvas, config drawer, save
- `JobWorkflowTab` — embedded preview + **Open Workflow Builder**
- Node types: Parse, Screen, Skill Match, Evaluate, Rank, Interview (color-coded)
- Config drawer: thresholds, weights, interview question counts
- Validation: requires Parse node, no cycles, all nodes connected
- Workflows persisted per job in `localStorage`

## Module 8 — Candidate detail

- `CandidateDetailPage` — full AI report with rank, score, and status header
- `PipelineProgress` — Parse → Screen → Match → Eval → Rank → Interview
- Stage cards: Parsed Profile, Screening, Skill Match, Evaluation
- `InterviewQuestionsSection` — Technical / Behavioral / Gap Probing tabs
- Route: `/candidates/:candidateId`

## Module 7 — Candidates list

- `JobCandidatesTab` — search, status filter, sort, view action
- Route: `/candidates/:candidateId`

## Routes summary

| Route | Page |
|-------|------|
| `/dashboard` | Dashboard |
| `/jobs` | Jobs list |
| `/jobs/:jobId` | Job detail (tabs) |
| `/jobs/:jobId/workflow` | Workflow builder |
| `/candidates/:candidateId` | Candidate AI report |
