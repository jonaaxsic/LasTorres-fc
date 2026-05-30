"""
Punto de entrada para Vercel Serverless.
FastAPI es ASGI nativo — Vercel lo soporta directamente sin Mangum.
"""
import sys
import os

# Añadir el directorio Backend al path
backend_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'Backend'))
sys.path.insert(0, backend_path)

# Vercel detecta 'app' como ASGI y lo ejecuta directamente
from app.main import app
