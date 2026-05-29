from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.logger import logger

from app.core.config import settings
from app.core.database import Base, engine
from app.models import lead, status_history, user  
from app.routes.auth import router as auth_router
from app.routes.lead import router as lead_router
from app.services.auth_service import ensure_default_admin


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("Starting application...")
    Base.metadata.create_all(bind=engine)
    ensure_default_admin()
    logger.info("Database initialized successfully")
    yield
    logger.info("Application shutdown")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(lead_router)


@app.get("/")
def read_root():
    return {"message": "Lead Management System API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}
