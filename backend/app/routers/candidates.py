from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recruiter import Recruiter
from app.schemas.candidate import CandidateDetailResponse
from app.schemas.candidate_report import CandidateReportResponse
from app.services.auth_service import get_current_recruiter
from app.services import candidate_service

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.get("/{candidate_id}", response_model=CandidateDetailResponse)
def get_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> CandidateDetailResponse:
    return candidate_service.get_candidate(db, current_user.id, candidate_id)


@router.get("/{candidate_id}/report", response_model=CandidateReportResponse)
def get_candidate_report(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> CandidateReportResponse:
    return candidate_service.get_candidate_report(db, current_user.id, candidate_id)


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: str,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> None:
    candidate_service.delete_candidate(db, current_user.id, candidate_id)
