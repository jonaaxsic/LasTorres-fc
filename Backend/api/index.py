"""Entry point minimal para Vercel - solo para probar que funciona."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Las Torres FC API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
