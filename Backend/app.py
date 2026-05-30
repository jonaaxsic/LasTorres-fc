"""Entry point ASGI para Vercel - auto-detectado en app.py"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Las Torres FC API", "status": "online"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
