"""
Aplicación principal FastAPI - Las Torres FC Backend.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import get_settings
from app.db import init_db
from app.routers import (
    auth,
    noticias,
    jugadores,
    galeria,
    escuelita,
    directiva,
    club,
    eventos,
    partidos,
    upload,
    compat,
    debug,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Eventos de lifecycle de la aplicación.
    """
    # Inicio - inicializar base de datos
    init_db()
    yield
    # Cierre - limpiar recursos


# Crear aplicación FastAPI
app = FastAPI(
    title="Las Torres FC API",
    description="Backend API para el equipo de fútbol Las Torres FC",
    version="1.0.0",
    lifespan=lifespan,
)

# Configurar CORS - permitir todo para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth.router)
app.include_router(noticias.router)
app.include_router(jugadores.router)
app.include_router(galeria.router)
app.include_router(escuelita.router)
app.include_router(directiva.router)
app.include_router(club.router)
app.include_router(eventos.router)
app.include_router(partidos.router)
app.include_router(upload.router)
app.include_router(compat.router)
app.include_router(debug.router)


@app.get("/")
async def root():
    """Endpoint raíz."""
    return {"message": "Las Torres FC API", "version": "1.0.0", "status": "online"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Manejo global de excepciones."""
    import traceback

    error_msg = f"{type(exc).__name__}: {str(exc)}"
    logger.error(f"Error en {request.url}: {error_msg}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500, content={"detail": str(exc), "error_type": type(exc).__name__}
    )
