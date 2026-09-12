import re

from sqlalchemy.orm import Session

from app.models.candidate import Candidate, CandidateStatus

PIPELINE_STAGES = [
    ("parse", "Parse"),
    ("screen", "Screen"),
    ("match", "Match"),
    ("eval", "Eval"),
    ("rank", "Rank"),
    ("interview", "Interview"),
]

STATUS_TO_STAGE = {
    CandidateStatus.pending: "parse",
    CandidateStatus.parsing: "parse",
    CandidateStatus.screening: "screen",
    CandidateStatus.skill_match: "match",
    CandidateStatus.evaluating: "eval",
    CandidateStatus.ranked: "rank",
    CandidateStatus.completed: "interview",
    CandidateStatus.filtered_out: "screen",
    CandidateStatus.failed: None,
}



def build_pipeline_stages(candidate: Candidate) -> list[dict]:
    current_stage = STATUS_TO_STAGE.get(candidate.status)
    stages: list[dict] = []

    for key, label in PIPELINE_STAGES:
        if candidate.status == CandidateStatus.failed:
            status = "failed" if key == current_stage else "skipped"
        elif candidate.status == CandidateStatus.filtered_out:
            if key == "parse":
                status = "completed"
            elif key == "screen":
                status = "completed"
            else:
                status = "skipped"
        elif candidate.status == CandidateStatus.completed:
            status = "completed"
        elif current_stage is None:
            status = "pending"
        elif key == current_stage and candidate.status not in {
            CandidateStatus.completed,
            CandidateStatus.filtered_out,
        }:
            status = "running"
        else:
            stage_index = next(i for i, (k, _) in enumerate(PIPELINE_STAGES) if k == key)
            current_index = next(
                i for i, (k, _) in enumerate(PIPELINE_STAGES) if k == current_stage
            )
            status = "completed" if stage_index < current_index else "pending"

        stages.append({"key": key, "label": label, "status": status})

    return stages


def recompute_job_ranks(db: Session, job_id: str) -> None:
    candidates = (
        db.query(Candidate)
        .filter(Candidate.job_id == job_id)
        .order_by(Candidate.overall_score.desc().nullslast(), Candidate.created_at.asc())
        .all()
    )

    rank = 1
    for candidate in candidates:
        if candidate.status in {CandidateStatus.completed, CandidateStatus.filtered_out}:
            candidate.rank = rank
            rank += 1
        else:
            candidate.rank = None

    db.commit()


def name_from_filename(filename: str) -> str:
    stem = re.sub(r"\.(pdf|docx?|PDF|DOCX?)$", "", filename.strip())
    stem = re.sub(r"[_-]+", " ", stem)
    stem = re.sub(r"\b(resume|cv)\b", "", stem, flags=re.IGNORECASE).strip()
    parts = [part.capitalize() for part in stem.split() if part]
    return " ".join(parts) if parts else "Unknown Candidate"


def email_from_name(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", ".", name.lower()).strip(".")
    return f"{slug or 'candidate'}@example.com"
