# Project Requirements Document

## AI-Based Recruitment Workflow Orchestration Platform Using Agentic AI

**Version:** 1.0  
**Date:** September 2026  
**Project Type:** MCA Final Year Project  
**Status:** Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Scope](#4-scope)
5. [Stakeholders & Users](#5-stakeholders--users)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Module Specifications](#8-module-specifications)
9. [Use Cases](#9-use-cases)
10. [Data Requirements](#10-data-requirements)
11. [External Integrations](#11-external-integrations)
12. [Constraints & Assumptions](#12-constraints--assumptions)
13. [Acceptance Criteria](#13-acceptance-criteria)
14. [Out of Scope](#14-out-of-scope)
15. [Future Enhancements](#15-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for an **AI-Based Recruitment Workflow Orchestration Platform**. The system enables recruiters to design customizable hiring pipelines and uses specialized AI agents to automate resume parsing, skill matching, candidate evaluation, ranking, and interview question generation.

### 1.2 Background

Organizations receive large volumes of resumes for each job opening. Manual screening is time-consuming, inconsistent, and difficult to scale. This platform addresses these challenges by combining a visual workflow builder with agentic AI to orchestrate recruitment stages automatically while keeping recruiters in control of final decisions.

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| **Agent** | A specialized AI module that performs one recruitment task independently |
| **Workflow** | A configured sequence of processing stages for a job opening |
| **Orchestrator** | The engine that coordinates agent execution and data flow |
| **JD** | Job Description |
| **LLM** | Large Language Model |
| **SRS** | Software Requirements Specification |

---

## 2. Problem Statement

Recruiters and hiring managers face the following challenges during initial candidate screening:

- **Volume:** Hundreds of resumes per role make manual review impractical.
- **Inconsistency:** Different reviewers apply different criteria and bias.
- **Time delay:** Manual parsing and comparison slows down hiring cycles.
- **Limited insights:** Extracting structured skill gaps and interview focus areas from unstructured resumes is labor-intensive.
- **No workflow flexibility:** Traditional ATS tools offer rigid pipelines without easy customization.

There is a need for an intelligent platform that automates repetitive screening tasks, provides consistent AI-assisted evaluations, and allows recruiters to configure workflows per job role.

---

## 3. Project Objectives

### 3.1 Primary Objective

Develop an AI-based recruitment workflow orchestration platform that automates key stages of candidate screening and evaluation using specialized AI agents coordinated by a workflow engine.

### 3.2 Specific Goals

1. Enable recruiters to create and manage job openings and recruitment workflows.
2. Automatically extract structured requirements from job descriptions.
3. Parse resumes and extract candidate profiles from PDF/DOCX files.
4. Match candidate skills against job requirements with quantified scores.
5. Generate structured candidate evaluations and rankings.
6. Produce personalized interview questions based on candidate profiles and skill gaps.
7. Provide a centralized dashboard for reviewing AI-generated insights and making hiring decisions.

### 3.3 Success Metrics

| Metric | Target |
|--------|--------|
| Resume parsing accuracy | ≥ 85% for standard PDF resumes |
| End-to-end processing time | ≤ 2 minutes per candidate |
| Recruiter workflow setup time | ≤ 10 minutes for a new job |
| System uptime (demo environment) | ≥ 99% during evaluation period |
| Concurrent jobs supported | ≥ 5 active jobs with 50 candidates each |

---

## 4. Scope

### 4.1 In Scope

- Recruiter registration, authentication, and profile management
- Job opening creation and management
- Job description processing and requirement extraction
- Visual workflow builder for recruitment stages
- Resume upload (single and bulk) for job openings
- AI agent pipeline: parsing, screening, matching, evaluation, ranking, interview generation
- Workflow orchestration with stage status tracking
- Recruiter dashboard with candidate list, scores, rankings, and detailed AI reports

### 4.2 Project Deliverables

1. Working web application (frontend + backend)
2. Database schema with sample data
3. API documentation (OpenAPI/Swagger)
4. Architecture documentation
5. User manual / demo guide
6. Source code with README and setup instructions

---

## 5. Stakeholders & Users

### 5.1 Primary Users

| Role | Description |
|------|-------------|
| **Recruiter** | Creates jobs, configures workflows, uploads resumes, reviews AI outputs |
| **System Administrator** | Manages system configuration, monitors health (optional for MVP) |

### 5.2 Secondary Stakeholders

- **Hiring Manager** — consumes ranked candidate lists and evaluation reports
- **Project Evaluator (Faculty)** — reviews system during viva/demo
- **Candidates** — indirect stakeholders; their resume data is processed

---

## 6. Functional Requirements

### 6.1 Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | System shall allow recruiter registration with name, email, and password | Must |
| FR-AUTH-02 | System shall authenticate recruiters via email and password | Must |
| FR-AUTH-03 | System shall issue JWT tokens for authenticated sessions | Must |
| FR-AUTH-04 | System shall restrict job and candidate data to the owning recruiter | Must |
| FR-AUTH-05 | System shall hash passwords before storage | Must |

### 6.2 Recruiter Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REC-01 | Recruiter shall view and update their profile | Should |
| FR-REC-02 | Recruiter shall log out and invalidate session | Should |

### 6.3 Job Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-JOB-01 | Recruiter shall create job openings with title, description, location, experience, and status | Must |
| FR-JOB-02 | Recruiter shall edit and delete their job openings | Must |
| FR-JOB-03 | Recruiter shall set job status as Draft, Open, or Closed | Must |
| FR-JOB-04 | System shall list all jobs belonging to the logged-in recruiter | Must |
| FR-JOB-05 | System shall trigger JD processing when a job is created or updated | Must |

### 6.4 Job Description Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-JD-01 | System shall extract required skills from job description text | Must |
| FR-JD-02 | System shall extract preferred skills, experience, education, and responsibilities | Must |
| FR-JD-03 | System shall store extracted requirements as structured JSON | Must |
| FR-JD-04 | Recruiter shall view extracted requirements on job detail page | Must |

### 6.5 Visual Workflow Builder

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WF-01 | Recruiter shall configure a recruitment workflow per job using a visual editor | Must |
| FR-WF-02 | Workflow shall support nodes: Parse, Screen, Skill Match, Evaluate, Rank, Interview | Must |
| FR-WF-03 | Recruiter shall connect nodes to define execution order | Must |
| FR-WF-04 | Recruiter shall configure node parameters (thresholds, weights, question count) | Should |
| FR-WF-05 | System shall provide a default workflow template for new jobs | Must |
| FR-WF-06 | System shall validate workflow graph (no cycles, valid connections) | Must |
| FR-WF-07 | Recruiter shall save and load workflow configuration | Must |

### 6.6 Resume Upload & Parsing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RES-01 | Recruiter shall upload resumes in PDF and DOCX format | Must |
| FR-RES-02 | Recruiter shall upload multiple resumes for a single job | Must |
| FR-RES-03 | System shall extract candidate name, contact, skills, experience, education, and work history | Must |
| FR-RES-04 | System shall store original resume files securely | Must |
| FR-RES-05 | System shall display parsing status and errors per resume | Must |

### 6.7 Resume Screening Agent

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SCR-01 | Agent shall assess resume relevance against job requirements | Must |
| FR-SCR-02 | Agent shall output relevance score (0–100) and justification | Must |
| FR-SCR-03 | System shall skip subsequent stages if score is below configured threshold | Should |
| FR-SCR-04 | Recruiter shall view screening results per candidate | Must |

### 6.8 Skill Matching Agent

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-MATCH-01 | Agent shall compare candidate skills with job required and preferred skills | Must |
| FR-MATCH-02 | Agent shall identify matched, missing, and partially matched skills | Must |
| FR-MATCH-03 | Agent shall output an overall match score (0–100) | Must |
| FR-MATCH-04 | Recruiter shall view skill match matrix per candidate | Must |

### 6.9 Candidate Evaluation Agent

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-EVAL-01 | Agent shall generate structured assessment with strengths and weaknesses | Must |
| FR-EVAL-02 | Agent shall output overall evaluation score and hire recommendation | Must |
| FR-EVAL-03 | Evaluation shall use configurable rubric weights | Should |
| FR-EVAL-04 | Recruiter shall view full evaluation report per candidate | Must |

### 6.10 Ranking Agent

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RANK-01 | Agent shall rank all processed candidates for a job | Must |
| FR-RANK-02 | Ranking shall use composite score from prior agent stages | Must |
| FR-RANK-03 | Recruiter shall view ranked candidate list on dashboard | Must |
| FR-RANK-04 | Rankings shall update when new candidates are processed | Must |

### 6.11 Interview Agent

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-INT-01 | Agent shall generate technical interview questions based on candidate profile | Must |
| FR-INT-02 | Agent shall generate behavioral questions | Must |
| FR-INT-03 | Agent shall generate gap-probing questions for missing skills | Should |
| FR-INT-04 | Recruiter shall configure number of questions per category | Should |
| FR-INT-05 | Recruiter shall view and export interview questions | Must |

### 6.12 Workflow Orchestrator

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ORCH-01 | System shall execute workflow stages in configured order per candidate | Must |
| FR-ORCH-02 | System shall pass context and prior stage results to each agent | Must |
| FR-ORCH-03 | System shall track execution status per candidate and per stage | Must |
| FR-ORCH-04 | System shall handle agent failures gracefully with error logging | Must |
| FR-ORCH-05 | System shall support background/async processing of candidates | Must |
| FR-ORCH-06 | System shall trigger ranking after batch candidate processing | Must |

### 6.13 Recruiter Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DASH-01 | Dashboard shall display list of jobs with candidate counts and status | Must |
| FR-DASH-02 | Dashboard shall display candidate table with scores, rank, and pipeline status | Must |
| FR-DASH-03 | Recruiter shall open candidate detail view with all AI agent outputs | Must |
| FR-DASH-04 | Dashboard shall show workflow progress indicator per candidate | Should |
| FR-DASH-05 | Dashboard shall support filtering and sorting candidates | Should |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID | Requirement |
|----|-------------|
| NFR-PERF-01 | API response time for non-AI endpoints shall be ≤ 500ms under normal load |
| NFR-PERF-02 | Single candidate full pipeline processing shall complete within 2 minutes |
| NFR-PERF-03 | Dashboard shall load job list within 3 seconds |

### 7.2 Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-01 | All API endpoints (except auth) shall require valid JWT |
| NFR-SEC-02 | Passwords shall be hashed using bcrypt |
| NFR-SEC-03 | Resume files shall be accessible only to authorized recruiters |
| NFR-SEC-04 | LLM API keys shall be stored in environment variables, not source code |
| NFR-SEC-05 | Input validation shall be applied on all user inputs |

### 7.3 Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-01 | Failed agent stages shall not corrupt prior stage results |
| NFR-REL-02 | System shall retry LLM calls up to 2 times on transient failure |
| NFR-REL-03 | Partial pipeline results shall remain viewable if later stages fail |

### 7.4 Usability

| ID | Requirement |
|----|-------------|
| NFR-USE-01 | UI shall be responsive for desktop screens (1280px+) |
| NFR-USE-02 | Workflow builder shall support drag-and-drop without code |
| NFR-USE-03 | Error messages shall be clear and actionable |
| NFR-USE-04 | New recruiter shall complete first job setup within 10 minutes using defaults |

### 7.5 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAIN-01 | Each AI agent shall implement a common interface for extensibility |
| NFR-MAIN-02 | Backend shall expose OpenAPI documentation automatically |
| NFR-MAIN-03 | Database migrations shall be version-controlled via Alembic |

### 7.6 Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCAL-01 | Architecture shall support adding new agent types without modifying orchestrator core |
| NFR-SCAL-02 | Background task queue shall be pluggable (BackgroundTasks → Celery) |

---

## 8. Module Specifications

| Module | Description | Key Inputs | Key Outputs |
|--------|-------------|------------|-------------|
| **Recruiter Management** | Auth and profile | Credentials, profile data | JWT, recruiter record |
| **Job Management** | CRUD for job openings | Job metadata, JD text | Job record, status |
| **JD Processing Agent** | Extract requirements | Raw JD text | Structured requirements JSON |
| **Workflow Builder** | Visual pipeline config | Node graph, configs | Workflow definition JSON |
| **Resume Parser Agent** | Extract candidate data | PDF/DOCX file | Candidate profile JSON |
| **Screening Agent** | Relevance filter | Profile + requirements | Relevance score, reason |
| **Skill Matching Agent** | Skill gap analysis | Profile + requirements | Match score, skill matrix |
| **Evaluation Agent** | Qualitative assessment | Profile + match results | Evaluation report, score |
| **Ranking Agent** | Order candidates | All candidate scores | Ranked list |
| **Interview Agent** | Question generation | Profile + gaps | Question sets |
| **Orchestrator** | Pipeline execution | Workflow + candidates | Stage results, status |
| **Dashboard** | Recruiter UI | API data | Visual reports, actions |

---

## 9. Use Cases

### UC-01: Recruiter Registration & Login

**Actor:** Recruiter  
**Precondition:** None  
**Main Flow:**
1. Recruiter navigates to registration page
2. Enters name, email, password
3. System validates and creates account
4. Recruiter logs in with credentials
5. System returns JWT and redirects to dashboard

**Postcondition:** Recruiter is authenticated

---

### UC-02: Create Job Opening

**Actor:** Recruiter  
**Precondition:** Recruiter is logged in  
**Main Flow:**
1. Recruiter clicks "Create Job"
2. Enters title, description, location, experience range
3. Submits form
4. System saves job and triggers JD Processing Agent
5. Extracted requirements appear on job detail page
6. Default workflow is assigned to the job

**Postcondition:** Job is created with extracted requirements and default workflow

---

### UC-03: Configure Recruitment Workflow

**Actor:** Recruiter  
**Precondition:** Job exists  
**Main Flow:**
1. Recruiter opens Workflow Builder for a job
2. Views default pipeline nodes
3. Adds/removes nodes or adjusts configuration (thresholds, weights)
4. Connects nodes to define order
5. Saves workflow
6. System validates graph and persists configuration

**Postcondition:** Custom workflow is saved for the job

---

### UC-04: Upload and Process Resumes

**Actor:** Recruiter  
**Precondition:** Job exists with workflow configured  
**Main Flow:**
1. Recruiter uploads one or more resume files
2. System stores files and creates candidate records
3. Orchestrator starts pipeline for each candidate
4. Agents execute in workflow order
5. Stage results are saved after each agent
6. Ranking Agent runs after batch completion
7. Dashboard updates with scores and ranks

**Alternate Flow:** Screening score below threshold → candidate marked as filtered out, remaining stages skipped

**Postcondition:** Candidates are processed with full or partial AI reports

---

### UC-05: Review Candidate AI Report

**Actor:** Recruiter  
**Precondition:** Candidate processing is complete or in progress  
**Main Flow:**
1. Recruiter opens job candidate list
2. Selects a candidate
3. Views parsed profile, screening result, skill match, evaluation, rank, and interview questions
4. Uses insights for shortlist/reject decision

**Postcondition:** Recruiter has decision support data for the candidate

---

## 10. Data Requirements

### 10.1 Core Entities

- **Recruiter** — account and profile information
- **Job** — opening metadata and raw description
- **JobRequirements** — AI-extracted structured requirements
- **Workflow** — node/edge graph and configuration
- **Candidate** — applicant linked to a job
- **CandidateProfile** — parsed resume data
- **StageResult** — output from each agent per candidate
- **Ranking** — final rank and composite score

### 10.2 Data Retention

- Resume files retained until job is deleted or recruiter removes candidate
- AI agent outputs retained with candidate record
- Authentication tokens expire per JWT configuration (e.g., 24 hours)

### 10.3 Sample Data

System shall include seed data for demo:
- 1 demo recruiter account
- 2 sample job openings
- 5–10 sample resumes with varied profiles

---

## 11. External Integrations

| Integration | Purpose | Required |
|-------------|---------|----------|
| **LLM API** (OpenAI / Google Gemini) | Power all AI agents | Yes |
| **PostgreSQL** | Primary data store | Yes |
| **Redis** (optional) | Task queue for Celery | Optional |
| **Local/S3 Storage** | Resume file storage | Yes |

---

## 12. Constraints & Assumptions

### 12.1 Constraints

- Project must be demonstrable within MCA evaluation timeline (~10–12 weeks)
- LLM usage must stay within free/low-cost API tiers for development
- Resume formats limited to PDF and DOCX for MVP
- English-language resumes and job descriptions only

### 12.2 Assumptions

- Recruiters have stable internet access
- LLM API is available during demo
- Resumes follow conventional formats (not heavily scanned/image-only PDFs)
- Single-tenant model (each recruiter sees only their own data)

---

## 13. Acceptance Criteria

The project is considered complete when:

1. ✅ Recruiter can register, login, and manage job openings
2. ✅ Job description is automatically processed into structured requirements
3. ✅ Visual workflow builder saves and loads valid pipeline configurations
4. ✅ Resumes can be uploaded and parsed into candidate profiles
5. ✅ All six AI agents produce structured, viewable outputs
6. ✅ Orchestrator executes workflow stages in order with status tracking
7. ✅ Dashboard displays ranked candidates with detailed AI reports
8. ✅ System runs via Docker Compose with documented setup steps
9. ✅ Demo scenario completes end-to-end without manual intervention
10. ✅ Documentation (SRS, architecture, README) is delivered

---

## 14. Out of Scope

The following are explicitly excluded from the current version:

- Candidate-facing portal or application tracking for applicants
- Email/notification integration
- Calendar scheduling and interview booking
- Integration with external ATS/HRIS systems
- Multi-language resume support
- Video/audio interview analysis
- Bias detection and fairness auditing modules
- Mobile native applications
- Payment or subscription billing

---

## 15. Future Enhancements

1. Real-time pipeline progress via WebSockets
2. PDF export of candidate evaluation reports
3. Email alerts when processing completes
4. Bias detection and explainability dashboards
5. Custom agent plugins via configuration
6. Integration with LinkedIn/job boards
7. Collaborative hiring (multiple recruiters per job)
8. Analytics: funnel metrics, time-to-hire, source quality

---

*End of Document*
