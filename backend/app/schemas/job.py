from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

JobStatusLiteral = Literal["draft", "open", "closed"]


class JobRequirementsData(BaseModel):
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)
    min_experience: str = ""
    education: str = ""
    responsibilities: list[str] = Field(default_factory=list)


class JobCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10)
    location: str = Field(default="Not specified", max_length=120)
    min_experience: int = Field(default=0, ge=0)
    max_experience: int = Field(default=0, ge=0)
    status: JobStatusLiteral = "draft"


class JobUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = Field(default=None, min_length=10)
    location: str | None = Field(default=None, max_length=120)
    min_experience: int | None = Field(default=None, ge=0)
    max_experience: int | None = Field(default=None, ge=0)
    status: JobStatusLiteral | None = None


class JobRequirementsResponse(BaseModel):
    required_skills: list[str]
    preferred_skills: list[str]
    min_experience: str
    education: str
    responsibilities: list[str]


class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    location: str
    min_experience: int
    max_experience: int
    status: JobStatusLiteral
    candidate_count: int = 0
    avg_score: float | None = None
    created_at: datetime
    requirements: JobRequirementsResponse | None = None

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    items: list[JobResponse]
    total: int
