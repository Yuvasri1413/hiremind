from app.agents.base import BaseAgent
from app.agents.evaluate_agent import EvaluateAgent
from app.agents.interview_agent import InterviewAgent
from app.agents.match_agent import MatchAgent
from app.agents.parse_agent import ParseAgent
from app.agents.rank_agent import RankAgent
from app.agents.screen_agent import ScreenAgent

AGENT_REGISTRY: dict[str, type[BaseAgent]] = {
    "parse": ParseAgent,
    "screen": ScreenAgent,
    "match": MatchAgent,
    "skill_match": MatchAgent,
    "evaluate": EvaluateAgent,
    "rank": RankAgent,
    "interview": InterviewAgent,
}
