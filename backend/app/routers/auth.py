from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recruiter import Recruiter
from app.schemas.auth import LoginRequest, RecruiterResponse, RegisterRequest, TokenResponse
from app.services.auth_service import get_current_recruiter, login_recruiter, register_recruiter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RecruiterResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> RecruiterResponse:
    return register_recruiter(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    return login_recruiter(db, payload)


@router.get("/me", response_model=RecruiterResponse)
def me(current_user: Recruiter = Depends(get_current_recruiter)) -> RecruiterResponse:
    return RecruiterResponse.model_validate(current_user)
