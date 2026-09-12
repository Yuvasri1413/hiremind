from fastapi import APIRouter

from app.schemas.workflow import WorkflowGraph
from app.services.workflow_service import get_default_template

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/templates/default", response_model=WorkflowGraph)
def get_default_workflow_template() -> WorkflowGraph:
    graph = get_default_template()
    return WorkflowGraph(nodes=graph["nodes"], edges=graph["edges"])
