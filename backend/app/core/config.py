import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


def _get_cors_allow_origins() -> list[str]:
    raw_origins = os.getenv(
        "CORS_ALLOW_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "Lead Management System")
    app_version: str = os.getenv("APP_VERSION", "0.1.0")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:root@host.docker.internal:5432/lead_management",   #this is for docker postgres
        # "postgresql+psycopg2://postgres:postgres@localhost:5432/lead_management",         #this is for local Data base
    )
    secret_key: str = os.getenv("SECRET_KEY", "LeadManagementSystemJwtSecretKeySecure")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    default_admin_username: str = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    default_admin_password: str = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
    cors_allow_origins: list[str] = field(default_factory=_get_cors_allow_origins)


settings = Settings()
