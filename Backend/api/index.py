"""
Entry point para Vercel Serverless (proyecto separado Backend).
"""
import sys
import os

# Añadir app/ al path para imports relativos
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.main import app
