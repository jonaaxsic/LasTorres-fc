"""
Modelos Pydantic para validación de datos.
Actualizado para Pydantic v2 - usando ConfigDict
"""

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime


# Config global para todos los modelos
model_config = ConfigDict(from_attributes=True)


# =====================
# Modelos de Usuario
# =====================
class UserCreate(BaseModel):
    """Modelo para crear usuario."""

    model_config = ConfigDict(
        str_min_length=2, str_max_length=100, email="email", min_length=6
    )

    nombre: str = Field(..., min_length=2, max_length=100)
    correo: EmailStr
    password: str = Field(..., min_length=6)
    rol: str = Field(default="usuario")


class UserLogin(BaseModel):
    """Modelo para login - usa 'email' igual que Supabase."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Modelo de respuesta de usuario."""

    model_config = ConfigDict(
        from_attributes=True,
        extra="ignore",
        populate_by_name=True,
    )

    id: int
    nombre: str
    correo: Optional[str] = None  # Se mapea desde email
    rol: str

    def __init__(self, **data):
        # Mapear email -> correo si es necesario
        if "email" in data and "correo" not in data:
            data["correo"] = data["email"]
        super().__init__(**data)


class TokenResponse(BaseModel):
    """Modelo de respuesta de token."""

    accessToken: Optional[str] = None
    access_token: Optional[str] = None
    expiresIn: int
    usuario: UserResponse


# =====================
# Modelos de Noticias
# =====================
class NoticiaCreate(BaseModel):
    """Modelo para crear noticia."""

    titulo: str = Field(..., min_length=3, max_length=200)
    contenido: str
    imagen_url: Optional[str] = None
    # autor es opcional - la tabla puede no tener esta columna
    autor: Optional[str] = None


class NoticiaUpdate(BaseModel):
    """Modelo para actualizar noticia."""

    titulo: Optional[str] = None
    contenido: Optional[str] = None
    imagen_url: Optional[str] = None
    autor: Optional[str] = None


class NoticiaResponse(BaseModel):
    """Modelo de respuesta de noticia."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    contenido: str
    imagen_url: Optional[str] = None
    fecha_publicacion: Optional[str] = None
    autor: Optional[str] = None


# =====================
# Modelos de Jugadores
# =====================
class CategoriaResponse(BaseModel):
    """Modelo de respuesta de categoría."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    edad_min: int
    edad_max: int


class PosicionResponse(BaseModel):
    """Modelo de respuesta de posición."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str


class JugadorCreate(BaseModel):
    """Modelo para crear jugador."""

    nombre: str = Field(..., min_length=2, max_length=100)
    fecha_nacimiento: str
    categoria_id: int
    posicion_id: int
    foto_url: Optional[str] = None


class JugadorUpdate(BaseModel):
    """Modelo para actualizar jugador."""

    nombre: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    categoria_id: Optional[int] = None
    posicion_id: Optional[int] = None
    foto_url: Optional[str] = None


class JugadorResponse(BaseModel):
    """Modelo de respuesta de jugador."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    fecha_nacimiento: str
    categoria_id: int
    posicion_id: int
    foto_url: Optional[str] = None
    fecha_registro: Optional[str] = None
    categoria: Optional[CategoriaResponse] = None
    posicion: Optional[PosicionResponse] = None


# =====================
# Modelos de Galería
# =====================
class ImagenGaleriaResponse(BaseModel):
    """Modelo de respuesta de imagen."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    url: str
    size: Optional[int] = None
    folder: Optional[str] = None
    created_at: Optional[str] = None


class UploadResponse(BaseModel):
    """Modelo de respuesta de upload."""

    name: str
    url: str


# =====================
# Modelos de Escuelita
# =====================
class EscuelitaCreate(BaseModel):
    """Modelo para crear categoría de escuelita."""

    categoria: str = Field(..., min_length=2, max_length=50)
    horario: str = Field(..., min_length=5, max_length=50)
    entrada: str = Field(..., min_length=5, max_length=50)
    descripcion: Optional[str] = None


class EscuelitaUpdate(BaseModel):
    """Modelo para actualizar escuelita."""

    categoria: Optional[str] = None
    horario: Optional[str] = None
    entrada: Optional[str] = None
    descripcion: Optional[str] = None


class EscuelitaResponse(BaseModel):
    """Modelo de respuesta de escuelita."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria: str
    horario: str
    entrada: str
    descripcion: Optional[str] = None


# =====================
# Modelos de Directiva
# =====================
class DirectivaCreate(BaseModel):
    """Modelo para crear directivo."""

    nombre: str = Field(..., min_length=2, max_length=100)
    cargo: str = Field(..., min_length=2, max_length=50)
    foto_url: Optional[str] = None
    descripcion: Optional[str] = None


class DirectivaUpdate(BaseModel):
    """Modelo para actualizar directiva."""

    nombre: Optional[str] = None
    cargo: Optional[str] = None
    foto_url: Optional[str] = None
    descripcion: Optional[str] = None


class DirectivaResponse(BaseModel):
    """Modelo de respuesta de directiva."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    cargo: str
    foto_url: Optional[str] = None
    descripcion: Optional[str] = None


# =====================
# Modelos de Club
# =====================
class ClubUpdate(BaseModel):
    """Modelo para actualizar información del club."""

    nombre: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    historia: Optional[str] = None
    mision: Optional[str] = None
    vision: Optional[str] = None
    logo_url: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None


class ClubResponse(BaseModel):
    """Modelo de respuesta de club."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    historia: Optional[str] = None
    mision: Optional[str] = None
    vision: Optional[str] = None
    logo_url: Optional[str] = None
    facebook: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None


# =====================
# Modelos de Eventos (Frontend)
# =====================
class EventoCreate(BaseModel):
    """Modelo para crear evento."""

    titulo: str = Field(..., min_length=3, max_length=200)
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    fecha: str = Field(..., min_length=10, max_length=20)
    hora: Optional[str] = None
    lugar: Optional[str] = None
    tipo_evento: Optional[str] = Field(default="evento")


class EventoUpdate(BaseModel):
    """Modelo para actualizar evento."""

    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    fecha: Optional[str] = None
    hora: Optional[str] = None
    lugar: Optional[str] = None
    tipo_evento: Optional[str] = None


class EventoResponse(BaseModel):
    """Modelo de respuesta de evento."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    titulo: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    fecha: str
    hora: Optional[str] = None
    lugar: Optional[str] = None
    tipo_evento: Optional[str] = "evento"


# =====================
# Modelos de Partidos (Matches - Frontend)
# =====================
class PartidoCreate(BaseModel):
    """Modelo para crear partido."""

    rival: str = Field(..., min_length=2, max_length=100)
    logo_rival: Optional[str] = None
    fecha: str = Field(..., min_length=10, max_length=20)
    hora: Optional[str] = None
    lugar: str = Field(..., min_length=3, max_length=100)
    marca_local: Optional[int] = None
    marca_visitante: Optional[int] = None
    es_local: bool = Field(default=True)
    categoria: Optional[str] = None
    estado: Optional[str] = Field(default="programado")


class PartidoUpdate(BaseModel):
    """Modelo para actualizar partido."""

    rival: Optional[str] = None
    logo_rival: Optional[str] = None
    fecha: Optional[str] = None
    hora: Optional[str] = None
    lugar: Optional[str] = None
    marca_local: Optional[int] = None
    marca_visitante: Optional[int] = None
    es_local: Optional[bool] = None
    categoria: Optional[str] = None
    estado: Optional[str] = None


class PartidoResponse(BaseModel):
    """Modelo de respuesta de partido."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    rival: str
    logo_rival: Optional[str] = None
    fecha: str
    hora: Optional[str] = None
    lugar: str
    marca_local: Optional[int] = None
    marca_visitante: Optional[int] = None
    es_local: bool = True
    categoria: Optional[str] = None
    estado: str = "programado"
