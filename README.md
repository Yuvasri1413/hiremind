# HireMind — AI Recruitment Workflow Platform

**MCA project:** AI-based recruitment workflow orchestration platform using agentic AI.

**Repository:** https://github.com/Yuvasri1413/hiremind  
**Release tag:** `v0.3-fullstack`

## What is built

| Layer | Status |
|-------|--------|
| Frontend (React, modules 0–9) | Complete |
| Backend (FastAPI, modules 0–7) | Complete |
| Live integration (`VITE_API_MODE=live`) | Complete |
| SQLite persistence + sample seed data | Complete |

Features: recruiter auth (JWT), jobs CRUD, JD requirement extraction, visual workflow builder, resume upload, multi-agent pipeline (parse → screen → match → evaluate → rank → interview), dashboard, candidate AI reports.

## Project structure

```
1phase/
├── PROJECT_REQUIREMENTS.md      # SRS
├── ARCHITECTURE.md
├── FRONTEND_DESIGN.md
├── MCA_PROJECT_REPORT_CONTENT.md # Copy into college report PDF
├── FIRST_REVIEW_REPORT.md
├── USER_MANUAL.md               # How to use the app
├── SUBMISSION_TODAY.md          # One-day completion checklist
├── TEST_RESULTS.md              # Manual + automated test log
├── PRESENTATION_OUTLINE.md      # Slides + viva demo script
├── frontend/                    # React + TypeScript + MUI
└── backend/                     # FastAPI + SQLAlchemy + SQLite
```

## Run locally (Windows)

### 1. Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

- Health: http://localhost:8000/health  
- Swagger: http://localhost:8000/docs  
- Database file: `backend/hiremind.db` (created automatically; persists after restart)

### 2. Frontend (live mode)

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_MODE=live
VITE_API_BASE_URL=http://localhost:8000
```

```powershell
npm run dev
```

Open http://localhost:5173

### Demo login

| Email | Password |
|-------|----------|
| `recruiter@hiremind.com` | `password123` |

Sample jobs, candidates, workflows, and scores are seeded on backend startup (per recruiter account).

## Mock mode (no backend)

In `frontend/.env` set `VITE_API_MODE=mock`. Data stays in browser localStorage.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| UI | Material UI (MUI), React Flow |
| Backend | Python 3.11+, FastAPI |
| ORM / DB | SQLAlchemy 2, SQLite (dev) |
| Auth | JWT (HS256), bcrypt |
| API docs | OpenAPI / Swagger |

## Testing

```powershell
cd backend
.\.venv\Scripts\activate
pip install pytest
pytest -q
```

```powershell
cd frontend
npm run build
```

See [TEST_RESULTS.md](./TEST_RESULTS.md).

## Documentation

- [User manual](./USER_MANUAL.md)
- [Report content for PDF](./MCA_PROJECT_REPORT_CONTENT.md)
- [Frontend modules](./frontend/FRONTEND_MODULES.md)
- [Backend modules](./backend/BACKEND_MODULES.md)
- [Today’s submission checklist](./SUBMISSION_TODAY.md)
- [Presentation outline](./PRESENTATION_OUTLINE.md)

## Limitations (for viva)

- AI agents use **mock/rule-based** logic in development (`LLM_MODE=mock`); architecture supports real LLM APIs.
- Resume parsing is simplified for demo; production would use PDF/DOCX text extraction.
- Recruiter-only app; no candidate portal or email notifications in scope.

## License / academic use

MCA final-year project — for academic evaluation and demonstration.
