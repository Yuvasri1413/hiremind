from typing import Any

from pydantic import BaseModel, Field


class PipelineStageReport(BaseModel):
    key: str
    label: str
    status: str


class CandidateReportResponse(BaseModel):
    pipeline: list[PipelineStageReport] = Field(default_factory=list)
    parsed_profile: dict[str, Any] | None = None
    screening: dict[str, Any] | None = None
    skill_match: dict[str, Any] | None = None
    evaluation: dict[str, Any] | None = None
    interview_questions: dict[str, Any] | None = None
