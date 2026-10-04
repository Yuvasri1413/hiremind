# HireMind — User Manual (Recruiter)

## 1. Getting started

1. Start the **backend** (port 8000) and **frontend** (port 5173). See [README.md](./README.md).
2. Open http://localhost:5173 in Chrome or Edge.
3. **Register** a new account or use the demo: `recruiter@hiremind.com` / `password123`.

Data is saved in `backend/hiremind.db`. Logout clears only your session token; jobs and candidates remain after restart.

## 2. Login and logout

- **Login:** Enter email and password → Dashboard opens.
- **Logout:** User menu (top right) → Logout.

## 3. Dashboard

Shows:

- Total jobs, total candidates, average score
- Recent jobs — click a row to open the job

Use **Create job** to add a new opening.

## 4. Jobs list

- **Search** by title or location.
- **Filter** by status: open, closed, draft, or all.
- **Actions:** View, Edit, Delete.
- **Create job:** Title, description, location, experience range, status.

Sample jobs (if seeded): Backend Developer, Frontend Developer, Data Analyst, DevOps Engineer, UI Designer.

## 5. Job detail — Overview

- Job description and metadata
- **Extracted requirements** (skills, education, responsibilities) from the JD

Use **Re-process JD** if you change the description (when available on the page).

## 6. Job detail — Workflow

- Preview of the hiring pipeline
- **Open Workflow Builder** for the full canvas

Default pipeline: **Parse → Screen → Skill Match → Evaluate → Rank → Interview**

In the builder:

- Drag nodes from the palette
- Connect nodes in order
- Configure thresholds in the side drawer
- **Save** — validation requires a Parse node, no cycles, connected graph

## 7. Job detail — Upload

- Select PDF/DOC/DOCX resumes
- **Upload** — creates candidates with status `pending`
- **Process candidates** — runs the AI pipeline for selected or all pending candidates

After processing, open the **Candidates** tab for ranks and scores.

## 8. Job detail — Candidates

Table of candidates with status, rank, match score, overall score.

- **View** — opens the full **AI report** page

Statuses include: pending, parsing, screening, completed, filtered_out, etc.

## 9. Candidate AI report

Shows:

- Rank and composite scores
- **Pipeline progress** across stages
- Parsed profile, screening, skill match (matched/missing skills)
- Evaluation recommendation
- Generated interview questions (technical, behavioral, gap-probing)

Use this page to justify shortlisting in demos and viva.

## 10. API (optional)

Developers and evaluators can test REST APIs at http://localhost:8000/docs after login via **Authorize** with the JWT from login.

## 11. Troubleshooting

| Problem | Solution |
|---------|----------|
| Empty jobs list | Backend running? `VITE_API_MODE=live`? Logged in? Refresh after login. |
| Network error | Check `VITE_API_BASE_URL=http://localhost:8000` |
| CORS error | In `backend/.env`, include `http://localhost:5173` in `CORS_ORIGINS` |
| Lost data | Do not delete `hiremind.db`; back it up before OS reinstall |

## 12. Backup before viva

Copy to a safe folder:

- `backend/hiremind.db`
- `backend/uploads/` (if you uploaded real files)
