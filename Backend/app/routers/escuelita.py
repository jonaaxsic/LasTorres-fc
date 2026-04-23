"""
Router de escuelita (categorías infantiles).
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import EscuelitaCreate, EscuelitaUpdate, EscuelitaResponse, UserResponse
from typing import List

router = APIRouter(prefix="/api/escuelita", tags=["Escuelita"])


@router.get("/", response_model=List[EscuelitaResponse])
async def get_categorias():
    """
    Obtiene todas las categorías de la escuelita.
    """
    supabase = get_db()
    response = supabase.table("escuelita").select("*").execute()
    return response.data or []


@router.get("/{categoria_id}", response_model=EscuelitaResponse)
async def get_categoria(categoria_id: int):
    """
    Obtiene una categoría por ID.
    """
    supabase = get_db()
    response = supabase.table("escuelita").select("*").eq("id", categoria_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )

    return response.data[0]


@router.post("/", response_model=EscuelitaResponse)
async def create_categoria(
    escuelita: EscuelitaCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea una categoría (requiere autenticación).
    """
    supabase = get_db()

    data = escuelita.model_dump()
    response = supabase.table("escuelita").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear categoría"
        )

    return response.data[0]


@router.patch("/{categoria_id}", response_model=EscuelitaResponse)
async def update_categoria(
    categoria_id: int,
    escuelita: EscuelitaUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza una categoría (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("escuelita").select("*").eq("id", categoria_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )

    data = {k: v for k, v in escuelita.model_dump().items() if v is not None}

    if data:
        response = (
            supabase.table("escuelita").update(data).eq("id", categoria_id).execute()
        )
        return response.data[0]

    return existing.data[0]


@router.delete("/{categoria_id}")
async def delete_categoria(
    categoria_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina una categoría (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("escuelita").select("*").eq("id", categoria_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada"
        )

    supabase.table("escuelita").delete().eq("id", categoria_id).execute()

    return {"message": "Categoría eliminada correctamente"}
