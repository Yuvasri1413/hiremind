# Backend Build Progress

Step-by-step module plan for the HireMind FastAPI backend.

| Module | Scope | Status |
|--------|-------|--------|
| **0** | Project setup (FastAPI, config, health check) | ✅ Done |
| **1** | Auth — register, login, JWT, `/auth/me` | ✅ Done |
| **2** | Jobs CRUD + extracted requirements (mock JD processor) | ✅ Done |
| **3** | Workflows — save/load pipeline per job | ✅ Done |
| **4** | Candidates — upload, list, pipeline status | ✅ Done |
| **5** | AI agents + orchestrator | ✅ Done |
| **6** | Dashboard stats API | ✅ Done |
| **7** | Frontend API integration | ✅ Done |

## Run locally

```bash
# Terminal 1 — backend
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend (live mode)
cd frontend
# Set VITE_API_MODE=live in .env
npm run dev
```

- API: http://localhost:8000/docs
- Frontend: http://localhost:5173
- Demo login: `recruiter@hiremind.com` / `password123`

## Module 7 — Frontend integration (complete)

Frontend `VITE_API_MODE=live` connects to this backend via `frontend/src/api/live/`.

| Frontend service | Backend endpoints |
|------------------|-------------------|
| Auth | `/auth/login`, `/auth/register`, `/auth/me` |
| Jobs | `/jobs`, `/jobs/{id}` |
| Dashboard stats | `/dashboard/stats` |
| Candidates | `/jobs/{id}/candidates`, `/candidates/{id}` |
| Workflows | `/jobs/{id}/workflow` |
| Requirements | `/jobs/{id}` (requirements field) |
| Candidate reports | `/candidates/{id}/report` |
| Upload + process | `/jobs/{id}/candidates/upload`, `/jobs/{id}/candidates/process` |

JWT stored in `localStorage` as `hiremind_access_token`.

## All backend modules complete

See git history and prior module sections for endpoint details per feature area.
