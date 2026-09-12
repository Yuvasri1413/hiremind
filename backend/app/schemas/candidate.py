from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

CandidateStatusLiteral = Literal[
    "pending",
    "parsing",
    "screening",
    "skill_match",
    "evaluating",
    "ranked",
    "completed",
    "filtered_out",
    "failed",
]

StageStatusLiteral = Literal["pending", "running", "completed", "skipped", "failed"]


class CandidateResponse(BaseModel):
    id: str
    job_id: str
    name: str
    email: str
    experience_years: int
    status: CandidateStatusLiteral
    rank: int | None = None
    match_score: float | None = None
    eval_score: float | None = None
    overall_score: float | None = None
    resume_file_name: str = ""
    created_at: datetime

    model_config = {"from_attributes": True}


class CandidateListResponse(BaseModel):
    items: list[CandidateResponse]
    total: int


class PipelineStageResponse(BaseModel):
    key: str
    label: str
    status: StageStatusLiteral


class StageResultResponse(BaseModel):
    id: str
    stage_type: str
    node_id: str
    score: float | None = None
    status: StageStatusLiteral
    result_data: dict[str, Any] = Field(default_factory=dict)
    executed_at: datetime


class CandidateDetailResponse(CandidateResponse):
    pipeline: list[PipelineStageResponse] = Field(default_factory=list)
    stage_results: list[StageResultResponse] = Field(default_factory=list)


class ProcessCandidatesRequest(BaseModel):
    candidate_ids: list[str] | None = None


class ProcessCandidatesResponse(BaseModel):
    processed: int
    items: list[CandidateResponse]
