from typing import Any

from app.models.candidate import Candidate, CandidateStatus
from app.schemas.candidate_report import CandidateReportResponse
from app.services.mock_pipeline import PIPELINE_STAGES, STATUS_TO_STAGE


def build_candidate_report(candidate: Candidate) -> CandidateReportResponse:
    stage_map = {result.stage_type: result for result in candidate.stage_results}
    pipeline = _build_pipeline(candidate)

    parsed_profile = _parsed_profile(stage_map.get("parse"))
    screening = _screening(stage_map.get("screen"))
    skill_match = _skill_match(stage_map.get("match"))
    evaluation = _evaluation(stage_map.get("eval"))
    interview_questions = _interview_questions(stage_map.get("interview"))

    return CandidateReportResponse(
        pipeline=pipeline,
        parsed_profile=parsed_profile,
        screening=screening,
        skill_match=skill_match,
        evaluation=evaluation,
        interview_questions=interview_questions,
    )


def _build_pipeline(candidate: Candidate) -> list[dict[str, str]]:
    current_stage = STATUS_TO_STAGE.get(candidate.status)
    stages: list[dict[str, str]] = []

    for key, label in PIPELINE_STAGES:
        if candidate.status == CandidateStatus.failed:
            status = "failed" if key == current_stage else "skipped"
        elif candidate.status == CandidateStatus.filtered_out:
            if key in {"parse", "screen"}:
                status = "completed"
            else:
                status = "skipped"
        elif candidate.status == CandidateStatus.completed:
            status = "completed"
        elif current_stage is None:
            status = "pending"
        elif key == current_stage:
            status = "running"
        else:
            stage_index = next(i for i, (k, _) in enumerate(PIPELINE_STAGES) if k == key)
            current_index = next(
                i for i, (k, _) in enumerate(PIPELINE_STAGES) if k == current_stage
            )
            status = "completed" if stage_index < current_index else "pending"

        stages.append({"key": key, "label": label, "status": status})

    return stages


def _load_result_data(result) -> dict[str, Any]:
    if not result:
        return {}
    import json

    try:
        data = json.loads(result.result_data)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def _parsed_profile(parse_result) -> dict[str, Any] | None:
    data = _load_result_data(parse_result)
    if not data:
        return None
    return {
        "skills": data.get("skills", []),
        "education": data.get("education", ""),
        "experience": data.get("experience", ""),
    }


def _screening(screen_result) -> dict[str, Any] | None:
    data = _load_result_data(screen_result)
    if not data:
        return None
    return {
        "score": data.get("relevance_score", screen_result.score if screen_result else 0),
        "relevant": data.get("relevant", False),
        "summary": data.get("reason", ""),
    }


def _skill_match(match_result) -> dict[str, Any] | None:
    data = _load_result_data(match_result)
    if not data:
        return None
    return {
        "score": data.get("match_score", match_result.score if match_result else 0),
        "matched": data.get("matched_skills", []),
        "missing": data.get("missing_skills", []),
    }


def _evaluation(eval_result) -> dict[str, Any] | None:
    data = _load_result_data(eval_result)
    if not data:
        return None
    return {
        "score": data.get("overall_score", eval_result.score if eval_result else 0),
        "recommendation": data.get("recommendation", "Hold"),
        "strengths": data.get("strengths", []),
        "weaknesses": data.get("weaknesses", []),
    }


def _interview_questions(interview_result) -> dict[str, Any] | None:
    data = _load_result_data(interview_result)
    if not data:
        return None
    return {
        "technical": data.get("technical", []),
        "behavioral": data.get("behavioral", []),
        "gap_probing": data.get("gap_probing", []),
    }
