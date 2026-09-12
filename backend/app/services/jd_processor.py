import json
import re

from app.models.job import Job
from app.schemas.job import JobRequirementsData

SKILL_KEYWORDS: dict[str, list[str]] = {
    "python": ["Python"],
    "fastapi": ["FastAPI"],
    "django": ["Django"],
    "postgresql": ["PostgreSQL"],
    "postgres": ["PostgreSQL"],
    "sql": ["SQL"],
    "react": ["React"],
    "typescript": ["TypeScript"],
    "javascript": ["JavaScript"],
    "material ui": ["Material UI"],
    "mui": ["Material UI"],
    "docker": ["Docker"],
    "aws": ["AWS"],
    "redis": ["Redis"],
    "java": ["Java"],
    "node": ["Node.js"],
    "excel": ["Excel"],
    "agile": ["Agile"],
    "rest": ["REST APIs"],
    "api": ["REST APIs"],
}

PREFERRED_KEYWORDS = {"docker", "aws", "redis", "vite", "testing", "agile", "documentation"}


def _unique(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        key = item.lower()
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result


def extract_requirements(job: Job) -> JobRequirementsData:
    text = f"{job.title} {job.description}".lower()
    required: list[str] = []
    preferred: list[str] = []

    for keyword, skills in SKILL_KEYWORDS.items():
        if keyword in text:
            target = preferred if keyword in PREFERRED_KEYWORDS else required
            target.extend(skills)

    if not required:
        required = ["Communication", "Problem solving", "Team collaboration"]

    if not preferred:
        preferred = ["Agile", "Documentation"]

    if job.min_experience == job.max_experience:
        exp_label = (
            "Experience not specified"
            if job.min_experience == 0 and job.max_experience == 0
            else f"{job.min_experience}+ years"
        )
    else:
        exp_label = f"{job.min_experience}–{job.max_experience} years"

    education = "B.Tech / MCA"
    if re.search(r"\b(bca|b\.?tech|mca|b\.?sc)\b", text):
        education = "Relevant technical degree"

    responsibilities = _extract_responsibilities(job.description)

    return JobRequirementsData(
        required_skills=_unique(required)[:8],
        preferred_skills=_unique(preferred)[:6],
        min_experience=exp_label,
        education=education,
        responsibilities=responsibilities,
    )


def _extract_responsibilities(description: str) -> list[str]:
    lines = [line.strip(" •-\t") for line in description.splitlines() if line.strip()]
    sentences = re.split(r"(?<=[.!?])\s+", description.strip())

    candidates = [line for line in lines if len(line) > 20]
    if not candidates:
        candidates = [s.strip() for s in sentences if len(s.strip()) > 20]

    if candidates:
        return candidates[:5]

    return [
        "Contribute to day-to-day delivery of the role",
        "Collaborate with cross-functional teams",
        "Follow best practices for quality and documentation",
    ]


def requirements_to_json_fields(data: JobRequirementsData) -> dict[str, str]:
    return {
        "required_skills": json.dumps(data.required_skills),
        "preferred_skills": json.dumps(data.preferred_skills),
        "min_experience_label": data.min_experience,
        "education": data.education,
        "responsibilities": json.dumps(data.responsibilities),
    }


def requirements_from_model(requirements) -> JobRequirementsData:
    return JobRequirementsData(
        required_skills=json.loads(requirements.required_skills),
        preferred_skills=json.loads(requirements.preferred_skills),
        min_experience=requirements.min_experience_label,
        education=requirements.education,
        responsibilities=json.loads(requirements.responsibilities),
    )
