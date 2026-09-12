import hashlib

from app.agents.base import AgentContext, AgentResult
from app.schemas.agent_outputs import CandidateProfileData


class BaseAgent:
    node_type: str = ""

    def run(self, context: AgentContext) -> AgentResult:
        raise NotImplementedError


def seed_value(context: AgentContext) -> int:
    digest = hashlib.md5(
        f"{context.candidate.email}:{context.candidate.name}:{context.job.id}".encode()
    ).hexdigest()
    return int(digest[:8], 16)


def default_skills(context: AgentContext) -> list[str]:
    required = context.requirements.required_skills
    if required:
        count = min(3, len(required))
        return required[:count]
    return ["Communication", "Problem solving", "Team collaboration"]
