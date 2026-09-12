DEFAULT_CONFIGS: dict[str, dict[str, int]] = {
    "screen": {"screenThreshold": 60},
    "match": {"requiredWeight": 70, "preferredWeight": 30},
    "evaluate": {
        "skillsWeight": 40,
        "experienceWeight": 25,
        "educationWeight": 20,
        "projectsWeight": 15,
    },
    "rank": {"screeningWeight": 20, "matchWeight": 40, "evaluationWeight": 40},
    "interview": {"technicalQuestions": 3, "behavioralQuestions": 2, "gapQuestions": 2},
}


def _node(
    node_id: str,
    node_type: str,
    label: str,
    x: int,
    y: int,
) -> dict:
    return {
        "id": node_id,
        "type": "workflow",
        "position": {"x": x, "y": y},
        "data": {
            "label": label,
            "nodeType": node_type,
            "config": DEFAULT_CONFIGS.get(node_type, {}),
        },
    }


def create_default_workflow() -> dict:
    nodes = [
        _node("parse-1", "parse", "Parse", 0, 120),
        _node("screen-1", "screen", "Screen", 220, 120),
        _node("match-1", "match", "Skill Match", 440, 120),
        _node("evaluate-1", "evaluate", "Evaluate", 660, 120),
        _node("rank-1", "rank", "Rank", 880, 120),
        _node("interview-1", "interview", "Interview", 1100, 120),
    ]
    edges = [
        {"id": "e-parse-screen", "source": "parse-1", "target": "screen-1", "animated": True},
        {"id": "e-screen-match", "source": "screen-1", "target": "match-1", "animated": True},
        {"id": "e-match-evaluate", "source": "match-1", "target": "evaluate-1", "animated": True},
        {"id": "e-evaluate-rank", "source": "evaluate-1", "target": "rank-1", "animated": True},
        {"id": "e-rank-interview", "source": "rank-1", "target": "interview-1", "animated": True},
    ]
    return {"nodes": nodes, "edges": edges}
