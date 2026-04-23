"""
Router de compatibilidad con API del frontend.
Mapea los campos del frontend a los del backend.
"""

from fastapi import APIRouter, HTTPException, status
from app.db import get_db
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api", tags=["API Compat"])


# =====================
# NEWS (mapea /news -> /noticias)
# =====================
class NewsFrontendResponse:
    """Respuesta de noticia en formato frontend."""

    def __init__(self, data: dict):
        self.id = data.get("id")
        self.title = data.get("titulo")  # mapea titulo -> title
        self.content = data.get("contenido")  # mapea contenido -> content
        self.image_url = data.get("imagen_url")
        self.featured = data.get("featured", False)  # default False
        self.created_at = (
            data.get("fecha_publicacion")
            or data.get("created_at")
            or datetime.now().isoformat()
        )
        self.updated_at = data.get("updated_at") or datetime.now().isoformat()

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "image_url": self.image_url,
            "featured": self.featured,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@router.get("/news", response_model=List[dict])
async def get_news_frontend():
    """
    Endpoint de noticias compatible con frontend.
    GET /api/news
    """
    supabase = get_db()
    response = (
        supabase.table("noticias")
        .select("*")
        .order("fecha_publicacion", desc=True)
        .execute()
    )

    news_list = response.data or []
    return [NewsFrontendResponse(n).to_dict() for n in news_list]


@router.get("/news/{noticia_id}", response_model=dict)
async def get_news_by_id_frontend(noticia_id: int):
    """
    Obtiene una noticia por ID.
    """
    supabase = get_db()
    response = supabase.table("noticias").select("*").eq("id", noticia_id).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Noticia no encontrada"
        )

    return NewsFrontendResponse(response.data[0]).to_dict()


# =====================
# PLAYERS (mapea players -> jugadores)
# =====================
@router.get("/players", response_model=List[dict])
async def get_players_frontend():
    """
    Endpoint de jugadores compatible con frontend.
    GET /api/players
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

    result = []
    for j in jugadores.data:
        jugador = {
            "id": j.get("id"),
            "name": j.get("nombre"),  # mapea nombre -> name
            "birthdate": j.get(
                "fecha_nacimiento"
            ),  # mapea fecha_nacimiento -> birthdate
            "category_id": j.get("categoria_id"),
            "position_id": j.get("posicion_id"),
            "photo_url": j.get("foto_url"),
            "category": cat_dict.get(j.get("categoria_id")),
            "position": pos_dict.get(j.get("posicion_id")),
        }
        result.append(jugador)

    return result


# =====================
# TEAM (mapea team -> directiva)
# =====================
@router.get("/team", response_model=List[dict])
async def get_team_frontend():
    """
    Endpoint del equipo (directiva) compatible con frontend.
    GET /api/team
    """
    supabase = get_db()
    response = supabase.table("directiva").select("*").order("cargo").execute()

    if not response.data:
        return []

    return [
        {
            "id": d.get("id"),
            "name": d.get("nombre"),
            "role": d.get("cargo"),  # mapea cargo -> role
            "photo_url": d.get("foto_url"),
            "description": d.get("descripcion"),
        }
        for d in response.data
    ]


# =====================
# SCHOOL (mapea school -> escuelita)
# =====================
@router.get("/school", response_model=List[dict])
async def get_school_frontend():
    """
    Endpoint de la escuela compatible con frontend.
    GET /api/school
    """
    supabase = get_db()
    response = supabase.table("escuelita").select("*").execute()

    if not response.data:
        return []

    return [
        {
            "id": e.get("id"),
            "category": e.get("categoria"),
            "schedule": e.get("horario"),  # mapea horario -> schedule
            "entry": e.get("entrada"),  # mapea entrada -> entry
            "description": e.get("descripcion"),
        }
        for e in response.data
    ]


# =====================
# CLUB INFO
# =====================
@router.get("/club", response_model=dict)
async def get_club_info_frontend():
    """
    Endpoint de información del club.
    GET /api/club
    """
    supabase = get_db()
    response = supabase.table("club").select("*").limit(1).execute()

    if not response.data or len(response.data) == 0:
        return {
            "name": "Las Torres FC",
            "history": "Club de fútbol mixto",
            "mision": "Formar jugadores",
            "vision": "Ser un club referência",
        }

    return response.data[0]
