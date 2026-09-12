import json
import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.agents.base import AgentContext
from app.agents.registry import AGENT_REGISTRY
from app.data.default_workflow import create_default_workflow
from app.models.candidate import Candidate, CandidateStatus, StageResult, StageResultStatus
from app.models.job import Job
from app.models.workflow import Workflow
from app.schemas.agent_outputs import CandidateProfileData
from app.services.jd_processor import requirements_from_model
from app.services.workflow_graph import node_config, node_type, topological_sort

NODE_STATUS_MAP = {
    "parse": CandidateStatus.parsing,
    "screen": CandidateStatus.screening,
    "match": CandidateStatus.skill_match,
    "skill_match": CandidateStatus.skill_match,
    "evaluate": CandidateStatus.evaluating,
    "rank": CandidateStatus.ranked,
    "interview": CandidateStatus.completed,
}


def _load_workflow_graph(db: Session, job: Job) -> dict:
    if job.workflow:
        return json.loads(job.workflow.definition)
    return create_default_workflow()


def _save_stage_result(
    db: Session,
    candidate: Candidate,
    *,
    node_id: str,
    stage_type: str,
    score: float | None,
    status: StageResultStatus,
    result_data: dict,
) -> None:
    db.add(
        StageResult(
            candidate_id=candidate.id,
            stage_type=stage_type,
            node_id=node_id,
            score=score,
            status=status,
            result_data=json.dumps(result_data),
            executed_at=datetime.now(UTC),
        )
    )


def execute_for_candidate(db: Session, job: Job, candidate: Candidate) -> Candidate:
    if candidate.status not in {CandidateStatus.pending, CandidateStatus.failed}:
        return candidate

    if not job.requirements:
        candidate.status = CandidateStatus.failed
        db.commit()
        db.refresh(candidate)
        return candidate

    requirements = requirements_from_model(job.requirements)
    graph = _load_workflow_graph(db, job)
    ordered_nodes = topological_sort(graph.get("nodes", []), graph.get("edges", []))

    context = AgentContext(
        job=job,
        candidate=candidate,
        requirements=requirements,
    )

    for workflow_node in ordered_nodes:
        stage_key = node_type(workflow_node)
        if stage_key not in AGENT_REGISTRY:
            continue

        node_id = workflow_node.get("id", f"{stage_key}-{uuid.uuid4().hex[:8]}")
        context.config = node_config(workflow_node)

        mapped_status = NODE_STATUS_MAP.get(stage_key)
        if mapped_status:
            candidate.status = mapped_status
            db.flush()

        agent = AGENT_REGISTRY[stage_key]()
        try:
            result = agent.run(context)
        except Exception as exc:
            _save_stage_result(
                db,
                candidate,
                node_id=str(node_id),
                stage_type=_stage_result_type(stage_key),
                score=None,
                status=StageResultStatus.failed,
                result_data={"error": str(exc)},
            )
            candidate.status = CandidateStatus.failed
            db.commit()
            db.refresh(candidate)
            return candidate

        stage_result_type = _stage_result_type(stage_key)
        context.results[stage_key] = result.data
        if stage_key == "match":
            context.results["match"] = result.data

        if stage_key == "parse" and result.data:
            context.profile = CandidateProfileData.model_validate(result.data)
            candidate.experience_years = context.profile.experience_years

        if stage_key == "screen" and result.score is not None:
            candidate.match_score = result.score

        if stage_key == "match" and result.score is not None:
            candidate.match_score = result.score

        if stage_key == "evaluate" and result.score is not None:
            candidate.eval_score = result.score

        if stage_key == "rank" and result.score is not None:
            candidate.overall_score = result.score

        _save_stage_result(
            db,
            candidate,
            node_id=str(node_id),
            stage_type=stage_result_type,
            score=result.score,
            status=StageResultStatus.completed if result.success else StageResultStatus.failed,
            result_data=result.data,
        )

        if not result.should_continue:
            candidate.status = CandidateStatus.filtered_out
            db.commit()
            db.refresh(candidate)
            return candidate

        if not result.success:
            candidate.status = CandidateStatus.failed
            db.commit()
            db.refresh(candidate)
            return candidate

    candidate.status = CandidateStatus.completed
    db.commit()
    db.refresh(candidate)
    return candidate


def _stage_result_type(stage_key: str) -> str:
    if stage_key in {"match", "skill_match"}:
        return "match"
    if stage_key == "evaluate":
        return "eval"
    return stage_key
