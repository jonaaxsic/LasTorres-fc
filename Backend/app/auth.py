"""
Módulo de autenticación JWT.
"""

import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import get_settings
from app.db import get_db
from app.models import UserResponse

settings = get_settings()

# Security scheme (para backward compatibility con header)
security = HTTPBearer(auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash."""
    # Soportar tanto bcrypt como texto plano (para compatibilidad)
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except Exception:
        # Fallback a texto plano (no recomendado para producción)
        return plain_password == hashed_password


def get_password_hash(password: str) -> str:
    """Genera el hash de una contraseña."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token JWT de acceso (15 minutos por defecto)."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(
        to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Crea un token JWT de refresh (7 días por defecto)."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.refresh_token_expire_days
    )

    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Decodifica y verifica un token JWT."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(request: Request) -> UserResponse:
    """
    Obtiene el usuario actual desde el token en cookie.
    Lee el token desde la cookie 'access_token' o desde header Authorization.
    """
    token: Optional[str] = None

    # 1. Intentar leer desde cookie
    token = request.cookies.get("access_token")

    # 2. Si no hay cookie, intentar desde header Authorization (backward compatibility)
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]  # Quitar "Bearer "

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Decodificar y validar token
    payload = decode_token(token)

    # Validar que sea un token de acceso (no refresh)
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Tipo de token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido"
        )

    # Buscar usuario en Supabase
    supabase = get_db()
    response = supabase.table("usuarios").select("*").eq("id", user_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado"
        )

    user_data = response.data[0]
    return UserResponse(
        id=user_data["id"],
        nombre=user_data["nombre"],
        correo=user_data.get("email", ""),
        rol=user_data["rol"],
    )


async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """Obtiene el usuario activo actual."""
    return current_user


def require_role(allowed_roles: list[str]):
    """
    Dependencia que requiere un rol específico.

    Uso:
        @router.get("/", dependencies=[Depends(require_role(["admin"]))])
    """

    async def role_checker(
        user: UserResponse = Depends(get_current_user),
    ) -> UserResponse:
        if user.rol not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Rol '{user.rol}' no tiene acceso a este recurso",
            )
        return user

    return role_checker
