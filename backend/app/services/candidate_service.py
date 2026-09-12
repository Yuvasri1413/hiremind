import json
import shutil
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.models.candidate import Candidate, CandidateStatus, StageResult
from app.schemas.candidate import (
    CandidateDetailResponse,
    CandidateListResponse,
    CandidateResponse,
    PipelineStageResponse,
    ProcessCandidatesResponse,
    StageResultResponse,
)
from app.schemas.candidate_report import CandidateReportResponse
from app.services.candidate_report_service import build_candidate_report
from app.services.job_service import _get_owned_job
from app.services.mock_pipeline import (
    build_pipeline_stages,
    email_from_name,
    name_from_filename,
    recompute_job_ranks,
)
from app.services.orchestrator import execute_for_candidate

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def ensure_upload_dir() -> Path:
    upload_root = Path(settings.upload_dir)
    upload_root.mkdir(parents=True, exist_ok=True)
    return upload_root


def _to_candidate_response(candidate: Candidate) -> CandidateResponse:
    return CandidateResponse(
        id=candidate.id,
        job_id=candidate.job_id,
        name=candidate.name,
        email=candidate.email,
        experience_years=candidate.experience_years,
        status=candidate.status.value,
        rank=candidate.rank,
        match_score=candidate.match_score,
        eval_score=candidate.eval_score,
        overall_score=candidate.overall_score,
        resume_file_name=candidate.resume_file_name,
        created_at=candidate.created_at,
    )


def _to_stage_result_response(result: StageResult) -> StageResultResponse:
    try:
        result_data = json.loads(result.result_data)
    except json.JSONDecodeError:
        result_data = {}

    return StageResultResponse(
        id=result.id,
        stage_type=result.stage_type,
        node_id=result.node_id,
        score=result.score,
        status=result.status.value,
        result_data=result_data if isinstance(result_data, dict) else {},
        executed_at=result.executed_at,
    )


def _get_owned_candidate(db: Session, recruiter_id: str, candidate_id: str) -> Candidate:
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    _get_owned_job(db, recruiter_id, candidate.job_id)
    return candidate


def list_candidates_by_job(db: Session, recruiter_id: str, job_id: str) -> CandidateListResponse:
    _get_owned_job(db, recruiter_id, job_id)
    candidates = (
        db.query(Candidate)
        .filter(Candidate.job_id == job_id)
        .order_by(Candidate.rank.asc().nullslast(), Candidate.created_at.desc())
        .all()
    )
    items = [_to_candidate_response(candidate) for candidate in candidates]
    return CandidateListResponse(items=items, total=len(items))


def get_candidate(db: Session, recruiter_id: str, candidate_id: str) -> CandidateDetailResponse:
    candidate = _get_owned_candidate(db, recruiter_id, candidate_id)
    base = _to_candidate_response(candidate)
    pipeline = [
        PipelineStageResponse(**stage)
        for stage in build_pipeline_stages(candidate)
    ]
    stage_results = [_to_stage_result_response(result) for result in candidate.stage_results]
    return CandidateDetailResponse(
        **base.model_dump(),
        pipeline=pipeline,
        stage_results=stage_results,
    )


def delete_candidate(db: Session, recruiter_id: str, candidate_id: str) -> None:
    candidate = _get_owned_candidate(db, recruiter_id, candidate_id)
    job_id = candidate.job_id

    if candidate.resume_path:
        resume_path = Path(candidate.resume_path)
        if resume_path.exists():
            resume_path.unlink()

    db.delete(candidate)
    db.commit()
    recompute_job_ranks(db, job_id)


def _validate_upload(file: UploadFile) -> None:
    filename = file.filename or ""
    extension = Path(filename).suffix.lower()
    content_type = (file.content_type or "").lower()

    if extension not in ALLOWED_EXTENSIONS and content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {filename or 'unknown'}",
        )


async def upload_resumes(
    db: Session,
    recruiter_id: str,
    job_id: str,
    files: list[UploadFile],
) -> CandidateListResponse:
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files uploaded")

    _get_owned_job(db, recruiter_id, job_id)
    upload_root = ensure_upload_dir()
    job_dir = upload_root / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    created: list[Candidate] = []

    for file in files:
        _validate_upload(file)
        filename = Path(file.filename or "resume.pdf").name
        name = name_from_filename(filename)
        email = email_from_name(name)
        destination = job_dir / f"{len(created) + 1}_{filename}"

        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        candidate = Candidate(
            job_id=job_id,
            name=name,
            email=email,
            status=CandidateStatus.pending,
            resume_file_name=filename,
            resume_path=str(destination),
        )
        db.add(candidate)
        created.append(candidate)

    db.commit()
    for candidate in created:
        db.refresh(candidate)

    items = [_to_candidate_response(candidate) for candidate in created]
    return CandidateListResponse(items=items, total=len(items))


def get_candidate_report(db: Session, recruiter_id: str, candidate_id: str) -> CandidateReportResponse:
    candidate = _get_owned_candidate(db, recruiter_id, candidate_id)
    return build_candidate_report(candidate)


def process_candidates(
    db: Session,
    recruiter_id: str,
    job_id: str,
    candidate_ids: list[str] | None = None,
) -> ProcessCandidatesResponse:
    job = _get_owned_job(db, recruiter_id, job_id)

    query = db.query(Candidate).filter(Candidate.job_id == job_id)
    if candidate_ids:
        query = query.filter(Candidate.id.in_(candidate_ids))

    candidates = query.all()
    if not candidates:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No candidates to process")

    processed: list[Candidate] = []
    for candidate in candidates:
        if candidate.status in {CandidateStatus.pending, CandidateStatus.failed}:
            db.query(StageResult).filter(StageResult.candidate_id == candidate.id).delete()
            candidate.rank = None
            candidate.match_score = None
            candidate.eval_score = None
            candidate.overall_score = None
            db.commit()
            processed.append(execute_for_candidate(db, job, candidate))

    recompute_job_ranks(db, job_id)

    refreshed = (
        db.query(Candidate)
        .filter(Candidate.id.in_([candidate.id for candidate in processed]))
        .all()
    )
    items = [_to_candidate_response(candidate) for candidate in refreshed]
    return ProcessCandidatesResponse(processed=len(items), items=items)


def compute_job_candidate_stats(db: Session, job_id: str) -> tuple[int, float | None]:
    candidates = db.query(Candidate).filter(Candidate.job_id == job_id).all()
    count = len(candidates)
    scored = [
        candidate.overall_score
        for candidate in candidates
        if candidate.overall_score is not None
    ]
    avg_score = round(sum(scored) / len(scored), 1) if scored else None
    return count, avg_score
