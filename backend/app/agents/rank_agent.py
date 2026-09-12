from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.schemas.agent_outputs import RankingResultData


class RankAgent(BaseAgent):
    node_type = "rank"

    def run(self, context: AgentContext) -> AgentResult:
        screening_weight = float(context.config.get("screeningWeight", 20)) / 100
        match_weight = float(context.config.get("matchWeight", 40)) / 100
        evaluation_weight = float(context.config.get("evaluationWeight", 40)) / 100

        screen_score = float(context.results.get("screen", {}).get("relevance_score", 0))
        match_score = float(context.results.get("match", {}).get("match_score", 0))
        eval_score = float(context.results.get("evaluate", {}).get("overall_score", 0))

        composite = round(
            screen_score * screening_weight
            + match_score * match_weight
            + eval_score * evaluation_weight,
            1,
        )

        result = RankingResultData(
            composite_score=composite,
            screening_weight=screening_weight,
            match_weight=match_weight,
            evaluation_weight=evaluation_weight,
        )

        return AgentResult(
            success=True,
            should_continue=True,
            score=composite,
            data=result.model_dump(),
        )
