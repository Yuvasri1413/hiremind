from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recruiter import Recruiter
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RecruiterResponse,
    RegisterRequest,
    TokenResponse,
    UpdateProfileRequest,
)
from app.services.auth_service import (
    change_recruiter_password,
    get_current_recruiter,
    login_recruiter,
    register_recruiter,
    update_recruiter_profile,
)

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


@router.patch("/me", response_model=RecruiterResponse)
def update_me(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> RecruiterResponse:
    return update_recruiter_profile(db, current_user, payload)


@router.post("/change-password", status_code=204)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: Recruiter = Depends(get_current_recruiter),
) -> None:
    change_recruiter_password(db, current_user, payload)
