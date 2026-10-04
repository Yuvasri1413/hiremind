from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import auth, candidates, dashboard, jobs, workflows
from app.services.candidate_service import ensure_upload_dir
from app.services.job_service import seed_demo_data


def _ensure_sqlite_schema() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    with engine.begin() as connection:
        columns = connection.execute(text("PRAGMA table_info(candidates)")).fetchall()
        if columns and not any(column[1] == "parse_error" for column in columns):
            connection.execute(text("ALTER TABLE candidates ADD COLUMN parse_error VARCHAR(500)"))


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    _ensure_sqlite_schema()
    ensure_upload_dir()
    db = SessionLocal()
    try:
        seed_demo_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(jobs.router)
app.include_router(candidates.router)
app.include_router(workflows.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.app_name}
