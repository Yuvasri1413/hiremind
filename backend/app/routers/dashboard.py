from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recruiter import Recruiter
from app.schemas.dashboard import DashboardStatsResponse
from app.services.auth_service import get_current_recruiter
from app.services import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> DashboardStatsResponse:
    return dashboard_service.get_dashboard_stats(db, current_user.id)
