from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.agents.utils import seed_value
from app.schemas.agent_outputs import ScreeningResultData


class ScreenAgent(BaseAgent):
    node_type = "screen"

    def run(self, context: AgentContext) -> AgentResult:
        seed = seed_value(context)
        threshold = int(context.config.get("screenThreshold", 60))
        score = 55 + (seed % 40)
        profile = context.profile
        key_qualifications = profile.skills[:4] if profile else []

        relevant = score >= threshold and seed % 5 != 0
        result = ScreeningResultData(
            relevant=relevant,
            relevance_score=score,
            reason=(
                f"Candidate profile aligns with {context.job.title} requirements."
                if relevant
                else "Candidate profile shows limited overlap with core job requirements."
            ),
            key_qualifications=key_qualifications,
            red_flags=[] if relevant else ["Limited role-specific experience"],
        )

        return AgentResult(
            success=True,
            should_continue=relevant,
            score=float(score),
            data=result.model_dump(),
        )
