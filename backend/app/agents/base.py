from dataclasses import dataclass, field
from typing import Any

from app.models.candidate import Candidate
from app.models.job import Job
from app.schemas.agent_outputs import CandidateProfileData
from app.schemas.job import JobRequirementsData


@dataclass
class AgentContext:
    job: Job
    candidate: Candidate
    requirements: JobRequirementsData
    profile: CandidateProfileData | None = None
    results: dict[str, dict[str, Any]] = field(default_factory=dict)
    config: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentResult:
    success: bool
    should_continue: bool
    score: float | None
    data: dict[str, Any]


class BaseAgent:
    node_type: str = ""

    def run(self, context: AgentContext) -> AgentResult:
        raise NotImplementedError
