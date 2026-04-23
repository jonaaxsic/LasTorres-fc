"""
Router de uploads - Manejo de archivos.
"""

from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Query
from app.db import get_db
from app.auth import get_current_user
from app.models import UploadResponse, UserResponse
import os
import uuid
from datetime import datetime
import io

router = APIRouter(prefix="/api/upload", tags=["Upload"])

# Configuración de uploads
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
MAX_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Query("noticias"),  # carpeta por defecto via query param
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Sube un archivo al storage de Supabase.
    Requiere autenticación.
    """
    # Validar tipo de archivo
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tipo de archivo no permitido. Usar: {', '.join(ALLOWED_TYPES)}",
        )

    # Leer contenido como bytes
    content = await file.read()

    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Archivo muy grande. Máximo 10MB",
        )

    supabase = get_db()

    # Generar nombre único con carpeta configurable
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    # Sanitizar nombre de archivo
    safe_name = file.filename.replace(" ", "_").replace("-", "_")
    file_name = f"{folder}/{uuid.uuid4()}_{safe_name}"

    # Subir a Supabase Storage - pasar bytes directamente, NO base64
    try:
        response = supabase.storage.from_("img-club").upload(
            path=file_name,
            file=content,  # bytes directamente
            options={
                "content_type": file.content_type,
                "cache_control": 3600,
                "upsert": False,
            },
        )

        # Construir URL pública manualmente
        url = f"https://paaekmkjtbdburaxpcsv.supabase.co/storage/v1/object/public/img-club/{file_name}"

        return UploadResponse(name=file_name, url=url)

    except Exception as e:
        # Registrar error para debug
        print(f"Upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_BAD_REQUEST,
            detail=f"Error al subir imagen: {str(e)}",
        )
