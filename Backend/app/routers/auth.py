"""
Router de autenticación.
"""

from datetime import timedelta
from fastapi import APIRouter, HTTPException, status, Depends
from supabase import create_client
from app.config import get_settings
from app.auth import verify_password, create_access_token, get_current_user
from app.models import UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    """
    Endpoint de inicio de sesión.
    """
    try:
        # Obtener configuración
        settings = get_settings()

        # Crear cliente Supabase
        supabase = create_client(settings.supabase_url, settings.supabase_key)

        # Buscar usuario por email (ahora es credentials.email)
        response = (
            supabase.table("usuarios")
            .select("*")
            .eq("email", credentials.email)
            .execute()
        )

        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado",
            )

        user_data = response.data[0]

        # Verificar contraseña
        if not verify_password(credentials.password, user_data["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Contraseña incorrecta",
            )

        # Crear token JWT
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": str(user_data["id"])}, expires_delta=access_token_expires
        )

        return TokenResponse(
            accessToken=access_token,
            expiresIn=settings.access_token_expire_minutes * 60,
            usuario=UserResponse(
                id=user_data["id"],
                nombre=user_data["nombre"],
                correo=user_data["email"],
                rol=user_data["rol"],
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        import traceback

        with open("login_error.log", "w") as f:
            f.write(f"{type(e).__name__}: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


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
