from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import default_skills, seed_value
from app.schemas.agent_outputs import CandidateProfileData
from app.services.resume_parser import parse_resume_file


class ParseAgent(BaseAgent):
    node_type = "parse"

    def run(self, context: AgentContext) -> AgentResult:
        if context.profile:
            return AgentResult(
                success=True,
                should_continue=True,
                score=None,
                data=context.profile.model_dump(),
            )

        if context.candidate.resume_path:
            parsed, error = parse_resume_file(
                context.candidate.resume_path,
                fallback_name=context.candidate.name,
                fallback_email=context.candidate.email,
                requirements=context.requirements,
            )
            if parsed:
                context.profile = parsed.profile
                data = parsed.profile.model_dump()
                data["raw_excerpt"] = parsed.raw_excerpt
                data["phone"] = parsed.phone
                return AgentResult(
                    success=True,
                    should_continue=True,
                    score=None,
                    data=data,
                )
            if error:
                return AgentResult(
                    success=False,
                    should_continue=False,
                    score=None,
                    data={"error": error},
                )

        seed = seed_value(context)
        experience_years = max(context.candidate.experience_years, (seed % 6) + 1)
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
