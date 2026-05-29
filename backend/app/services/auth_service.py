from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.logger import logger

from app.core.config import settings
from app.core.database import SessionLocal, get_db
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.crud.user import create_user, get_user_by_id, get_user_by_username
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

bearer_scheme = HTTPBearer(auto_error=False)


def ensure_default_admin() -> None:
    db = SessionLocal()
    try:
        existing_user = get_user_by_username(db, settings.default_admin_username)
        if existing_user:
            return

        create_user(
            db,
            username=settings.default_admin_username,
            password_hash=hash_password(settings.default_admin_password),
        )
    finally:
        db.close()


def authenticate_user(db: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = authenticate_user(db, payload.username, payload.password)
    if not user:
        logger.error(f"User not found: {payload.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            
        )
    access_token = create_access_token({"sub": str(user.id), "username": user.username})
    logger.info(f"User logged in successfully: {payload.username}")
    return TokenResponse(access_token=access_token, token_type="bearer", user=user)


def register_user(db: Session, payload: RegisterRequest) -> User:
    existing_user = get_user_by_username(db, payload.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already registered.",
        )

    try:
        return create_user(
            db,
            username=payload.username,
            password_hash=hash_password(payload.password),
        )
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already registered.",
        ) from exc


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        ) from exc

    user = get_user_by_id(db, user_id_int)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user
