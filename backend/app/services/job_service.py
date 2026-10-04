import json

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.data.default_workflow import create_default_workflow, workflow_for_job_title
from app.models.candidate import Candidate, CandidateStatus
from app.models.job import Job, JobRequirements, JobStatus
from app.models.recruiter import Recruiter
from app.models.workflow import Workflow
from app.schemas.job import (
    JobCreateRequest,
    JobListResponse,
    JobRequirementsResponse,
    JobResponse,
    JobUpdateRequest,
)
from app.services.jd_processor import (
    extract_requirements,
    requirements_from_model,
    requirements_to_json_fields,
)
from app.services.mock_pipeline import recompute_job_ranks
from app.services.orchestrator import execute_for_candidate
from app.utils.security import hash_password

DEMO_EMAIL = "recruiter@hiremind.com"
DEMO_PASSWORD = "password123"
DEMO_NAME = "Demo Recruiter"

SAMPLE_JOBS: list[JobCreateRequest] = [
    JobCreateRequest(
        title="Backend Developer",
        description=(
            "We are looking for a Python developer with FastAPI and PostgreSQL experience "
            "to build scalable APIs."
        ),
        location="Remote",
        min_experience=2,
        max_experience=5,
        status="open",
    ),
    JobCreateRequest(
        title="Frontend Developer",
        description=(
            "Join our team to build modern React applications with TypeScript and Material UI."
        ),
        location="Bangalore",
        min_experience=1,
        max_experience=4,
        status="open",
    ),
    JobCreateRequest(
        title="Data Analyst",
        description=(
            "Analyze recruitment metrics and candidate pipeline data. SQL and Excel required."
        ),
        location="Mumbai",
        min_experience=2,
        max_experience=6,
        status="closed",
    ),
    JobCreateRequest(
        title="DevOps Engineer",
        description=(
            "Manage CI/CD pipelines, Docker, and cloud infrastructure for our hiring platform."
        ),
        location="Hyderabad",
        min_experience=3,
        max_experience=7,
        status="draft",
    ),
    JobCreateRequest(
        title="UI Designer",
        description=(
            "Design elegant recruiter dashboards and workflow builder interfaces."
        ),
        location="Mumbai",
        min_experience=1,
        max_experience=3,
        status="draft",
    ),
]

# (name, email, experience_years, resume_file_name)
SAMPLE_CANDIDATES_BY_JOB_TITLE: dict[str, list[tuple[str, str, int, str]]] = {
    "Backend Developer": [
        ("John Doe", "john.doe@email.com", 3, "john_doe_resume.pdf"),
        ("Jane Smith", "jane.smith@email.com", 4, "jane_smith_resume.pdf"),
        ("Bob Lee", "bob.lee@email.com", 1, "bob_lee_resume.pdf"),
    ],
    "Frontend Developer": [
        ("Priya Sharma", "priya.sharma@email.com", 2, "priya_sharma_resume.pdf"),
        ("Arjun Patel", "arjun.patel@email.com", 3, "arjun_patel_resume.pdf"),
        ("Meera Nair", "meera.nair@email.com", 1, "meera_nair_resume.pdf"),
    ],
    "Data Analyst": [
        ("Rahul Verma", "rahul.verma@email.com", 5, "rahul_verma_resume.pdf"),
        ("Sneha Iyer", "sneha.iyer@email.com", 4, "sneha_iyer_resume.pdf"),
    ],
    "DevOps Engineer": [
        ("Karan Mehta", "karan.mehta@email.com", 4, "karan_mehta_resume.pdf"),
        ("Divya Rao", "divya.rao@email.com", 5, "divya_rao_resume.pdf"),
    ],
    "UI Designer": [
        ("Ananya Das", "ananya.das@email.com", 2, "ananya_das_resume.pdf"),
        ("Vikram Singh", "vikram.singh@email.com", 3, "vikram_singh_resume.pdf"),
    ],
}


def _seed_sample_jobs(db: Session, recruiter_id: str) -> None:
    for payload in SAMPLE_JOBS:
        exists = (
            db.query(Job)
            .filter(Job.recruiter_id == recruiter_id, Job.title == payload.title)
            .first()
        )
        if not exists:
            create_job(db, recruiter_id, payload)


def seed_demo_data(db: Session) -> None:
    recruiter = db.query(Recruiter).filter(Recruiter.email == DEMO_EMAIL).first()
    if not recruiter:
        recruiter = Recruiter(
            name=DEMO_NAME,
            email=DEMO_EMAIL,
            hashed_password=hash_password(DEMO_PASSWORD),
        )
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)

    for account in db.query(Recruiter).all():
        has_jobs = db.query(Job).filter(Job.recruiter_id == account.id).count() > 0
        if not has_jobs:
            _seed_sample_jobs(db, account.id)
        _seed_default_workflows(db, account.id)
        _seed_candidates_for_recruiter(db, account.id)


def _seed_default_workflows(db: Session, recruiter_id: str) -> None:
    jobs = db.query(Job).filter(Job.recruiter_id == recruiter_id).all()
    if not jobs:
        return

    sample_titles = {payload.title for payload in SAMPLE_JOBS}
    changed = False
    for job in jobs:
        template = workflow_for_job_title(job.title)
        definition = json.dumps(template)

        if job.workflow:
            if job.workflow.is_default and job.title in sample_titles:
                job.workflow.definition = definition
                changed = True
            continue

        db.add(Workflow(job_id=job.id, definition=definition, is_default=True))
        changed = True

    if changed:
        db.commit()


def _seed_candidates_for_job(db: Session, job: Job) -> bool:
    """Add missing sample candidates for known job titles and run pipeline on new rows."""
    demo_rows = SAMPLE_CANDIDATES_BY_JOB_TITLE.get(job.title)
    if not demo_rows:
        return False

    existing_emails = {
        c.email.lower()
        for c in db.query(Candidate).filter(Candidate.job_id == job.id).all()
    }
    new_candidates: list[Candidate] = []
    for name, email, experience, resume_name in demo_rows:
        if email.lower() in existing_emails:
            continue
        candidate = Candidate(
            job_id=job.id,
            name=name,
            email=email,
            experience_years=experience,
            status=CandidateStatus.pending,
            resume_file_name=resume_name,
        )
        db.add(candidate)
        new_candidates.append(candidate)

    if not new_candidates:
        return False

    db.commit()
    for candidate in new_candidates:
        db.refresh(candidate)

    refreshed_job = db.query(Job).filter(Job.id == job.id).first()
    if not refreshed_job:
        return True

    for candidate in new_candidates:
        execute_for_candidate(db, refreshed_job, candidate)
    recompute_job_ranks(db, job.id)
    return True


def _seed_candidates_for_recruiter(db: Session, recruiter_id: str) -> None:
    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .order_by(Job.created_at.asc())
        .all()
    )
    for job in jobs:
        _seed_candidates_for_job(db, job)


def _to_requirements_response(requirements: JobRequirements) -> JobRequirementsResponse:
    data = requirements_from_model(requirements)
    return JobRequirementsResponse(
        required_skills=data.required_skills,
        preferred_skills=data.preferred_skills,
        min_experience=data.min_experience,
        education=data.education,
        responsibilities=data.responsibilities,
    )


def _to_job_response(job: Job, db: Session | None = None, include_requirements: bool = False) -> JobResponse:
    requirements = None
    if include_requirements and job.requirements:
        requirements = _to_requirements_response(job.requirements)

    candidate_count = 0
    avg_score = None
    if db is not None:
        from app.services.candidate_service import compute_job_candidate_stats

        candidate_count, avg_score = compute_job_candidate_stats(db, job.id)

    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description,
        location=job.location,
        min_experience=job.min_experience,
        max_experience=job.max_experience,
        status=job.status.value,
        candidate_count=candidate_count,
        avg_score=avg_score,
        created_at=job.created_at,
        requirements=requirements,
    )


def _get_owned_job(db: Session, recruiter_id: str, job_id: str) -> Job:
    job = db.query(Job).filter(Job.id == job_id, Job.recruiter_id == recruiter_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


def _save_requirements(db: Session, job: Job) -> JobRequirements:
    extracted = extract_requirements(job)
    fields = requirements_to_json_fields(extracted)

    if job.requirements:
        req = job.requirements
        for key, value in fields.items():
            setattr(req, key, value)
    else:
        req = JobRequirements(job_id=job.id, **fields)
        db.add(req)

    db.commit()
    db.refresh(job)
    return job.requirements  # type: ignore[return-value]


def list_jobs(db: Session, recruiter_id: str) -> JobListResponse:
    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .order_by(Job.created_at.desc())
        .all()
    )
    items = [_to_job_response(job, db) for job in jobs]
    return JobListResponse(items=items, total=len(items))


def get_job(db: Session, recruiter_id: str, job_id: str) -> JobResponse:
    job = _get_owned_job(db, recruiter_id, job_id)
    return _to_job_response(job, db, include_requirements=True)


def create_job(db: Session, recruiter_id: str, payload: JobCreateRequest) -> JobResponse:
    job = Job(
        recruiter_id=recruiter_id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        location=payload.location.strip() or "Not specified",
        min_experience=payload.min_experience,
        max_experience=payload.max_experience,
        status=JobStatus(payload.status),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    _save_requirements(db, job)
    _attach_default_workflow(db, job.id)
    return _to_job_response(job, db, include_requirements=True)


def _attach_default_workflow(db: Session, job_id: str) -> None:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job or job.workflow:
        return
    graph = workflow_for_job_title(job.title)
    db.add(
        Workflow(
            job_id=job_id,
            definition=json.dumps(graph),
            is_default=True,
        )
    )
    db.commit()


def update_job(
    db: Session,
    recruiter_id: str,
    job_id: str,
    payload: JobUpdateRequest,
) -> JobResponse:
    job = _get_owned_job(db, recruiter_id, job_id)
    description_changed = False

    if payload.title is not None:
        job.title = payload.title.strip()
    if payload.description is not None:
        job.description = payload.description.strip()
        description_changed = True
    if payload.location is not None:
        job.location = payload.location.strip() or "Not specified"
    if payload.min_experience is not None:
        job.min_experience = payload.min_experience
    if payload.max_experience is not None:
        job.max_experience = payload.max_experience
    if payload.status is not None:
        job.status = JobStatus(payload.status)

    db.commit()
    db.refresh(job)

    if description_changed:
        _save_requirements(db, job)

    return _to_job_response(job, db, include_requirements=True)


def delete_job(db: Session, recruiter_id: str, job_id: str) -> None:
    job = _get_owned_job(db, recruiter_id, job_id)
    db.delete(job)
    db.commit()


def reprocess_job_description(db: Session, recruiter_id: str, job_id: str) -> JobResponse:
    job = _get_owned_job(db, recruiter_id, job_id)
    _save_requirements(db, job)
    return _to_job_response(job, db, include_requirements=True)
