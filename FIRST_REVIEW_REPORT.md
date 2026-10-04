# First Review Report

**(Submitted by Candidate’s Name: [Your Full Name], Roll No: [Roll No], Reg. No: [Reg. No])**

---

## Title of the Project

**AI-BASED RECRUITMENT WORKFLOW ORCHESTRATION PLATFORM USING AGENTIC AI**

*(Implementation name: **HireMind**)*

**Guide:** [Guide Name]  
**Department:** Master of Computer Applications (MCA)  
**Institution:** [College / University Name]  
**Date:** [Submission Date]

---

## Problem Definition / Abstract (300+ words)

Recruitment is a critical function for organizations seeking skilled employees. For every job opening, hiring teams receive a large number of resumes in unstructured formats such as PDF and DOCX. Manual review of each application is time-consuming, expensive, and prone to inconsistency because different evaluators may apply different standards. Traditional Applicant Tracking Systems (ATS) often provide fixed, rigid pipelines that cannot be easily adapted to diverse roles such as backend developer, data analyst, or frontend engineer. Furthermore, extracting structured information—required skills, experience level, education, and skill gaps—from free-text resumes and job descriptions requires significant human effort.

The problem addressed by this project is the lack of an integrated, intelligent, and configurable platform that automates initial candidate screening while keeping recruiters in control of hiring decisions. Organizations need a system that can process job descriptions into structured requirements, accept bulk resume uploads, execute a multi-stage evaluation pipeline, and present ranked candidates with explainable scores and interview guidance.

This project proposes **HireMind**, an AI-based recruitment workflow orchestration platform using **agentic AI**. The term “agentic AI” refers to multiple specialized software agents, each responsible for one recruitment task—resume parsing, relevance screening, skill matching, holistic evaluation, ranking, and interview question generation—coordinated by a central **workflow orchestrator** according to a user-defined pipeline graph. Recruiters interact through a modern web application where they register and authenticate securely, create and manage job postings, configure visual workflows using a drag-and-drop builder, upload candidate resumes, and trigger automated processing. The orchestrator executes workflow nodes in valid topological order, passes context and prior stage results between agents, updates candidate status at each stage, and stores structured outputs in a relational database.

The proposed solution uses a three-tier architecture: React-based presentation layer, FastAPI REST API application layer, and SQLite database with file storage for resumes (development deployment). JWT-based authentication ensures that each recruiter accesses only their own jobs and candidates. The platform produces dashboard statistics, per-job candidate lists with ranks and scores, and detailed AI reports including screening summaries, matched and missing skills, evaluation recommendations, and technical, behavioral, and gap-probing interview questions.

Thus, the project combines **workflow orchestration**, **multi-agent automation**, and **recruiter-centric UX** to reduce screening time, improve consistency, and support data-driven shortlisting—forming a practical MCA-level implementation that can be extended with production LLM APIs and enterprise database systems in future work.

**Word count:** ~340 words (adjust spacing if your form counts differently).

---

## Related Work / Existing System

### Existing approaches

1. **Manual HR screening** — Recruiters read resumes and spreadsheets manually. *Limitation:* Does not scale; subjective and slow.

2. **Traditional ATS (Applicant Tracking Systems)** — Tools such as enterprise HR suites store applications and track stages with predefined workflows. *Limitation:* Limited customization of pipeline per role; often weak AI explainability.

3. **Standalone resume parsers** — Services extract text and keywords from CVs. *Limitation:* No end-to-end pipeline, ranking, or job-specific workflow integration.

4. **AI resume scorers** — Third-party tools score resumes against a job description using ML/LLM. *Limitation:* Black-box scoring; recruiters cannot design multi-stage pipelines or combine screening, matching, evaluation, and interview generation in one system.

5. **General LLM chat for HR** — Using ChatGPT-style tools for ad-hoc resume review. *Limitation:* No persistent data model, no batch processing, no audit trail of stage results, not suitable for multi-candidate ranking.

### Proposed differentiation (HireMind)

| Feature | Typical ATS / Parser | Proposed System |
|---------|----------------------|-----------------|
| Custom workflow per job | Limited | Visual graph builder (React Flow) |
| Multi-agent pipeline | Rare | Six specialized agents + orchestrator |
| Stage-wise stored results | Partial | Full `stage_results` history |
| Recruiter dashboard & reports | Varies | Integrated dashboard + AI report page |
| Open API architecture | Often closed | REST + OpenAPI (Swagger) |

---

## Objectives and Scope of the Proposed Work

### Objectives

1. To design and implement a secure web application for recruiter registration, login, and session management using JWT.
2. To develop job management modules with automatic extraction of structured requirements from job descriptions.
3. To provide a visual workflow builder for defining recruitment pipelines (Parse → Screen → Match → Evaluate → Rank → Interview).
4. To implement specialized AI agents and a workflow orchestrator that executes pipelines per candidate with status tracking.
5. To support resume upload (PDF/DOC/DOCX), batch processing, ranking, and composite scoring.
6. To deliver a dashboard with aggregate metrics and detailed candidate AI reports for hiring decisions.
7. To integrate frontend and backend with persistent storage in a relational database.

### Scope (In scope)

- Recruiter-only web application (single-tenant per recruiter data isolation)
- Jobs, candidates, workflows, uploads, processing, reports
- Mock/rule-based agents (extensible to LLM APIs)
- SQLite database and local resume storage for development
- API documentation via Swagger

### Scope (Out of scope)

- Candidate/applicant self-service portal
- Email/SMS notifications and interview scheduling
- Integration with LinkedIn or external HRIS
- Mobile native apps
- Video interview analysis

---

## Block Diagram / System Architecture

### High-level block diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        RECRUITER (User)                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (React + MUI + Vite)               │
│  Login │ Dashboard │ Jobs │ Workflow Builder │ Candidates │ Reports│
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST JSON + JWT
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER (FastAPI)                     │
│ ┌─────────┐ ┌──────────┐ ┌────────────┐ ┌───────────────────┐   │
│ │  Auth   │ │   Jobs   │ │ Candidates │ │ Workflow Service  │   │
│ │ Service │ │ Service  │ │  Service   │ │ + Dashboard Stats │   │
│ └─────────┘ └──────────┘ └────────────┘ └─────────┬─────────┘   │
│                                                     │           │
│                    ┌────────────────────────────────▼─────────┐ │
│                    │      WORKFLOW ORCHESTRATOR ENGINE          │
│                    │  (Topological sort → Agent execution)      │
│                    └────────────────────────────────┬─────────┘ │
└─────────────────────────────────────────────────────┼───────────┘
                                                      │
┌─────────────────────────────────────────────────────▼───────────┐
│                      AGENT LAYER (Agentic AI)                   │
│  Parse │ Screen │ Match │ Evaluate │ Rank │ Interview           │
└─────────────────────────────────────────────────────┬───────────┘
                                                      │
┌─────────────────────────────────────────────────────▼───────────┐
│                         DATA LAYER                              │
│   SQLite (hiremind.db)          │    File System (uploads/)     │
│   recruiters, jobs, workflows,  │    Resume PDF/DOC/DOCX        │
│   candidates, stage_results     │                               │
└─────────────────────────────────────────────────────────────────┘
```

### Three-tier summary

- **Tier 1:** React SPA (frontend)
- **Tier 2:** FastAPI services + orchestrator (backend)
- **Tier 3:** Database + file storage

---

## Algorithm / Technique Proposed or Solution Methodology

### 1. Job description processing (JD processor)

- **Input:** Job title + description text  
- **Technique:** Keyword and pattern matching against a skill dictionary; sentence extraction for responsibilities  
- **Output:** `JobRequirements` (required/preferred skills, experience label, education, responsibilities)

### 2. Workflow validation

- **Rules:** Exactly one Parse node; directed acyclic graph (DAG); all nodes connected  
- **Algorithm:** Cycle detection (DFS) + connectivity check on React Flow graph

### 3. Workflow orchestration

```
Algorithm: ExecutePipeline(job_id, candidate_id)
1. Load job, candidate, job_requirements, workflow JSON
2. ordered_nodes ← TopologicalSort(workflow.nodes, workflow.edges)
3. context ← { job, candidate, requirements, results: {} }
4. FOR each node in ordered_nodes:
5.     agent ← AGENT_REGISTRY[node.type]
6.     result ← agent.run(context, node.config)
7.     Save stage_result(candidate_id, node.id, result)
8.     context.results[node.type] ← result.data
9.     IF NOT result.should_continue:
10.        SET candidate.status ← filtered_out; RETURN
11.     Update candidate scores/status from result
12. SET candidate.status ← completed
13. RecomputeJobRanks(job_id)
```

### 4. Agent pipeline (default sequence)

| Stage | Agent | Output |
|-------|-------|--------|
| Parse | ParseAgent | Skills, education, experience profile |
| Screen | ScreenAgent | Relevance score (0–100), pass/fail vs threshold |
| Match | MatchAgent | Match score, matched/missing skills |
| Evaluate | EvaluateAgent | Overall score, strengths, weaknesses, recommendation |
| Rank | RankAgent | Composite score (weighted) |
| Interview | InterviewAgent | Technical, behavioral, gap-probing questions |

### 5. Ranking

- Sort candidates by `overall_score` descending  
- Assign rank 1, 2, 3… for completed/filtered candidates per job

### 6. Authentication

- Password hashing: **bcrypt**  
- Session token: **JWT (HS256)** with recruiter id in `sub` claim

---

## Analysis and Design

### 1. Hardware and Software Requirements

#### Hardware requirements (minimum)

| Component | Specification |
|-----------|---------------|
| Processor | Intel Core i3 / AMD equivalent or higher |
| RAM | 8 GB (16 GB recommended) |
| Storage | 10 GB free space |
| Display | 1366×768 or higher |
| Network | Internet for development tools and optional LLM API |
| Input devices | Keyboard, mouse |

#### Software requirements

| Category | Software |
|----------|----------|
| Operating System | Windows 10/11, Linux, or macOS |
| Frontend runtime | Node.js 18+ |
| Backend runtime | Python 3.11+ |
| Database | SQLite 3 (development); PostgreSQL (production optional) |
| IDE | VS Code / Cursor |
| Browser | Google Chrome / Microsoft Edge (latest) |
| Version control | Git |
| API testing | Swagger UI (built-in), Postman (optional) |

#### Technology stack

| Layer | Tools |
|-------|-------|
| Frontend | React 19, TypeScript, Vite, MUI, React Router, React Flow |
| Backend | FastAPI, Uvicorn, SQLAlchemy, Pydantic, python-jose, bcrypt |
| Data | SQLite, local `uploads/` folder |

---

### 2. UML / DFD Diagram and ER Diagram

#### Use case diagram (textual)

**Actor:** Recruiter  

**Use cases:** Register, Login, Logout, View Dashboard, Create/Edit/Delete Job, View Job Requirements, Design Workflow, Save Workflow, Upload Resumes, Start Pipeline Processing, View Candidate List, View Candidate AI Report, View API Docs (developer)

#### DFD Level 0 (Context diagram)

```
                    ┌──────────────────────────────┐
   Resume Files ───►│                              │
   Job Data ───────►│   HireMind Recruitment       │───► Reports / Rankings
   Login Info ────►│   Workflow Platform          │───► Dashboard Stats
                    │                              │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                          Database + File Store
```

#### DFD Level 1 (main processes)

```
Recruiter → [1.0 Authentication] → Recruiter Store
Recruiter → [2.0 Job Management] → Job Store + Requirements
Recruiter → [3.0 Workflow Config] → Workflow Store
Recruiter → [4.0 Upload Resumes] → Candidate Store + Files
Recruiter → [5.0 Run Orchestrator] → Stage Results + Updated Scores
Recruiter → [6.0 View Reports] ← Candidate Store + Stage Results
```

#### ER Diagram (implemented schema)

```
RECRUITER (1) ──────< (M) JOB
JOB (1) ────── (1) JOB_REQUIREMENTS
JOB (1) ────── (0..1) WORKFLOW
JOB (1) ──────< (M) CANDIDATE
CANDIDATE (1) ──────< (M) STAGE_RESULT
```

**Cardinality:**

- One recruiter creates many jobs  
- One job has one requirements record and optionally one workflow  
- One job has many candidates  
- One candidate has many stage results  

*(Draw formally using draw.io / StarUML using the table design below.)*

---

### 3. Database Table Design

#### Table: `recruiters`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| name | VARCHAR(120) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt hash |
| created_at | DATETIME | NOT NULL | Registration time |

#### Table: `jobs`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| recruiter_id | VARCHAR(36) | FK → recruiters.id | Owner |
| title | VARCHAR(200) | NOT NULL | Job title |
| description | TEXT | NOT NULL | Job description |
| location | VARCHAR(120) | NOT NULL | Job location |
| min_experience | INTEGER | NOT NULL | Min years |
| max_experience | INTEGER | NOT NULL | Max years |
| status | ENUM | draft/open/closed | Job status |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |

#### Table: `job_requirements`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| job_id | VARCHAR(36) | FK, UNIQUE | One per job |
| required_skills | TEXT | JSON array | Required skills |
| preferred_skills | TEXT | JSON array | Preferred skills |
| min_experience_label | VARCHAR(80) | | e.g. "2–5 years" |
| education | VARCHAR(200) | | |
| responsibilities | TEXT | JSON array | |
| created_at | DATETIME | NOT NULL | |

#### Table: `workflows`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| job_id | VARCHAR(36) | FK, UNIQUE | One per job |
| definition | TEXT | JSON | nodes + edges |
| is_default | BOOLEAN | | Template flag |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |

#### Table: `candidates`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| job_id | VARCHAR(36) | FK → jobs.id | |
| name | VARCHAR(120) | NOT NULL | |
| email | VARCHAR(200) | NOT NULL | |
| experience_years | INTEGER | | From parse agent |
| status | ENUM | | pending, screening, completed, etc. |
| rank | INTEGER | NULL | Job-wise rank |
| match_score | FLOAT | NULL | |
| eval_score | FLOAT | NULL | |
| overall_score | FLOAT | NULL | Composite |
| resume_file_name | VARCHAR(255) | | Original filename |
| resume_path | VARCHAR(500) | | Storage path |
| created_at | DATETIME | NOT NULL | |
| updated_at | DATETIME | NOT NULL | |

#### Table: `stage_results`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(36) | PK | UUID |
| candidate_id | VARCHAR(36) | FK | |
| stage_type | VARCHAR(40) | | parse, screen, match, eval, rank, interview |
| node_id | VARCHAR(80) | | Workflow node id |
| result_data | TEXT | JSON | Agent output |
| score | FLOAT | NULL | Stage score if any |
| status | ENUM | | completed, failed, etc. |
| executed_at | DATETIME | NOT NULL | |

---

## Work Plan

### Work done so far

| Phase | Activities completed | Status |
|-------|----------------------|--------|
| Phase 1 | Requirements study, SRS, architecture document | ✅ Done |
| Phase 2 | Frontend setup (React, MUI, routing, theme) | ✅ Done |
| Phase 3 | Auth UI + mock API; backend auth (JWT, bcrypt) | ✅ Done |
| Phase 4 | Jobs CRUD, JD requirement extraction (backend) | ✅ Done |
| Phase 5 | Workflow builder (React Flow) + workflow API | ✅ Done |
| Phase 6 | Candidate upload, list, mock/orchestrated pipeline | ✅ Done |
| Phase 7 | AI agent registry + workflow orchestrator | ✅ Done |
| Phase 8 | Dashboard stats API, candidate AI report API | ✅ Done |
| Phase 9 | Live frontend–backend integration (SQLite) | ✅ Done |
| Phase 10 | GitHub repository, tag v0.3-fullstack | ✅ Done |

### Work to be done

| Phase | Activities | Priority |
|-------|------------|----------|
| Phase 11 | Real LLM integration (OpenAI/Gemini) for agents | High |
| Phase 12 | PDF/DOCX text extraction for resume parsing | High |
| Phase 13 | Change password & forgot password (backend) | Medium |
| Phase 14 | Docker Compose deployment | Medium |
| Phase 15 | PostgreSQL migration for production demo | Medium |
| Phase 16 | Automated testing (pytest, integration tests) | Medium |
| Phase 17 | User manual, final report, viva demo rehearsal | High |
| Phase 18 | Optional: PDF export of candidate reports | Low |

---

## Time Schedule

*(Adjust dates to match your academic calendar.)*

| Week | Planned activity | Deliverable |
|------|------------------|-------------|
| 1–2 | Problem identification, literature survey, SRS | Requirements document |
| 3–4 | System design, ER/DFD, UI wireframes | Architecture & design docs |
| 5–6 | Frontend auth, dashboard, jobs module | Working UI (mock data) |
| 7–8 | Backend API: auth, jobs, workflows | Swagger-tested APIs |
| 9–10 | Candidates, upload, orchestrator, agents | End-to-end pipeline |
| 11 | Frontend–backend integration, testing | Live mode demo |
| 12 | **First review report & presentation** | First review submission |
| 13–14 | LLM/PDF parsing enhancements, Docker | Improved AI accuracy |
| 15–16 | Final testing, documentation, report | Final report |
| 17–18 | Project viva / demonstration | Completed project |

**Gantt-style milestone summary:**

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
SRS   ██
Design   ██
Frontend    ████████
Backend        ████████
Integration              ███
First Review                 ★
Enhancements                    ████
Final Report                         ████
Viva                                      ★
```

---

## References

1. FastAPI Team, *FastAPI Documentation*, https://fastapi.tiangolo.com/, accessed 2026.

2. Meta Open Source, *React Documentation*, https://react.dev/, accessed 2026.

3. MUI Team, *Material UI Documentation*, https://mui.com/, accessed 2026.

4. xyflow, *React Flow Documentation*, https://reactflow.dev/, accessed 2026.

5. SQLAlchemy Authors, *SQLAlchemy 2.0 Documentation*, https://docs.sqlalchemy.org/, accessed 2026.

6. IETF, *JSON Web Token (JWT)*, RFC 7519, https://datatracker.ietf.org/doc/html/rfc7519.

7. OWASP, *Password Storage Cheat Sheet* (bcrypt recommendations), https://cheatsheetseries.owasp.org/.

8. Russell, S., Norvig, P., *Artificial Intelligence: A Modern Approach* (Multi-agent systems concepts), Pearson (reference for agentic AI terminology).

9. Project repository: Yuvasri1413, *HireMind*, GitHub, https://github.com/Yuvasri1413/hiremind, release tag v0.3-fullstack.

10. Internal project documents: `PROJECT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `FRONTEND_DESIGN.md`, `BACKEND_MODULES.md`, `FRONTEND_MODULES.md`.

---

## Guide / HOD remarks (leave blank for signatures)

**Guide remarks:** _______________________________________________

**Signature of Guide:** _______________  **Date:** _______________

**HOD remarks:** _______________________________________________

**Signature of HOD:** _______________  **Date:** _______________

---

*End of First Review Report — copy sections into your PDF/form as needed.*
