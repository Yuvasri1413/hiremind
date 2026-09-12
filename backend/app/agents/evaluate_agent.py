from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import seed_value
from app.schemas.agent_outputs import EvaluationResultData


class EvaluateAgent(BaseAgent):
    node_type = "evaluate"

    def run(self, context: AgentContext) -> AgentResult:
        seed = seed_value(context)
        match_score = int(context.results.get("match", {}).get("match_score", 70))
        score = 58 + (seed % 38)
        score = round((score + match_score) / 2)

        skills_weight = int(context.config.get("skillsWeight", 40))
        experience_weight = int(context.config.get("experienceWeight", 25))
        education_weight = int(context.config.get("educationWeight", 20))
        projects_weight = int(context.config.get("projectsWeight", 15))

        recommendation = "Shortlist" if score >= 75 else "Hold" if score >= 60 else "Reject"
        missing = context.results.get("match", {}).get("missing_skills", [])

        result = EvaluationResultData(
            overall_score=score,
            strengths=[
                f"Solid overlap with required skills for {context.job.title}",
                "Experience level fits the role band",
            ],
            weaknesses=[
                f"Gap in {missing[0]}" if missing else "Limited evidence of large-scale delivery",
                "Preferred skills not fully demonstrated",
            ],
            fit_summary=f"Assessment for {context.candidate.name} against {context.job.title}.",
            recommendation=recommendation,
            rubric_breakdown={
                "skills": min(100, score + 5),
                "experience": min(100, score),
                "education": min(100, score - 3),
                "projects": min(100, score - 5),
            },
        )

        _ = (skills_weight, experience_weight, education_weight, projects_weight)

        return AgentResult(
            success=True,
            should_continue=True,
            score=float(score),
            data=result.model_dump(),
        )
