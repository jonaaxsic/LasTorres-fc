"""
Router de jugadores.
"""

from fastapi import APIRouter, HTTPException, status, Depends
from app.db import get_db
from app.auth import get_current_user
from app.models import (
    JugadorCreate,
    JugadorUpdate,
    JugadorResponse,
    CategoriaResponse,
    PosicionResponse,
    UserResponse,
)
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/jugadores", tags=["Jugadores"])


@router.get("/", response_model=List[JugadorResponse])
async def get_jugadores():
    """
    Obtiene todos los jugadores con su categoría y posición.
    """
    supabase = get_db()

    # Obtener jugadores
    jugadores = supabase.table("jugadores").select("*").execute()

    if not jugadores.data:
        return []

    # Obtener categorías y posiciones
    categorias = supabase.table("categorias").select("*").execute()
    posiciones = supabase.table("posiciones").select("*").execute()

    cat_dict = {c["id"]: c for c in (categorias.data or [])}
    pos_dict = {p["id"]: p for p in (posiciones.data or [])}

    # Enriquecer con relaciones
    result = []
    for j in jugadores.data:
        jugador = j.copy()
        jugador["categoria"] = cat_dict.get(j.get("categoria_id"))
        jugador["posicion"] = pos_dict.get(j.get("posicion_id"))
        result.append(jugador)

    return result


@router.get("/{jugador_id}", response_model=JugadorResponse)
async def get_jugador(jugador_id: int):
    """
    Obtiene un jugador por ID.
    """
    supabase = get_db()
    response = supabase.table("jugadores").select("*").eq("id", jugador_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Jugador no encontrado"
        )

    jugador = response.data[0]

    # Cargar relaciones
    cat = (
        supabase.table("categorias")
        .select("*")
        .eq("id", jugador["categoria_id"])
        .execute()
    )
    pos = (
        supabase.table("posiciones")
        .select("*")
        .eq("id", jugador["posicion_id"])
        .execute()
    )

    if cat.data:
        jugador["categoria"] = cat.data[0]
    if pos.data:
        jugador["posicion"] = pos.data[0]

    return jugador


@router.get("/categorias/list", response_model=List[CategoriaResponse])
async def get_categorias():
    """
    Obtiene todas las categorías.
    """
    supabase = get_db()
    response = supabase.table("categorias").select("*").order("edad_min").execute()
    return response.data or []


@router.get("/posiciones/list", response_model=List[PosicionResponse])
async def get_posiciones():
    """
    Obtiene todas las posiciones.
    """
    supabase = get_db()
    response = supabase.table("posiciones").select("*").execute()
    return response.data or []


@router.post("/", response_model=JugadorResponse)
async def create_jugador(
    jugador: JugadorCreate, current_user: UserResponse = Depends(get_current_user)
):
    """
    Crea un nuevo jugador (requiere autenticación).
    """
    supabase = get_db()

    data = jugador.model_dump()
    data["fecha_registro"] = datetime.now().isoformat()

    response = supabase.table("jugadores").insert(data).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear jugador"
        )

    return response.data[0]


@router.patch("/{jugador_id}", response_model=JugadorResponse)
async def update_jugador(
    jugador_id: int,
    jugador: JugadorUpdate,
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Actualiza un jugador (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("jugadores").select("*").eq("id", jugador_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Jugador no encontrado"
        )

    data = {k: v for k, v in jugador.model_dump().items() if v is not None}

    if data:
        response = (
            supabase.table("jugadores").update(data).eq("id", jugador_id).execute()
        )
        return response.data[0]

    return existing.data[0]


@router.delete("/{jugador_id}")
async def delete_jugador(
    jugador_id: int, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina un jugador (requiere autenticación).
    """
    supabase = get_db()

    existing = supabase.table("jugadores").select("*").eq("id", jugador_id).execute()
    if not existing.data or len(existing.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Jugador no encontrado"
        )

    supabase.table("jugadores").delete().eq("id", jugador_id).execute()

    return {"message": "Jugador eliminado correctamente"}
