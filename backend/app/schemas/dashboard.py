from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_jobs: int
    total_candidates: int
    avg_score: int
