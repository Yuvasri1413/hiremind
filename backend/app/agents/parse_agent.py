from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import default_skills, seed_value
from app.schemas.agent_outputs import CandidateProfileData


class ParseAgent(BaseAgent):
    node_type = "parse"

    def run(self, context: AgentContext) -> AgentResult:
        seed = seed_value(context)
        experience_years = (seed % 6) + 1
        skills = default_skills(context)
        preferred = context.requirements.preferred_skills[:2]
        if preferred:
            skills = list(dict.fromkeys(skills + preferred[:1]))

        profile = CandidateProfileData(
            skills=skills,
            education=context.requirements.education or "Relevant technical degree",
            experience=f"{experience_years} years",
            experience_years=experience_years,
        )
        context.profile = profile

        return AgentResult(
            success=True,
            should_continue=True,
            score=None,
            data=profile.model_dump(),
        )
