"""Entry point serverless - conecta con la app FastAPI real."""
import sys
import os

# Agregar Backend/ al path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.main import app
