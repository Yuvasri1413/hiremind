from app.agents.base import AgentContext, AgentResult, BaseAgent
from app.schemas.agent_outputs import InterviewQuestionsData


class InterviewAgent(BaseAgent):
    node_type = "interview"

    def run(self, context: AgentContext) -> AgentResult:
        technical_count = int(context.config.get("technicalQuestions", 3))
        behavioral_count = int(context.config.get("behavioralQuestions", 2))
        gap_count = int(context.config.get("gapQuestions", 2))

        required = context.requirements.required_skills[:3]
        missing = context.results.get("match", {}).get("missing_skills", [])

        technical = [
            f"Explain your experience with {skill} in production systems."
            for skill in required[:technical_count]
        ]
        while len(technical) < technical_count:
            technical.append("Walk through a recent project where you owned backend delivery end-to-end.")

        behavioral = [
            "Describe a time you resolved a disagreement with a stakeholder about hiring criteria.",
            "Tell us about delivering under a tight deadline while maintaining quality.",
        ][:behavioral_count]

        gap_probing = [
            f"How have you been building experience in {skill.replace(' (preferred)', '')}?"
            for skill in missing[:gap_count]
        ]
        while len(gap_probing) < gap_count:
            gap_probing.append("What steps would you take in the first 30 days to ramp up on this role?")

        result = InterviewQuestionsData(
            technical=technical,
            behavioral=behavioral,
            gap_probing=gap_probing,
        )

        return AgentResult(
            success=True,
            should_continue=True,
            score=None,
            data=result.model_dump(),
        )
