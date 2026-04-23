"""
Router temporal para debug - listar usuarios.
BORRAR DESPUÉS DE USAR.
"""

from fastapi import APIRouter, Response
from app.db import get_db

router = APIRouter(prefix="/debug", tags=["Debug"])


@router.get("/usuarios")
async def list_usuarios():
    """Lista todos los usuarios (para debug)."""
    supabase = get_db()
    response = supabase.table("usuarios").select("id, nombre, email, rol").execute()
    return {"usuarios": response.data or []}


@router.get("/tablas")
async def list_tablas():
    """Lista tablas disponibles."""
    supabase = get_db()
    # Intentar listar tablas
    try:
        response = (
            supabase.table("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public")
            .execute()
        )
        return {"tablas": response.data or []}
    except Exception as e:
        return {"error": str(e)}
