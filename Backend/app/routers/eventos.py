"""
Router de eventos.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import EventoCreate, EventoUpdate, EventoResponse, UserResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/events", tags=["Eventos"])


@router.get("/", response_model=List[EventoResponse])
async def get_eventos():
    """
    Obtiene todos los eventos.
    """
    supabase = get_db()
    response = supabase.table("eventos").select("*").order("fecha", desc=True).execute()
    return response.data or []


@router.get("/{evento_id}", response_model=EventoResponse)
async def get_evento(evento_id: int):
    """
    Obtiene un evento por ID.
    """
    supabase = get_db()
    response = supabase.table("eventos").select("*").eq("id", evento_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado"
        )

    return response.data[0]


@router.post("/", response_model=EventoResponse)
async def create_evento(
    evento: EventoCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea un nuevo evento (requiere autenticación).
    """
    supabase = get_db()

    data = evento.model_dump()
    data["fecha_creacion"] = datetime.now().isoformat()

    response = supabase.table("eventos").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear evento"
        )

    return response.data[0]


@router.patch("/{evento_id}", response_model=EventoResponse)
async def update_evento(
    evento_id: int,
    evento: EventoUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza un evento (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("eventos").select("*").eq("id", evento_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado"
        )

    # Actualizar solo campos proporcionados
    data = {k: v for k, v in evento.model_dump().items() if v is not None}

    if data:
        response = supabase.table("eventos").update(data).eq("id", evento_id).execute()
        return response.data[0]

    return existing.data[0]


@router.delete("/{evento_id}")
async def delete_evento(
    evento_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina un evento (requiere autenticación).
    """
    supabase = get_db()

    # Verificar que existe
    existing = supabase.table("eventos").select("*").eq("id", evento_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado"
        )

    supabase.table("eventos").delete().eq("id", evento_id).execute()

    return {"message": "Evento eliminado correctamente"}
