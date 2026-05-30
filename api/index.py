"""
Punto de entrada para Vercel Serverless.
Importa la app FastAPI desde el Backend existente.
Usa Mangum como adaptador ASGI para el runtime serverless de Vercel.
"""
import sys
import os

# Añadir el directorio Backend al path para que Python encuentre los módulos
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'Backend'))

from app.main import app
from mangum import Mangum

# Handler que Vercel ejecuta
# lifespan="off" porque en serverless no hay ciclo de vida persistente
handler = Mangum(app, lifespan="off")
