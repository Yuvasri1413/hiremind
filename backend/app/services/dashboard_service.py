from sqlalchemy.orm import Session

from app.models.candidate import Candidate
from app.models.job import Job
from app.schemas.dashboard import DashboardStatsResponse
from app.services.candidate_service import compute_job_candidate_stats


def get_dashboard_stats(db: Session, recruiter_id: str) -> DashboardStatsResponse:
    jobs = db.query(Job).filter(Job.recruiter_id == recruiter_id).all()
    total_jobs = len(jobs)

    total_candidates = (
        db.query(Candidate)
        .join(Job)
        .filter(Job.recruiter_id == recruiter_id)
        .count()
    )

    job_avg_scores: list[float] = []
    for job in jobs:
        _, avg_score = compute_job_candidate_stats(db, job.id)
        if avg_score is not None:
            job_avg_scores.append(avg_score)

    avg_score = round(sum(job_avg_scores) / len(job_avg_scores)) if job_avg_scores else 0

    return DashboardStatsResponse(
        total_jobs=total_jobs,
        total_candidates=total_candidates,
        avg_score=avg_score,
    )
