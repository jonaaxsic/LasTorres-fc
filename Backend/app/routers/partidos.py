"""
Router de partidos (matches).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import PartidoCreate, PartidoUpdate, PartidoResponse, UserResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/matches", tags=["Partidos"])


@router.get("/", response_model=List[PartidoResponse])
async def get_partidos():
    """
    Obtiene todos los partidos.
    """
    supabase = get_db()
    response = (
        supabase.table("partidos").select("*").order("fecha", desc=True).execute()
    )
    return response.data or []


@router.get("/upcoming", response_model=List[PartidoResponse])
async def get_upcoming_matches():
    """
    Obtiene los próximos partidos (programados).
    """
    supabase = get_db()
    now = datetime.now().isoformat()
    response = (
        supabase.table("partidos")
        .select("*")
        .eq("estado", "programado")
        .gte("fecha", now[:10])  # Solo fecha actual
        .order("fecha")
        .limit(10)
        .execute()
    )
    return response.data or []


@router.get("/results", response_model=List[PartidoResponse])
async def get_match_results():
    """
    Obtiene los resultados de partidos (finalizados).
    """
    supabase = get_db()
    response = (
        supabase.table("partidos")
        .select("*")
        .eq("estado", "finalizado")
        .order("fecha", desc=True)
        .limit(20)
        .execute()
    )
    return response.data or []


@router.get("/{partido_id}", response_model=PartidoResponse)
async def get_partido(partido_id: int):
    """
    Obtiene un partido por ID.
    """
    supabase = get_db()
    response = supabase.table("partidos").select("*").eq("id", partido_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado"
        )

    return response.data[0]


@router.post("/", response_model=PartidoResponse)
async def create_partido(
    partido: PartidoCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea un nuevo partido (requiere autenticación).
    """
    supabase = get_db()

    data = partido.model_dump()
    data["fecha_creacion"] = datetime.now().isoformat()

    response = supabase.table("partidos").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear partido"
        )

    return response.data[0]


@router.patch("/{partido_id}", response_model=PartidoResponse)
async def update_partido(
    partido_id: int,
    partido: PartidoUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza un partido (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("partidos").select("*").eq("id", partido_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado"
        )

    # Actualizar solo campos proporcionados
    data = {k: v for k, v in partido.model_dump().items() if v is not None}

    if data:
        response = (
            supabase.table("partidos").update(data).eq("id", partido_id).execute()
        )
        return response.data[0]

    return existing.data[0]


@router.delete("/{partido_id}")
async def delete_partido(
    partido_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina un partido (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("partidos").select("*").eq("id", partido_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado"
        )

    supabase.table("partidos").delete().eq("id", partido_id).execute()

    return {"message": "Partido eliminado correctamente"}
