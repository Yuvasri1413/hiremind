from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import seed_value
from app.schemas.agent_outputs import SkillMatchResultData


class MatchAgent(BaseAgent):
    node_type = "match"

    def run(self, context: AgentContext) -> AgentResult:
        seed = seed_value(context)
        required = context.requirements.required_skills
        preferred = context.requirements.preferred_skills
        profile_skills = context.profile.skills if context.profile else []

        matched = [skill for skill in required if skill in profile_skills]
        if not matched and required:
            matched = required[: max(1, len(required) // 2)]

        missing_required = [skill for skill in required if skill not in matched]
        missing_preferred = [skill for skill in preferred if skill not in profile_skills]
        missing = missing_required + [f"{skill} (preferred)" for skill in missing_preferred[:2]]

        score = 60 + (seed % 35)
        if missing_required:
            score = max(45, score - len(missing_required) * 8)

        result = SkillMatchResultData(
            match_score=score,
            matched_skills=matched or profile_skills[:3],
            missing_skills=missing,
            partial_matches=["SQL -> PostgreSQL"] if "SQL" in profile_skills else [],
        )

        return AgentResult(
            success=True,
            should_continue=True,
            score=float(score),
            data=result.model_dump(),
        )
