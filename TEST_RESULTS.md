# HireMind — Test Results

**Tester:** [Your name]  
**Date:** [Today’s date]  
**Environment:** Windows, Python 3.11+, Node.js, Chrome  
**Backend:** `uvicorn app.main:app --reload --port 8000`  
**Frontend:** `VITE_API_MODE=live`, `npm run dev`

---

## 1. Automated tests

### Backend (pytest)

```powershell
cd backend
.\.venv\Scripts\activate
pip install pytest
pytest -q
```

| Result | Notes |
|--------|--------|
| [x] Pass | 2 tests, 2026-10-04 |

```
..                                                                       [100%]
2 passed in 0.57s
```

### Frontend build

```powershell
cd frontend
npm run build
```

| Result | Notes |
|--------|--------|
| [x] Pass | `tsc -b && vite build` succeeded |

---

## 2. Manual functional tests

| ID | Test case | Steps | Expected | Actual | Pass? |
|----|-----------|-------|----------|--------|-------|
| T1 | Login | Demo credentials | Dashboard loads | | [ ] |
| T2 | List jobs | Open Jobs | ≥1 job visible | | [ ] |
| T3 | Job requirements | Open job → Overview | Skills/requirements shown | | [ ] |
| T4 | Workflow save | Builder → Save valid graph | Success message | | [ ] |
| T5 | List candidates | Job → Candidates | Table with ranks/scores | | [ ] |
| T6 | AI report | View candidate | Pipeline + interview Q | | [ ] |
| T7 | Create job | New job form | Appears in list | | [ ] |
| T8 | Logout/login | Logout then login | Same data visible | | [ ] |
| T9 | Persistence | Restart backend only | Data unchanged | | [ ] |
| T10 | Swagger | `/docs` + Authorize JWT | `/jobs` returns 200 | | [ ] |

---

## 3. API smoke (Swagger or curl)

| Endpoint | Method | Pass? |
|----------|--------|-------|
| `/health` | GET | [ ] |
| `/auth/login` | POST | [ ] |
| `/auth/me` | GET | [ ] |
| `/jobs` | GET | [ ] |
| `/dashboard/stats` | GET | [ ] |
| `/jobs/{id}/workflow` | GET | [ ] |
| `/candidates/{id}/report` | GET | [ ] |

---

## 4. Known limitations (documented)

- Mock/rule-based agents (`LLM_MODE=mock`)
- Simplified resume text extraction
- Change password / forgot password not on live API
- SQLite for development only

---

## 5. Sign-off

I confirm the above tests were executed on the stated date.

**Signature:** ___________________  
**Date:** ___________________
