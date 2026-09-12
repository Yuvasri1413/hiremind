from pydantic import BaseModel, Field


class CandidateProfileData(BaseModel):
    skills: list[str] = Field(default_factory=list)
    education: str = ""
    experience: str = ""
    experience_years: int = 0


class ScreeningResultData(BaseModel):
    relevant: bool
    relevance_score: int
    reason: str
    key_qualifications: list[str] = Field(default_factory=list)
    red_flags: list[str] = Field(default_factory=list)


class SkillMatchResultData(BaseModel):
    match_score: int
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    partial_matches: list[str] = Field(default_factory=list)


class EvaluationResultData(BaseModel):
    overall_score: int
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    fit_summary: str = ""
    recommendation: str = "Hold"
    rubric_breakdown: dict[str, int] = Field(default_factory=dict)


class RankingResultData(BaseModel):
    composite_score: float
    screening_weight: float
    match_weight: float
    evaluation_weight: float


class InterviewQuestionsData(BaseModel):
    technical: list[str] = Field(default_factory=list)
    behavioral: list[str] = Field(default_factory=list)
    gap_probing: list[str] = Field(default_factory=list)
