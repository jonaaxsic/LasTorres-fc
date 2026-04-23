"""
Router de galería de imágenes.
Principio S: Solo maneja operaciones de galería.
Principio D: Dependencias inyectadas via get_db().
"""

from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from app.db import get_db
from app.auth import get_current_user
from app.models import ImagenGaleriaResponse, UploadResponse, UserResponse
from typing import List
import uuid
import os
import logging

router = APIRouter(prefix="/api/galeria", tags=["Galería"])
logger = logging.getLogger(__name__)


async def upload_to_supabase_storage(
    supabase, file: bytes, filename: str, folder: str = "galeria"
) -> dict:
    """
    Sube archivo a Supabase Storage.
    """
    # Generar nombre único
    ext = os.path.splitext(filename)[1] or ".jpg"
    unique_name = f"{folder}/{uuid.uuid4()}{ext}"

    # Subir a Supabase Storage
    response = supabase.storage.from_("fotos").upload(unique_name, file)

    # Obtener URL pública
    url_response = supabase.storage.from_("fotos").get_public_url(unique_name)

    return {"name": unique_name, "url": url_response}


@router.get("/", response_model=List[ImagenGaleriaResponse])
async def get_imagenes():
    """
    Obtiene todas las imágenes de la galería.
    """
    supabase = get_db()
    response = (
        supabase.table("galeria")
        .select("id, titulo, imagen_url, fecha_subida")
        .execute()
    )

    # Transformar al formato esperado por el frontend
    result = []
    for img in response.data or []:
        result.append(
            {
                "id": img.get("id"),
                "name": img.get("titulo", ""),
                "url": img.get("imagen_url", ""),
                "created_at": img.get("fecha_subida", ""),
            }
        )
    return result


@router.post("/upload", response_model=UploadResponse)
async def upload_imagen(
    file: UploadFile = File(...),
    folder: str = "galeria",
    current_user: UserResponse = Depends(get_current_user),
):
    """
    Sube una imagen (requiere autenticación).
    """
    supabase = get_db()

    # Leer contenido del archivo
    content = await file.read()

    # Validar tipo
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Solo se permiten imágenes"
        )

    try:
        # Subir a storage
        result = upload_to_supabase_storage(
            supabase, content, file.filename or "image.jpg", folder
        )

        # Guardar en tabla galeria
        db_data = {
            "name": result["name"],
            "url": result["url"],
            "size": len(content),
            "folder": folder,
        }

        supabase.table("galeria").insert(db_data).execute()

        return UploadResponse(**result)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al subir imagen: {str(e)}",
        )


@router.delete("/{filename}")
async def delete_imagen(
    filename: str, current_user: UserResponse = Depends(get_current_user)
):
    """
    Elimina una imagen (requiere autenticación).
    """
    supabase = get_db()

    # Buscar en base de datos
    response = supabase.table("galeria").select("*").eq("name", filename).execute()

    if not response.data or len(response.data) == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Imagen no encontrada"
        )

    # Eliminar de storage
    try:
        supabase.storage.from_("fotos").remove([filename])
    except:
        pass  # Continuar si falla

    # Eliminar de base de datos
    supabase.table("galeria").delete().eq("name", filename).execute()

    return {"message": "Imagen eliminada correctamente"}
