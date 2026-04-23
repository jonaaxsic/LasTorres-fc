"""
Router de noticias.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import NoticiaCreate, NoticiaUpdate, NoticiaResponse, UserResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/noticias", tags=["Noticias"])


@router.get("/", response_model=List[NoticiaResponse])
async def get_noticias():
    """
    Obtiene todas las noticias.
    """
    supabase = get_db()
    response = (
        supabase.table("noticias")
        .select("*")
        .order("fecha_publicacion", desc=True)
        .execute()
    )
    return response.data or []


@router.get("/{noticia_id}", response_model=NoticiaResponse)
async def get_noticia(noticia_id: int):
    """
    Obtiene una noticia por ID.
    """
    supabase = get_db()
    response = supabase.table("noticias").select("*").eq("id", noticia_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Noticia no encontrada"
        )

    return response.data[0]


@router.post("/", response_model=NoticiaResponse)
async def create_noticia(
    noticia: NoticiaCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea una nueva noticia (requiere autenticación).
    """
    supabase = get_db()

    data = noticia.model_dump()
    data["fecha_publicacion"] = datetime.now().isoformat()
    # No incluir autor si no existe la columna
    if "autor" in data:
        del data["autor"]

    response = supabase.table("noticias").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear noticia"
        )

    return response.data[0]


@router.patch("/{noticia_id}", response_model=NoticiaResponse)
async def update_noticia(
    noticia_id: int,
    noticia: NoticiaUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza una noticia (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("noticias").select("*").eq("id", noticia_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Noticia no encontrada"
        )

    # Actualizar solo campos proporcionados
    data = {k: v for k, v in noticia.model_dump().items() if v is not None}

    if data:
        response = (
            supabase.table("noticias").update(data).eq("id", noticia_id).execute()
        )
        return response.data[0]

    return existing.data[0]


@router.delete("/{noticia_id}")
async def delete_noticia(
    noticia_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina una noticia (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("noticias").select("*").eq("id", noticia_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Noticia no encontrado"
        )

    supabase.table("noticias").delete().eq("id", noticia_id).execute()

    return {"message": "Noticia eliminada correctamente"}
