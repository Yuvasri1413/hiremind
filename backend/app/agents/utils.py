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


def normalize_skill(value: str) -> str:
    return " ".join(value.strip().lower().split())


def skill_matches_profile(skill: str, profile_skills: list[str]) -> bool:
    target = normalize_skill(skill)
    if not target:
        return False
    for profile_skill in profile_skills:
        normalized = normalize_skill(profile_skill)
        if target == normalized or target in normalized or normalized in target:
            return True
    return False


def default_skills(context: AgentContext) -> list[str]:
    required = context.requirements.required_skills
    if required:
        count = min(3, len(required))
        return required[:count]
    return ["Communication", "Problem solving", "Team collaboration"]
