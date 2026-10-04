# HireMind — Full demo setup (step-by-step)

Follow every step **in order** before your professor demo.

---

## Part A — One-time setup (first time only)

### Step 1: Install backend dependencies

```powershell
cd "d:\project mca\1phase\backend"
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Backend environment file

```powershell
copy .env.example .env
```

Default `.env` is enough (SQLite, CORS for `http://localhost:5173`).

### Step 3: Install frontend dependencies

```powershell
cd "d:\project mca\1phase\frontend"
npm install
```

### Step 4: Frontend environment file

File `frontend/.env` must contain:

```env
VITE_API_MODE=live
VITE_API_BASE_URL=http://localhost:8000
```

If you change `.env`, restart `npm run dev`.

### Step 5: Backup database (recommended before viva)

Copy `backend/hiremind.db` to a safe folder. Demo data lives in this file.

---

## Part B — Every demo day (30 minutes before)

### Step 6: Start the backend (Terminal 1)

```powershell
cd "d:\project mca\1phase\backend"
.\.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Check:** Open http://localhost:8000/health  
You should see: `"status":"ok"`

**Check:** Open http://localhost:8000/docs (Swagger — optional for demo)

Leave this terminal **open**.

### Step 7: Start the frontend (Terminal 2)

```powershell
cd "d:\project mca\1phase\frontend"
npm run dev
```

**Check:** Browser opens or go to http://localhost:5173

Leave this terminal **open**.

### Step 8: Login

Use the **demo account** (best data: jobs + candidates + scores):

| Field | Value |
|-------|-------|
| Email | `recruiter@hiremind.com` |
| Password | `password123` |

Or use your own registered email — sample jobs are seeded if the account had none.

**Do not use** Change password in live mode (not implemented on API).

### Step 9: Confirm data loaded

1. **Dashboard** — total jobs & candidates > 0  
2. **Jobs** — at least 5 sample titles (Backend, Frontend, Data Analyst, DevOps, UI Designer)  
3. If empty: backend running? Logged in? Hard refresh (Ctrl+F5). Restart backend once to re-seed.

---

## Part C — Live demo script (10 minutes)

Do this path **in order** while explaining.

| Step | Screen | What to say (short) |
|------|--------|---------------------|
| 1 | Dashboard | KPIs from SQLite; recruiter-specific data |
| 2 | Jobs | CRUD + sample job openings |
| 3 | Open **Backend Developer** | Job description + **auto-extracted requirements** |
| 4 | Tab **Workflow** → **Open Workflow Builder** | Custom **agentic pipeline** per job |
| 5 | Show nodes: Parse → Screen → Match → Evaluate → Rank → Interview | Six specialized agents |
| 6 | **Save** workflow (if you edited) | Validation ensures valid graph |
| 7 | Tab **Candidates** | Rankings and scores after orchestrator |
| 8 | **View** top candidate | Full **AI report**: stages + interview questions |
| 9 | (Optional) Tab **Upload** → select a PDF → Upload → Process | End-to-end automation |
| 10 | Browser tab http://localhost:8000/docs | REST API for integration |

---

## Part D — If something fails

| Problem | Fix |
|---------|-----|
| Blank jobs / network error | Backend not running → Step 6 |
| CORS error in console | `backend/.env`: `CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173` |
| 401 / logged out | Login again (Step 8) |
| Frontend shows mock data | `VITE_API_MODE=live` in `frontend/.env`, restart `npm run dev` |
| Port 8000 busy | Stop other app or use `--port 8001` and set `VITE_API_BASE_URL` to match |
| Slow first load | Normal; wait for dashboard |

---

## Part E — What “full-fledged demo” means (be honest in viva)

**You demonstrate:**

- Full-stack integration (React + FastAPI + SQLite)  
- Security (JWT login, data per recruiter)  
- Workflow orchestration + multi-agent pipeline  
- Persistent data after logout/restart  

**You clarify:**

- AI agents use **mock/rule-based** logic for reliable demos (`LLM_MODE=mock`)  
- Architecture supports real LLM later  
- Not a commercial ATS (no candidate portal / email)  

---

## Part F — Shutdown after demo

1. Stop frontend (Ctrl+C in Terminal 2)  
2. Stop backend (Ctrl+C in Terminal 1)  
3. Data remains in `backend/hiremind.db` for next time  

---

## Quick checklist (print this)

- [ ] Terminal 1: backend on :8000, `/health` OK  
- [ ] Terminal 2: frontend on :5173  
- [ ] Logged in as demo user  
- [ ] Dashboard shows stats  
- [ ] Jobs list not empty  
- [ ] One AI report opens  
- [ ] Slides + report PDF ready (optional)  

Done — you are ready to present.
