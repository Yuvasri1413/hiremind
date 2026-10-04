# HireMind — MCA Project Report Content

Use this document to copy text into your PDF form. Replace placeholders in **[square brackets]** with your details.

---

## Status 3 — Modified Title

Copy the fields below into your form for **Status 3 (Modified Title)**.

| Field | Content |
|-------|---------|
| **Status** | 3 — Modified Title |
| **Modified Project Title** | AI-BASED RECRUITMENT WORKFLOW ORCHESTRATION PLATFORM USING AGENTIC AI |
| **Product / System Name (optional)** | HireMind |
| **Domain** | Artificial Intelligence / Web Application / Human Resource Management |

### Brief description of modified title (2–4 lines)

The modified title reflects the core focus of the project: an **AI-based** system that **orchestrates recruitment workflows** using **multiple specialized agents** (agentic AI). Unlike a simple resume parser or static ATS, the platform lets recruiters design custom pipelines and coordinates autonomous agents for parsing, screening, skill matching, evaluation, ranking, and interview question generation.

### Objectives (short, for form)

1. Build a web platform for recruiters to manage jobs and hiring workflows.  
2. Extract structured requirements from job descriptions.  
3. Implement a visual workflow builder and multi-agent orchestration engine.  
4. Automate candidate screening with scores, rankings, and AI-generated reports.  
5. Integrate frontend and backend with secure authentication and database storage.

### Keywords

Recruitment Workflow, Agentic AI, Workflow Orchestration, Resume Screening, Skill Matching, FastAPI, React, Multi-Agent System

### Tools / technologies (if asked on same page)

React, TypeScript, FastAPI, Python, SQLAlchemy, SQLite, JWT, Material UI, React Flow

---

## Cover / Title Page

| Field | Content |
|-------|---------|
| **Project Title** | AI-BASED RECRUITMENT WORKFLOW ORCHESTRATION PLATFORM USING AGENTIC AI |
| **System Name** | HireMind |
| **Project Type** | MCA Final Year Project |
| **Student Name** | [Your Full Name] |
| **Register / Roll No.** | [Your Roll Number] |
| **College / University** | [Your College Name] |
| **Department** | Master of Computer Applications (MCA) |
| **Academic Year** | [e.g. 2025–2026] |
| **Guide Name** | [Guide Name] |
| **Guide Designation** | [e.g. Assistant Professor] |
| **Date of Submission** | [Date] |

---

## Abstract (150–250 words)

Recruitment teams receive large volumes of resumes for each job opening. Manual screening is slow, inconsistent, and difficult to scale. This project presents **HireMind**, a web-based recruitment workflow orchestration platform that combines a visual pipeline builder with specialized AI agents to automate resume processing, skill matching, candidate evaluation, ranking, and interview question generation.

The system follows a three-tier architecture: a **React** single-page application for recruiters, a **FastAPI** backend with REST APIs and JWT authentication, and a **SQLite** database for persistent storage of jobs, candidates, workflows, and pipeline results. Recruiters can create job openings, extract structured requirements from job descriptions, design custom hiring workflows using a drag-and-drop graph editor, upload resumes, and run an orchestrated multi-stage AI pipeline. Each stage is implemented as an independent agent (Parse, Screen, Match, Evaluate, Rank, Interview) coordinated by a workflow engine that executes nodes in topological order and tracks status per candidate.

The platform provides a dashboard with aggregate statistics, ranked candidate lists, and detailed AI reports including screening scores, skill gaps, evaluation recommendations, and tailored interview questions. The implementation demonstrates end-to-end integration between frontend and backend with secure recruiter-scoped data access. The project aligns with modern agentic AI patterns for business process automation in human resources and serves as a scalable foundation for integration with large language model APIs in production deployments.

**Keywords:** Recruitment, Workflow Orchestration, Agentic AI, FastAPI, React, Resume Screening, Skill Matching

---

## 1. Introduction

### 1.1 Background

Organizations depend on efficient hiring to acquire talent. Traditional applicant tracking often uses fixed pipelines that do not adapt to different roles. HireMind addresses this by letting recruiters define per-job workflows and automating repetitive screening using AI agents while keeping humans in control of final decisions.

### 1.2 Purpose of the Project

To design and implement a full-stack web application that:

- Manages job openings and job descriptions
- Extracts structured requirements from job descriptions
- Allows visual configuration of recruitment pipelines
- Processes candidates through multiple AI-assisted stages
- Presents ranked candidates and detailed reports on a dashboard

---

## 2. Problem Statement

- High resume volume makes manual review impractical
- Inconsistent evaluation criteria across reviewers
- Delayed hiring cycles due to manual parsing and comparison
- Difficulty extracting skill gaps and interview focus areas from unstructured resumes
- Lack of flexible, role-specific hiring pipelines in conventional tools

---

## 3. Objectives

### 3.1 Primary Objective

Develop an AI-based recruitment workflow orchestration platform that automates key screening and evaluation stages using specialized agents coordinated by a workflow engine.

### 3.2 Specific Objectives

1. Recruiter registration, login, and secure session management
2. Job CRUD with automatic job-description requirement extraction
3. Visual workflow builder (Parse → Screen → Match → Evaluate → Rank → Interview)
4. Resume upload (PDF/DOC/DOCX) and candidate pipeline execution
5. Structured outputs: scores, rankings, evaluations, interview questions
6. Dashboard with job/candidate statistics and detailed candidate reports

---

## 4. Scope

### 4.1 In Scope

- Recruiter authentication (register, login, JWT)
- Jobs, candidates, workflows, dashboard
- Mock/rule-based AI agents with orchestrator (extensible to real LLM)
- SQLite database and local file storage for resumes
- REST API with OpenAPI (Swagger) documentation

### 4.2 Out of Scope

- Candidate-facing applicant portal
- Email notifications and calendar scheduling
- External ATS/HRIS integration
- Mobile native applications

---

## 5. Literature Review / Existing Systems (Brief)

Traditional ATS tools (e.g. generic enterprise suites) offer rigid workflows. Recent research and products emphasize AI-assisted resume parsing and LLM-based evaluation. HireMind differentiates by combining **configurable workflow graphs** (React Flow) with a **multi-agent pipeline** and a unified recruiter dashboard, following agentic AI orchestration patterns described in modern HR tech and software architecture literature.

---

## 6. System Analysis

### 6.1 Stakeholders

| Role | Description |
|------|-------------|
| **Recruiter** | Creates jobs, configures workflows, uploads resumes, reviews AI reports |
| **System Administrator** | Deploys backend, manages environment and database (future) |

### 6.2 Functional Requirements (Summary)

| ID | Requirement |
|----|-------------|
| FR-AUTH | Register, login, profile via JWT |
| FR-JOB | Create, edit, delete jobs; extract JD requirements |
| FR-WF | Save/load workflow graph per job with validation |
| FR-UP | Upload resumes; trigger pipeline processing |
| FR-AG | Six agents produce structured stage results |
| FR-DASH | Dashboard stats; candidate list; AI report view |

### 6.3 Non-Functional Requirements (Summary)

- Responsive web UI (MUI)
- API response suitable for demo workloads
- Password hashing (bcrypt), JWT for API auth
- Recruiter data isolation (jobs owned by logged-in user)

---

## 7. System Design

### 7.1 Architecture

**Three-tier + agent layer:**

1. **Presentation:** React SPA (Vite, TypeScript, Material UI)
2. **Application:** FastAPI services (auth, jobs, candidates, workflows, dashboard)
3. **Agent tier:** Parse, Screen, Match, Evaluate, Rank, Interview agents + orchestrator
4. **Data:** SQLite (`hiremind.db`), resume files in `uploads/`

### 7.2 Module Diagram (Text)

```
Recruiter → Frontend (React) → REST API (FastAPI)
                → Auth | Jobs | Candidates | Workflows | Dashboard
                → Workflow Orchestrator → Agents → Stage Results
                → Database (SQLite) + File Storage
```

### 7.3 Database Entities

| Entity | Purpose |
|--------|---------|
| recruiters | User accounts |
| jobs | Job openings |
| job_requirements | Extracted skills, education, responsibilities |
| workflows | JSON graph (nodes + edges) per job |
| candidates | Candidate profile, scores, status, rank |
| stage_results | Per-stage agent output and scores |

### 7.4 Workflow Pipeline (Default)

**Parse → Screen → Skill Match → Evaluate → Rank → Interview**

---

## 8. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, React Router |
| UI | Material UI (MUI) v9 |
| Workflow UI | React Flow (@xyflow/react) |
| Backend | Python 3.11+, FastAPI |
| ORM | SQLAlchemy 2 |
| Database (dev) | SQLite |
| Auth | JWT (HS256), bcrypt password hashing |
| API docs | OpenAPI / Swagger UI |
| Version control | Git, GitHub (`Yuvasri1413/hiremind`) |

---

## 9. Implementation / Modules

### 9.1 Frontend Modules (Completed)

| Module | Description |
|--------|-------------|
| 0 | Project setup |
| 1 | Auth, theme (dark/light) |
| 2 | App shell, sidebar |
| 3 | Dashboard |
| 4 | Jobs list, create/edit |
| 5 | Job overview + requirements |
| 6 | Resume upload tab |
| 7 | Candidates list |
| 8 | Candidate AI report |
| 9 | Workflow builder |

### 9.2 Backend Modules (Completed)

| Module | Description |
|--------|-------------|
| 0 | FastAPI setup, health check |
| 1 | Auth (register, login, `/auth/me`) |
| 2 | Jobs CRUD + mock JD processor |
| 3 | Workflows get/save + validation |
| 4 | Candidates upload, list, process |
| 5 | AI agents + orchestrator |
| 6 | Dashboard stats API |
| 7 | Frontend live API integration |

### 9.3 Key API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register`, `/auth/login` | Authentication |
| GET | `/auth/me` | Current user |
| GET/POST/PUT/DELETE | `/jobs` | Job management |
| GET/PUT | `/jobs/{id}/workflow` | Workflow |
| GET/POST | `/jobs/{id}/candidates`, `/upload`, `/process` | Candidates |
| GET | `/candidates/{id}/report` | AI report |
| GET | `/dashboard/stats` | Dashboard KPIs |

---

## 10. Testing

### 10.1 Testing Performed

- Manual end-to-end testing: login → create job → save workflow → upload resume → process pipeline → view report
- API testing via Swagger UI (`http://localhost:8000/docs`)
- Frontend build verification (`npm run build`)
- Live mode integration (`VITE_API_MODE=live`) with SQLite persistence

### 10.2 Test Environment

- OS: Windows 10/11
- Backend: `uvicorn app.main:app --reload --port 8000`
- Frontend: `npm run dev` (port 5173)
- Demo account: `recruiter@hiremind.com` / `password123`

### 10.3 Sample Test Cases

| Test Case | Expected Result |
|-----------|-----------------|
| Login with valid credentials | JWT issued; dashboard loads |
| Create job | Job saved in database |
| Upload PDF resume | Candidate created with status `pending` |
| Process candidates | Status `completed` or `filtered_out`; scores populated |
| View candidate report | Pipeline stages + screening/match/eval/interview sections |

---

## 11. Results / Screenshots (For PDF)

*[Insert screenshots here: Login, Dashboard, Jobs, Workflow Builder, Upload, Candidates, AI Report, Swagger API]*

**GitHub repository:** https://github.com/Yuvasri1413/hiremind  
**Release tag:** v0.3-fullstack

---

## 12. Conclusion

HireMind successfully implements a recruitment workflow orchestration platform with a modern web interface, RESTful backend, persistent database storage, and a multi-agent pipeline for candidate screening. The system meets the core objectives of the MCA project: configurable workflows, automated stage processing, and recruiter-facing analytics. The modular architecture supports future integration with production LLM APIs, PostgreSQL, and Docker-based deployment.

---

## 13. Future Enhancements

1. Integration with OpenAI / Google Gemini for real LLM-powered agents
2. PDF/DOCX text extraction for accurate resume parsing
3. PostgreSQL and Docker Compose for production deployment
4. Change password and email-based password reset on backend
5. WebSocket-based real-time pipeline progress
6. PDF export of candidate evaluation reports
7. Automated test suite (pytest, Vitest)

---

## 14. References

1. FastAPI Documentation — https://fastapi.tiangolo.com/
2. React Documentation — https://react.dev/
3. Material UI — https://mui.com/
4. React Flow — https://reactflow.dev/
5. SQLAlchemy — https://www.sqlalchemy.org/
6. Project internal documents: `PROJECT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `FRONTEND_DESIGN.md`
7. GitHub repository: https://github.com/Yuvasri1413/hiremind

---

## 15. Appendix — How to Run (Demo Guide)

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend (connected to database)
```bash
cd frontend
# In .env set: VITE_API_MODE=live
npm install
npm run dev
```

Open http://localhost:5173 → Login → Dashboard → Jobs → Upload → Process → View candidate report.

**Data stored in:** `backend/hiremind.db` and `backend/uploads/`

---

*End of report content*
