import re
from dataclasses import dataclass
from pathlib import Path

from app.schemas.agent_outputs import CandidateProfileData
from app.schemas.job import JobRequirementsData

EMAIL_PATTERN = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_PATTERN = re.compile(r"(\+?\d[\d\s\-().]{7,}\d)")
EXPERIENCE_PATTERN = re.compile(
    r"(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)?",
    re.IGNORECASE,
)
SKILLS_HEADER_PATTERN = re.compile(r"^\s*(technical\s+)?skills?\s*:?\s*(.*)$", re.IGNORECASE)


@dataclass
class ParsedResume:
    profile: CandidateProfileData
    name: str
    email: str
    phone: str = ""
    raw_excerpt: str = ""


def extract_text(resume_path: str) -> tuple[str, str | None]:
    path = Path(resume_path)
    if not path.exists():
        return "", "Resume file not found on server"

    suffix = path.suffix.lower()
    try:
        if suffix == ".pdf":
            return _extract_pdf_text(path)
        if suffix == ".docx":
            return _extract_docx_text(path)
        if suffix == ".doc":
            return "", "Legacy .doc format is not supported; please upload PDF or DOCX"
        return "", f"Unsupported file extension: {suffix}"
    except Exception as exc:
        return "", f"Failed to read resume: {exc}"


def _extract_pdf_text(path: Path) -> tuple[str, str | None]:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    text = "\n".join(pages).strip()
    if not text:
        return "", "Could not extract text from PDF (image-only or empty)"
    return text, None


def _extract_docx_text(path: Path) -> tuple[str, str | None]:
    from docx import Document

    document = Document(str(path))
    paragraphs = [paragraph.text for paragraph in document.paragraphs if paragraph.text.strip()]
    text = "\n".join(paragraphs).strip()
    if not text:
        return "", "Could not extract text from DOCX"
    return text, None


def _normalize_skill(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).lower()


def _skills_from_requirements(text: str, requirements: JobRequirementsData | None) -> list[str]:
    lowered = text.lower()
    found: list[str] = []
    catalog: list[str] = []
    if requirements:
        catalog.extend(requirements.required_skills)
        catalog.extend(requirements.preferred_skills)

    for skill in catalog:
        token = skill.strip()
        if token and token.lower() in lowered:
            found.append(token)

    for line in text.splitlines():
        match = SKILLS_HEADER_PATTERN.match(line.strip())
        if not match:
            continue
        tail = match.group(2)
        if not tail:
            continue
        for part in re.split(r"[,;|/]", tail):
            cleaned = part.strip(" •-\t")
            if 2 <= len(cleaned) <= 40:
                found.append(cleaned)

    deduped: list[str] = []
    seen: set[str] = set()
    for skill in found:
        key = _normalize_skill(skill)
        if key in seen:
            continue
        seen.add(key)
        deduped.append(skill)
    return deduped[:25]


def _experience_years(text: str, requirements: JobRequirementsData | None) -> int:
    matches = [int(value) for value in EXPERIENCE_PATTERN.findall(text)]
    if matches:
        return max(matches)
    if requirements and requirements.min_experience:
        return requirements.min_experience
    return 0


def _education_line(text: str) -> str:
    for line in text.splitlines():
        lowered = line.lower()
        if any(keyword in lowered for keyword in ("bachelor", "master", "b.tech", "m.tech", "b.e", "mca", "degree")):
            return line.strip()[:200]
    return "Not specified in resume"


def _name_from_text(text: str, fallback: str) -> str:
    for line in text.splitlines():
        candidate = line.strip()
        if not candidate or len(candidate) > 80:
            continue
        if EMAIL_PATTERN.search(candidate) or PHONE_PATTERN.search(candidate):
            continue
        if candidate.lower().startswith(("curriculum vitae", "resume", "profile")):
            continue
        if len(candidate.split()) <= 6 and re.search(r"[A-Za-z]", candidate):
            return candidate.title()
    return fallback


def _email_from_text(text: str, fallback: str) -> str:
    match = EMAIL_PATTERN.search(text)
    return match.group(0).lower() if match else fallback


def parse_resume_file(
    resume_path: str,
    *,
    fallback_name: str,
    fallback_email: str,
    requirements: JobRequirementsData | None = None,
) -> tuple[ParsedResume | None, str | None]:
    text, error = extract_text(resume_path)
    if error:
        return None, error
    if not text:
        return None, "Resume text is empty"

    skills = _skills_from_requirements(text, requirements)
    if not skills and requirements:
        skills = requirements.required_skills[:3]

    years = _experience_years(text, requirements)
    profile = CandidateProfileData(
        skills=skills or ["Communication", "Teamwork"],
        education=_education_line(text),
        experience=f"{years} years" if years else "Not specified",
        experience_years=years,
    )
    phone_match = PHONE_PATTERN.search(text)
    parsed = ParsedResume(
        profile=profile,
        name=_name_from_text(text, fallback_name),
        email=_email_from_text(text, fallback_email),
        phone=phone_match.group(0) if phone_match else "",
        raw_excerpt=text[:1200],
    )
    return parsed, None
