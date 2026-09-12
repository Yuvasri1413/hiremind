from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.candidate import Candidate, CandidateStatus
from app.models.job import Job, JobRequirements, JobStatus
from app.models.recruiter import Recruiter
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

    existing_jobs = db.query(Job).filter(Job.recruiter_id == recruiter.id).count()
    if existing_jobs == 0:
        samples = [
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
        ]

        for payload in samples:
            create_job(db, recruiter.id, payload)

    seed_demo_candidates(db, recruiter.id)


def seed_demo_candidates(db: Session, recruiter_id: str) -> None:
    existing = (
        db.query(Candidate)
        .join(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .count()
    )
    if existing > 0:
        return

    jobs = (
        db.query(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .order_by(Job.created_at.asc())
        .all()
    )
    if not jobs:
        return

    backend_job = jobs[0]
    frontend_job = jobs[1] if len(jobs) > 1 else jobs[0]

    demo_rows = [
        (backend_job.id, "John Doe", "john.doe@email.com", 3, "john_doe_resume.pdf"),
        (backend_job.id, "Jane Smith", "jane.smith@email.com", 4, "jane_smith_resume.pdf"),
        (backend_job.id, "Bob Lee", "bob.lee@email.com", 1, "bob_lee_resume.pdf"),
        (frontend_job.id, "Priya Sharma", "priya.sharma@email.com", 2, "priya_sharma_resume.pdf"),
        (frontend_job.id, "Arjun Patel", "arjun.patel@email.com", 3, "arjun_patel_resume.pdf"),
    ]

    for job_id, name, email, experience, resume_name in demo_rows:
        candidate = Candidate(
            job_id=job_id,
            name=name,
            email=email,
            experience_years=experience,
            status=CandidateStatus.pending,
            resume_file_name=resume_name,
        )
        db.add(candidate)

    db.commit()

    for job in {backend_job, frontend_job}:
        pending = db.query(Candidate).filter(Candidate.job_id == job.id).all()
        refreshed_job = db.query(Job).filter(Job.id == job.id).first()
        if not refreshed_job:
            continue
        for candidate in pending:
            execute_for_candidate(db, refreshed_job, candidate)
        recompute_job_ranks(db, job.id)


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
    return _to_job_response(job, db, include_requirements=True)


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
