from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recruiter import Recruiter
from app.schemas.candidate import (
    CandidateListResponse,
    ProcessCandidatesRequest,
    ProcessCandidatesResponse,
)
from app.schemas.job import JobCreateRequest, JobListResponse, JobResponse, JobUpdateRequest
from app.schemas.workflow import WorkflowResponse, WorkflowSaveRequest
from app.services.auth_service import get_current_recruiter
from app.services import candidate_service
from app.services import job_service
from app.services import workflow_service

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListResponse)
def list_jobs(
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> JobListResponse:
    return job_service.list_jobs(db, current_user.id)


@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreateRequest,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> JobResponse:
    return job_service.create_job(db, current_user.id, payload)


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> JobResponse:
    return job_service.get_job(db, current_user.id, job_id)


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    payload: JobUpdateRequest,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> JobResponse:
    return job_service.update_job(db, current_user.id, job_id, payload)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> None:
    job_service.delete_job(db, current_user.id, job_id)


@router.post("/{job_id}/process-jd", response_model=JobResponse)
def process_job_description(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> JobResponse:
    return job_service.reprocess_job_description(db, current_user.id, job_id)


@router.get("/{job_id}/workflow", response_model=WorkflowResponse)
def get_job_workflow(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> WorkflowResponse:
    return workflow_service.get_workflow(db, current_user.id, job_id)


@router.put("/{job_id}/workflow", response_model=WorkflowResponse)
def save_job_workflow(
    job_id: str,
    payload: WorkflowSaveRequest,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> WorkflowResponse:
    return workflow_service.save_workflow(db, current_user.id, job_id, payload)


@router.get("/{job_id}/candidates", response_model=CandidateListResponse)
def list_job_candidates(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> CandidateListResponse:
    return candidate_service.list_candidates_by_job(db, current_user.id, job_id)


@router.post("/{job_id}/candidates/upload", response_model=CandidateListResponse, status_code=status.HTTP_201_CREATED)
async def upload_job_candidates(
    job_id: str,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> CandidateListResponse:
    return await candidate_service.upload_resumes(db, current_user.id, job_id, files)


@router.post("/{job_id}/candidates/process", response_model=ProcessCandidatesResponse)
def process_job_candidates(
    job_id: str,
    payload: ProcessCandidatesRequest = ProcessCandidatesRequest(),
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> ProcessCandidatesResponse:
    return candidate_service.process_candidates(db, current_user.id, job_id, payload.candidate_ids)
