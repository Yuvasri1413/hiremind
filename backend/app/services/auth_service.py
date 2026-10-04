from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
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
from app.utils.security import create_access_token, decode_access_token, hash_password, verify_password

security_scheme = HTTPBearer(auto_error=False)


def register_recruiter(db: Session, payload: RegisterRequest) -> RecruiterResponse:
    existing = db.query(Recruiter).filter(Recruiter.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    recruiter = Recruiter(
        name=payload.name.strip(),
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
    )
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)
    return RecruiterResponse.model_validate(recruiter)


def login_recruiter(db: Session, payload: LoginRequest) -> TokenResponse:
    recruiter = db.query(Recruiter).filter(Recruiter.email == payload.email.lower()).first()
    if not recruiter or not verify_password(payload.password, recruiter.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(recruiter.id)
    return TokenResponse(access_token=token)


def get_current_recruiter(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Recruiter:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    recruiter_id = decode_access_token(credentials.credentials)
    if not recruiter_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    recruiter = db.query(Recruiter).filter(Recruiter.id == recruiter_id).first()
    if not recruiter:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return recruiter


def update_recruiter_profile(
    db: Session,
    recruiter: Recruiter,
    payload: UpdateProfileRequest,
) -> RecruiterResponse:
    recruiter.name = payload.name.strip()
    db.commit()
    db.refresh(recruiter)
    return RecruiterResponse.model_validate(recruiter)


def change_recruiter_password(
    db: Session,
    recruiter: Recruiter,
    payload: ChangePasswordRequest,
) -> None:
    if not verify_password(payload.current_password, recruiter.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )
    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )
    recruiter.hashed_password = hash_password(payload.new_password)
    db.commit()
