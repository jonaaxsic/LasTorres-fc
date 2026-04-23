"""
Cliente de base de datos Supabase.
"""

import threading
from supabase import create_client, Client


_supabase_client: Client = None
_lock = threading.Lock()


def _get_settings():
    """Get settings lazily to avoid initialization issues."""
    from app.config import get_settings

    return get_settings()


def get_supabase_client() -> Client:
    """
    Crea y retorna el cliente de Supabase.
    """
    settings = _get_settings()
    return create_client(settings.supabase_url, settings.supabase_key)


def get_supabase_admin() -> Client:
    """Crea cliente admin de Supabase."""
    settings = _get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)


def init_db():
    """Inicializa la conexión a la base de datos."""
    global _supabase_client
    with _lock:
        if _supabase_client is None:
            _supabase_client = get_supabase_client()


def get_db() -> Client:
    """Obtiene el cliente de base de datos."""
    global _supabase_client
    if _supabase_client is None:
        init_db()
    if _supabase_client is None:
        init_db()  # Try again
    return _supabase_client
