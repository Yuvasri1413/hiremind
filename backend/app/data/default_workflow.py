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


def create_pipeline(stages: list[tuple[str, str]]) -> dict:
    """Build a linear workflow from (node_type, label) stages."""
    nodes: list[dict] = []
    edges: list[dict] = []
    node_ids: list[str] = []

    for index, (node_type, label) in enumerate(stages):
        node_id = f"{node_type}-{index + 1}"
        node_ids.append(node_id)
        nodes.append(_node(node_id, node_type, label, index * 220, 120))
        if index > 0:
            edges.append(
                {
                    "id": f"e-{node_ids[index - 1]}-{node_id}",
                    "source": node_ids[index - 1],
                    "target": node_id,
                    "animated": True,
                }
            )

    return {"nodes": nodes, "edges": edges}


def create_default_workflow() -> dict:
    return create_pipeline(
        [
            ("parse", "Parse"),
            ("screen", "Screen"),
            ("match", "Skill Match"),
            ("evaluate", "Evaluate"),
            ("rank", "Rank"),
            ("interview", "Interview"),
        ]
    )


def create_frontend_workflow() -> dict:
    """Shorter pipeline — ranking without interview generation."""
    return create_pipeline(
        [
            ("parse", "Parse"),
            ("screen", "Screen"),
            ("match", "Skill Match"),
            ("evaluate", "Evaluate"),
            ("rank", "Rank"),
        ]
    )


def create_data_analyst_workflow() -> dict:
    """Analytics-focused — fast match and rank."""
    graph = create_pipeline(
        [
            ("parse", "Parse"),
            ("screen", "Screen"),
            ("match", "Skill Match"),
            ("rank", "Rank"),
        ]
    )
    for node in graph["nodes"]:
        if node["data"]["nodeType"] == "screen":
            node["data"]["config"] = {"screenThreshold": 55}
    return graph


def create_ui_designer_workflow() -> dict:
    """Portfolio-heavy — evaluate and interview, skip separate rank stage."""
    return create_pipeline(
        [
            ("parse", "Parse"),
            ("screen", "Screen"),
            ("evaluate", "Evaluate"),
            ("interview", "Interview"),
        ]
    )


def create_devops_workflow() -> dict:
    """Full pipeline with stricter screening."""
    graph = create_default_workflow()
    for node in graph["nodes"]:
        if node["data"]["nodeType"] == "screen":
            node["data"]["config"] = {"screenThreshold": 70}
    return graph


WORKFLOW_BY_JOB_TITLE: dict[str, str] = {
    "Backend Developer": "full",
    "Frontend Developer": "frontend",
    "Data Analyst": "data_analyst",
    "DevOps Engineer": "devops",
    "UI Designer": "ui_designer",
}


def workflow_for_job_title(title: str) -> dict:
    key = WORKFLOW_BY_JOB_TITLE.get(title, "full")
    if key == "frontend":
        return create_frontend_workflow()
    if key == "data_analyst":
        return create_data_analyst_workflow()
    if key == "ui_designer":
        return create_ui_designer_workflow()
    if key == "devops":
        return create_devops_workflow()
    return create_default_workflow()
