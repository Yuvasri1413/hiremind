# Complete HireMind submission — one-day plan

Use this checklist **in order**. Check each box when done.

---

## Morning (9:00–12:00) — System + evidence

- [ ] **9:00** Start backend + frontend; confirm demo login and 5 jobs visible
- [ ] **9:20** Run full demo path once (dashboard → job → workflow → candidates → AI report)
- [ ] **9:45** Backup `backend/hiremind.db` to `project-backup/`
- [ ] **10:00** Terminal: `cd backend` → `pytest -q` (paste output into TEST_RESULTS.md)
- [ ] **10:15** Terminal: `cd frontend` → `npm run build` (note Pass in TEST_RESULTS.md)
- [ ] **10:30–11:30** **Screenshots** (save as `screenshots/01-login.png` … `10-swagger.png`):
  1. Login page  
  2. Dashboard  
  3. Jobs list  
  4. Job overview + requirements  
  5. Workflow builder  
  6. Upload tab  
  7. Candidates table  
  8. Candidate AI report  
  9. Workflow tab preview  
  10. Swagger `/docs`  
- [ ] **11:30** Fill manual test table in [TEST_RESULTS.md](./TEST_RESULTS.md) (all Pass)

---

## Afternoon (12:00–16:00) — Report PDF

- [ ] **12:00** Open [MCA_PROJECT_REPORT_CONTENT.md](./MCA_PROJECT_REPORT_CONTENT.md)
- [ ] **12:15** Replace all `[Your Name]`, roll, guide, college, dates
- [ ] **12:30–14:00** Paste sections into college Word/PDF template:
  - Abstract, Introduction, Problem, Objectives, Scope  
  - System design (architecture + DB tables from report §7)  
  - Implementation / modules (§9)  
  - Testing (§10 + your TEST_RESULTS.md)  
  - Conclusion + Future work (§12–13)  
- [ ] **14:00–15:00** Insert all screenshots with captions (§11)
- [ ] **15:00** Add GitHub link + tag `v0.3-fullstack`
- [ ] **15:30** Spell-check; export **Project Report PDF**

---

## Evening (16:00–20:00) — Presentation + repo

- [ ] **16:00** Build slides from [PRESENTATION_OUTLINE.md](./PRESENTATION_OUTLINE.md) (8–12 slides)
- [ ] **17:00** Rehearse **10-minute demo** with timer (script in PRESENTATION_OUTLINE.md)
- [ ] **17:30** Read viva Q&A section once aloud
- [ ] **18:00** `git status` — commit code/docs (do **not** commit `.env`, `*.db`, `uploads/`)
- [ ] **18:30** Push to GitHub if remote is set
- [ ] **19:00** Print or save: Report PDF + slide deck + USER_MANUAL.pdf (optional)
- [ ] **19:30** Final dry run: cold start PC → start servers → demo in &lt; 3 min

---

## What you submit to professor (typical MCA)

1. **Project report** (PDF)  
2. **Source code** (GitHub link or CD/USB)  
3. **Presentation** (PPT/PDF)  
4. **Live demo** (optional same day)

---

## If you run out of time — minimum viable submission

1. Report PDF with abstract, design, 6+ screenshots, conclusion  
2. Working demo with demo account  
3. Updated README + USER_MANUAL  
4. One pytest + frontend build pass logged in TEST_RESULTS.md

Everything else in Phase 6 (real LLM, Docker) is **bonus**, not required for today.
