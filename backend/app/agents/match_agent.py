from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import skill_matches_profile
from app.schemas.agent_outputs import SkillMatchResultData


class MatchAgent(BaseAgent):
    node_type = "match"

    def run(self, context: AgentContext) -> AgentResult:
        required = context.requirements.required_skills
        preferred = context.requirements.preferred_skills
        profile_skills = context.profile.skills if context.profile else []

        matched = [skill for skill in required if skill_matches_profile(skill, profile_skills)]
        partial = [
            skill
            for skill in preferred
            if skill_matches_profile(skill, profile_skills) and skill not in matched
        ]

        missing_required = [skill for skill in required if skill not in matched]
        missing_preferred = [skill for skill in preferred if not skill_matches_profile(skill, profile_skills)]
        missing = missing_required + [f"{skill} (preferred)" for skill in missing_preferred[:3]]

        if required:
            score = int(round(100 * len(matched) / len(required)))
            score = max(35, min(100, score + min(10, len(partial) * 3)))
        else:
            score = 75

        result = SkillMatchResultData(
            match_score=score,
            matched_skills=matched or profile_skills[:3],
            missing_skills=missing,
            partial_matches=partial[:5],
        )

        return AgentResult(
            success=True,
            should_continue=True,
            score=float(score),
            data=result.model_dump(),
        )
