from typing import Any

from pydantic import BaseModel, Field


class WorkflowGraph(BaseModel):
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class WorkflowResponse(BaseModel):
    id: str | None = None
    job_id: str
    is_default: bool
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


class WorkflowSaveRequest(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]
