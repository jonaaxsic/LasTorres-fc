"""
Router de autenticación con cookies HttpOnly y refresh token.
"""

from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from fastapi.responses import JSONResponse
from supabase import create_client
from app.config import get_settings
from app.auth import (
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,
    decode_token,
)
from app.models import UserLogin, UserResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def _get_session_config() -> dict:
    """Obtiene configuración de cookies según el entorno.
    - Producción (Render): Secure=True + SameSite=None (cross-origin Vercel→Render)
    - Desarrollo (localhost): Secure=False + SameSite=Lax
    """
    settings = get_settings()
    is_production = not settings.debug
    return {
        "httponly": True,
        "samesite": "none" if is_production else "lax",
        "secure": is_production,
        # Sin 'domain' — el browser usa el dominio actual automáticamente
    }


@router.post("/login")
async def login(credentials: UserLogin, response: Response, request: Request):
    """
    Endpoint de inicio de sesión.
    - Genera access_token (15 min) y refresh_token (7 días)
    - Los guarda como cookies HttpOnly
    - Retorna solo los datos del usuario
    """
    try:
        # Obtener configuración
        settings = get_settings()

        # Crear cliente Supabase
        supabase = create_client(settings.supabase_url, settings.supabase_key)

        # Buscar usuario por email
        response_supabase = (
            supabase.table("usuarios")
            .select("*")
            .eq("email", credentials.email)
            .execute()
        )

        if not response_supabase.data or len(response_supabase.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
            )

        user_data = response_supabase.data[0]

        # Verificar contraseña
        if not verify_password(credentials.password, user_data["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Contraseña incorrecta",
            )

        # Crear tokens
        access_token = create_access_token(
            data={"sub": str(user_data["id"])},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )
        refresh_token = create_refresh_token(data={"sub": str(user_data["id"])})

        # Configuración de cookies
        session_config = _get_session_config()

        # Calcular tiempo de expiración en segundos
        access_expire_seconds = settings.access_token_expire_minutes * 60
        refresh_expire_seconds = settings.refresh_token_expire_days * 24 * 60 * 60

        # Establecer cookie de access_token
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=access_expire_seconds,
            path="/",
            **session_config,
        )

        # Establecer cookie de refresh_token (path=/api/auth/refresh)
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=refresh_expire_seconds,
            path="/api/auth/refresh",
            **session_config,
        )

        return {
            "usuario": UserResponse(
                id=user_data["id"],
                nombre=user_data["nombre"],
                correo=user_data["email"],
                rol=user_data["rol"],
            )
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback

        with open("login_error.log", "w") as f:
            f.write(f"{type(e).__name__}: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """
    Endpoint de renovación de access_token.
    - Lee el refresh_token desde la cookie
    - Valida que sea un token de tipo "refresh"
    - Genera un nuevo access_token
    """
    # Leer refresh_token desde cookie
    refresh_token_value = request.cookies.get("refresh_token")

    if not refresh_token_value:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No hay sesión activa"
        )

    # Validar refresh_token
    try:
        payload = decode_token(refresh_token_value)

        # Verificar que sea un token de refresh
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido"
            )

        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido"
            )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado o inválido"
        )

    # Generar nuevo access_token
    settings = get_settings()
    new_access_token = create_access_token(
        data={"sub": user_id},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    # Configuración de cookies
    session_config = _get_session_config()
    access_expire_seconds = settings.access_token_expire_minutes * 60

    # Actualizar cookie de access_token
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        max_age=access_expire_seconds,
        path="/",
        **session_config,
    )

    return {"ok": True, "message": "Token renovado"}


@router.post("/logout")
async def logout(response: Response):
    """
    Endpoint de cierre de sesión.
    - Borra las cookies de access_token y refresh_token
    """
    session_config = _get_session_config()

    # Eliminar cookies
    response.delete_cookie(key="access_token", path="/", **session_config)
    response.delete_cookie(
        key="refresh_token", path="/api/auth/refresh", **session_config
    )

    return {"ok": True}


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Obtiene el perfil del usuario actual.
    """
    return current_user


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Alias para /profile - compatibilidad con frontend.
    """
    return current_user
