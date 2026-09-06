# HireMind — AI Recruitment Workflow Platform

MCA project: AI-based recruitment workflow orchestration platform using agentic AI.

## Project structure

```
1phase/
├── PROJECT_REQUIREMENTS.md   # SRS / functional requirements
├── ARCHITECTURE.md           # System architecture
├── FRONTEND_DESIGN.md        # UI/UX design & flows
├── frontend/                 # React + TypeScript + MUI app (modules 0–9 ✅)
└── backend/                  # FastAPI API (modules 0–1 ✅)
```

## Frontend (complete — modules 0–9)

Auth, dashboard, jobs, job detail (overview/upload/candidates/workflow), candidate AI report, workflow builder.

See [Frontend Modules Progress](./frontend/FRONTEND_MODULES.md)

### Run locally

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Backend (in progress)

- **Module 0–1:** FastAPI setup, auth (register/login/me), JWT, SQLite dev DB

See [Backend Modules Progress](./backend/BACKEND_MODULES.md)

### Run locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs

## Tech stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React, TypeScript, Vite |
| UI       | MUI (Material UI)       |
| Backend  | FastAPI (planned)       |
| Database | PostgreSQL (planned)    |

## Documentation

- [Project Requirements](./PROJECT_REQUIREMENTS.md)
- [Architecture](./ARCHITECTURE.md)
- [Frontend Design](./FRONTEND_DESIGN.md)
- [Frontend Modules Progress](./frontend/FRONTEND_MODULES.md)
- [Backend Modules Progress](./backend/BACKEND_MODULES.md)
