"""
Router de directiva (miembros directivos del club).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import DirectivaCreate, DirectivaUpdate, DirectivaResponse, UserResponse
from typing import List

router = APIRouter(prefix="/api/directiva", tags=["Directiva"])


@router.get("/", response_model=List[DirectivaResponse])
async def get_directivos():
    """
    Obtiene todos los miembros directivos.
    """
    supabase = get_db()
    response = supabase.table("directiva").select("*").execute()
    return response.data or []


@router.get("/{directivo_id}", response_model=DirectivaResponse)
async def get_directivo(directivo_id: int):
    """
    Obtiene un directivo por ID.
    """
    supabase = get_db()
    response = supabase.table("directiva").select("*").eq("id", directivo_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directivo no encontrado"
        )

    return response.data[0]


@router.post("/", response_model=DirectivaResponse)
async def create_directivo(
    directiva: DirectivaCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea un nuevo directivo (requiere autenticación).
    """
    supabase = get_db()

    data = directiva.model_dump()
    response = supabase.table("directiva").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear directivo"
        )

    return response.data[0]


@router.patch("/{directivo_id}", response_model=DirectivaResponse)
async def update_directivo(
    directivo_id: int,
    directiva: DirectivaUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza un directivo (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("directiva").select("*").eq("id", directivo_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directivo no encontrado"
        )

    data = {k: v for k, v in directiva.model_dump().items() if v is not None}

    if data:
        response = (
            supabase.table("directiva").update(data).eq("id", directivo_id).execute()
        )
        return response.data[0]

    return existing.data[0]


@router.delete("/{directivo_id}")
async def delete_directivo(
    directivo_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina un directivo (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("directiva").select("*").eq("id", directivo_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directivo no encontrado"
        )

    supabase.table("directiva").delete().eq("id", directivo_id).execute()

    return {"message": "Directivo eliminado correctamente"}
