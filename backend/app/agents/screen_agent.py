from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import skill_matches_profile
from app.schemas.agent_outputs import ScreeningResultData


class ScreenAgent(BaseAgent):
    node_type = "screen"

    def run(self, context: AgentContext) -> AgentResult:
        threshold = int(context.config.get("screenThreshold", 60))
        profile = context.profile
        required = context.requirements.required_skills
        profile_skills = profile.skills if profile else []

        matched_required = [skill for skill in required if skill_matches_profile(skill, profile_skills)]
        overlap_ratio = len(matched_required) / len(required) if required else 0.6
        experience_ok = bool(profile and profile.experience_years >= context.job.min_experience)

        score = int(min(100, 30 + overlap_ratio * 55 + (15 if experience_ok else 0)))
        if not required:
            score = 72 if experience_ok else 58

        relevant = score >= threshold
        result = ScreeningResultData(
            relevant=relevant,
            relevance_score=score,
            reason=(
                f"Candidate aligns with {len(matched_required)} of {len(required)} required skills for {context.job.title}."
                if relevant
                else "Candidate profile shows limited overlap with core job requirements."
            ),
            key_qualifications=matched_required[:4] or profile_skills[:4],
            red_flags=[] if relevant else ["Limited role-specific skill overlap"],
        )

        return AgentResult(
            success=True,
            should_continue=relevant,
            score=float(score),
            data=result.model_dump(),
        )
