import json

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.data.default_workflow import create_default_workflow
from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowResponse, WorkflowSaveRequest
from app.services.job_service import _get_owned_job
from app.services.workflow_validation import validate_workflow


def get_default_template() -> dict:
    return create_default_workflow()


def get_workflow(db: Session, recruiter_id: str, job_id: str) -> WorkflowResponse:
    job = _get_owned_job(db, recruiter_id, job_id)

    if job.workflow:
        graph = json.loads(job.workflow.definition)
        return WorkflowResponse(
            id=job.workflow.id,
            job_id=job_id,
            is_default=job.workflow.is_default,
            nodes=graph.get("nodes", []),
            edges=graph.get("edges", []),
        )

    default = create_default_workflow()
    return WorkflowResponse(
        id=None,
        job_id=job_id,
        is_default=True,
        nodes=default["nodes"],
        edges=default["edges"],
    )


def save_workflow(
    db: Session,
    recruiter_id: str,
    job_id: str,
    payload: WorkflowSaveRequest,
) -> WorkflowResponse:
    job = _get_owned_job(db, recruiter_id, job_id)

    errors = validate_workflow(payload.nodes, payload.edges)
    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "Invalid workflow", "errors": errors},
        )

    graph = {"nodes": payload.nodes, "edges": payload.edges}
    definition = json.dumps(graph)

    if job.workflow:
        job.workflow.definition = definition
        job.workflow.is_default = False
    else:
        workflow = Workflow(job_id=job_id, definition=definition, is_default=False)
        db.add(workflow)

    db.commit()
    db.refresh(job)

    saved = job.workflow
    if not saved:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save workflow")

    return WorkflowResponse(
        id=saved.id,
        job_id=job_id,
        is_default=saved.is_default,
        nodes=payload.nodes,
        edges=payload.edges,
    )
