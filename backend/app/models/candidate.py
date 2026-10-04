import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CandidateStatus(str, enum.Enum):
    pending = "pending"
    parsing = "parsing"
    screening = "screening"
    skill_match = "skill_match"
    evaluating = "evaluating"
    ranked = "ranked"
    completed = "completed"
    filtered_out = "filtered_out"
    failed = "failed"


class StageResultStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    skipped = "skipped"
    failed = "failed"


class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(200), nullable=False)
    experience_years: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[CandidateStatus] = mapped_column(
        Enum(CandidateStatus),
        nullable=False,
        default=CandidateStatus.pending,
        index=True,
    )
    rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    match_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    eval_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    overall_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    resume_file_name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    resume_path: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    parse_error: Mapped[str | None] = mapped_column(String(500), nullable=True)
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

    job: Mapped["Job"] = relationship(back_populates="candidates")
    stage_results: Mapped[list["StageResult"]] = relationship(
        back_populates="candidate",
        cascade="all, delete-orphan",
        order_by="StageResult.executed_at",
    )


class StageResult(Base):
    __tablename__ = "stage_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("candidates.id", ondelete="CASCADE"),
        index=True,
    )
    stage_type: Mapped[str] = mapped_column(String(40), nullable=False)
    node_id: Mapped[str] = mapped_column(String(80), nullable=False, default="")
    result_data: Mapped[str] = mapped_column(Text, nullable=False, default="{}")
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[StageResultStatus] = mapped_column(
        Enum(StageResultStatus),
        nullable=False,
        default=StageResultStatus.pending,
    )
    executed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    candidate: Mapped[Candidate] = relationship(back_populates="stage_results")
