from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import secrets

import jwt
from fastapi import HTTPException, status

try:
    from pwdlib import PasswordHash
except ImportError:
    PasswordHash = None

from app.core.config import settings

PBKDF2_PREFIX = "pbkdf2_sha256"
PBKDF2_ITERATIONS = 600_000

password_hasher = None
if PasswordHash is not None:
    try:
        password_hasher = PasswordHash.recommended()
    except Exception:
        password_hasher = None


def _hash_password_with_pbkdf2(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        PBKDF2_ITERATIONS,
    )
    return f"{PBKDF2_PREFIX}${PBKDF2_ITERATIONS}${salt}${digest.hex()}"


def _verify_pbkdf2_password(plain_password: str, hashed_password: str) -> bool:
    try:
        _, iterations, salt, expected_hash = hashed_password.split("$", 3)
    except ValueError:
        return False

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        plain_password.encode("utf-8"),
        bytes.fromhex(salt),
        int(iterations),
    )
    return hmac.compare_digest(digest.hex(), expected_hash)


def hash_password(password: str) -> str:
    if password_hasher is None:
        return _hash_password_with_pbkdf2(password)
    return password_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if hashed_password.startswith(f"{PBKDF2_PREFIX}$"):
        return _verify_pbkdf2_password(plain_password, hashed_password)
    if password_hasher is None:
        return False
    return password_hasher.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = data.copy()
    payload.update({"exp": expires_at})
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc
