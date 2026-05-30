"""
Punto de entrada para Vercel Serverless.
Importa la app FastAPI desde el Backend existente.
Usa Mangum como adaptador ASGI para el runtime serverless de Vercel.
"""
import sys
import os
import logging

# Configurar logging para debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Añadir el directorio Backend al path para que Python encuentre los módulos
backend_path = os.path.join(os.path.dirname(__file__), '..', 'Backend')
sys.path.insert(0, backend_path)
logger.info(f"Backend path: {backend_path}")
logger.info(f"Sys.path: {sys.path}")

from app.main import app
from mangum import Mangum

# Handler que Vercel ejecuta
# lifespan="off" porque en serverless no hay ciclo de vida persistente
handler = Mangum(app, lifespan="off")
