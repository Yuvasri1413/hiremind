# HireMind — Presentation & viva (10–15 min)

## Slide outline (copy into PowerPoint)

1. **Title** — AI-Based Recruitment Workflow Orchestration Platform Using Agentic AI (HireMind)  
   Your name, roll no., guide, college, date  

2. **Problem** — High resume volume, slow manual screening, inconsistent evaluation, rigid ATS pipelines  

3. **Objectives** — Web platform, JD extraction, visual workflows, multi-agent pipeline, dashboard & reports  

4. **Existing vs proposed** — Table: ATS / parsers / ChatGPT vs HireMind (custom workflow, 6 agents, stored stage results)  

5. **Architecture** — Browser → React → FastAPI → Orchestrator → Agents → SQLite + uploads  

6. **Tech stack** — React, TypeScript, MUI, React Flow, FastAPI, SQLAlchemy, JWT, SQLite  

7. **Modules implemented** — Frontend 0–9, Backend 0–7, live integration  

8. **Workflow pipeline** — Parse → Screen → Match → Evaluate → Rank → Interview (diagram)  

9. **Screenshots** — 2–3 key UI images (dashboard + AI report)  

10. **Testing & results** — Manual E2E + Swagger + pytest + `npm run build`  

11. **Limitations** — Mock agents (LLM-ready), simplified resume parse, SQLite dev DB  

12. **Future work** — OpenAI/Gemini, PDF extraction, PostgreSQL, Docker  

13. **Demo / Thank you** — Live URL localhost:5173  

---

## Live demo script (~10 minutes)

| Time | Action | Say briefly |
|------|--------|-------------|
| 0:00 | Login `recruiter@hiremind.com` | Secure JWT auth, data in SQLite |
| 1:00 | Dashboard | KPIs and recent jobs |
| 2:00 | Jobs list | CRUD + seeded sample data |
| 3:00 | Open **Backend Developer** | JD + extracted requirements |
| 4:00 | Workflow tab → Builder | Recruiter-defined agentic pipeline |
| 5:30 | Candidates tab | Rankings after orchestrator |
| 7:00 | Open top candidate **AI report** | Stage-wise scores and interview questions |
| 8:30 | Optional: Upload + Process one file | End-to-end automation |
| 9:30 | Swagger `/docs` | REST API for integration |
| 10:00 | Q&A | |

**Before demo:** Backend already running; browser tab on login; close unrelated apps.

---

## Viva — likely questions & short answers

**Why agentic AI?**  
Six specialized agents plus an orchestrator beat one monolithic model: clear stages, auditable `stage_results`, configurable order per job.

**Where is data stored?**  
SQLite `hiremind.db`; resumes in `uploads/`; JWT in browser localStorage only.

**How is security handled?**  
bcrypt passwords, JWT on API calls, jobs/candidates scoped to logged-in recruiter ID.

**Is it real AI?**  
Agents use rule/mock logic for reliable demos; design allows swapping in LLM via `LLM_MODE`.

**Difference from ChatGPT for HR?**  
Persistent jobs/candidates, batch processing, ranking, workflow graph, report history.

**Orchestrator?**  
Runs workflow nodes in topological order, passes context between agents, updates candidate status.

**Three-tier architecture?**  
Presentation (React), application (FastAPI), data (SQLite + files).

**Out of scope?**  
Candidate portal, email, calendar, production PostgreSQL (future).

---

## 3-minute elevator pitch (memorize)

Organizations receive too many resumes for manual screening. HireMind is a full-stack web platform where recruiters create job openings, design visual hiring workflows, and run a coordinated multi-agent pipeline that parses, screens, matches skills, evaluates, ranks, and generates interview questions. I implemented React with a workflow builder, FastAPI with JWT authentication, SQLite persistence, and a complete live integration. The project demonstrates software engineering, database design, and modern agentic AI patterns for HR automation, with a clear path to production LLMs and cloud deployment.
