# Backend Build Progress

Step-by-step module plan for the HireMind FastAPI backend.

| Module | Scope | Status |
|--------|-------|--------|
| **0** | Project setup (FastAPI, config, health check) | ✅ Done |
| **1** | Auth — register, login, JWT, `/auth/me` | ✅ Done |
| **2** | Jobs CRUD + extracted requirements (mock JD processor) | ⏳ Next |
| **3** | Workflows — save/load pipeline per job | Pending |
| **4** | Candidates — upload, list, pipeline status | Pending |
| **5** | AI agents + orchestrator | Pending |
| **6** | Dashboard stats API | Pending |
| **7** | Frontend API integration | Pending |

## Run locally

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env   # edit JWT_SECRET for production

uvicorn app.main:app --reload --port 8000
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Module 1 — Auth (current)

- `POST /auth/register` — create recruiter account
- `POST /auth/login` — returns JWT access token
- `GET /auth/me` — current user profile (Bearer token)
- Passwords hashed with bcrypt · JWT HS256 · SQLite dev database

## Module 0 — Setup

- FastAPI app with CORS for `http://localhost:5173`
- SQLAlchemy + configurable `DATABASE_URL`
- Pydantic settings from `.env`
