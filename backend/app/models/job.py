import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class JobStatus(str, enum.Enum):
    draft = "draft"
    open = "open"
    closed = "closed"


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    recruiter_id: Mapped[str] = mapped_column(String(36), ForeignKey("recruiters.id"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    location: Mapped[str] = mapped_column(String(120), nullable=False, default="Not specified")
    min_experience: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    max_experience: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), nullable=False, default=JobStatus.draft)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    requirements: Mapped["JobRequirements | None"] = relationship(
        back_populates="job",
        uselist=False,
        cascade="all, delete-orphan",
    )
    workflow: Mapped["Workflow | None"] = relationship(
        back_populates="job",
        uselist=False,
        cascade="all, delete-orphan",
    )
    candidates: Mapped[list["Candidate"]] = relationship(
        back_populates="job",
        cascade="all, delete-orphan",
    )


class JobRequirements(Base):
    __tablename__ = "job_requirements"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("jobs.id"), unique=True, index=True)
    required_skills: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    preferred_skills: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    min_experience_label: Mapped[str] = mapped_column(String(80), nullable=False, default="")
    education: Mapped[str] = mapped_column(String(200), nullable=False, default="")
    responsibilities: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    job: Mapped[Job] = relationship(back_populates="requirements")
