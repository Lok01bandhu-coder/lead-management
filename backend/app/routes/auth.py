from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.logger import logger
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserRead
from app.services.auth_service import get_current_user, login_user, register_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    logger.info(f"Login request received for username: {payload.username}")
    return login_user(db, payload)


@router.post("/register", response_model=UserRead, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    logger.info(f"User registration request: {payload.username}")
    return register_user(db, payload)


@router.get("/me", response_model=UserRead)
def get_logged_in_user(current_user: User = Depends(get_current_user)):
    return current_user
