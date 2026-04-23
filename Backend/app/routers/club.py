"""
Router de información del club.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import ClubUpdate, ClubResponse, UserResponse

router = APIRouter(prefix="/api/club", tags=["Club"])


def get_or_create_club(supabase) -> dict:
    """
    Obtiene el club o crea uno nuevo si no existe.
    """
    response = supabase.table("club").select("*").execute()

    if response.data and len(response.data) > 0:
        return response.data[0]

    # Crear registro inicial
    insert_response = supabase.table("club").insert({}).execute()

    if insert_response.data and len(insert_response.data) > 0:
        return insert_response.data[0]

    return {"id": 1}


@router.get("/", response_model=ClubResponse)
async def get_club_info():
    """
    Obtiene la información del club.
    """
    supabase = get_db()

    response = supabase.table("club").select("*").execute()

    if not response.data or len(response.data) == 0:
        # Devolver estructura vacía
        return ClubResponse(
            id=1,
            nombre="Las Torres FC",
            direccion="",
            telefono="",
            email="",
            historia="",
            mision="",
            vision="",
            logo_url="",
            facebook="",
            instagram="",
            youtube="",
        )

    return response.data[0]


@router.patch("/", response_model=ClubResponse)
async def update_club_info(
    club: ClubUpdate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Actualiza la información del club (requiere autenticación).
    """
    supabase = get_db()

    # Obtener club actual
    current = supabase.table("club").select("*").execute()

    if not current.data or len(current.data) == 0:
        # Crear nuevo
        data = {k: v for k, v in club.model_dump().items() if v is not None}
        response = supabase.table("club").insert(data).execute()
        return response.data[0]

    # Actualizar solo campos proporcionados
    data = {k: v for k, v in club.model_dump().items() if v is not None}

    if data:
        club_id = current.data[0]["id"]
        response = supabase.table("club").update(data).eq("id", club_id).execute()
        return response.data[0]

    return current.data[0]
