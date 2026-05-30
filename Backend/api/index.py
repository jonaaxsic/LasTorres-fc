"""Entry point serverless para Vercel - Las Torres FC API."""
import sys
import os

# Agregar Backend/ al path para que encuentre app/
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Las Torres FC API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
