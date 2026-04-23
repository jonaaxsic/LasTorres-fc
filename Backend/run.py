#!/usr/bin/env python
"""Script para iniciar el servidor Las Torres FC Backend."""

import uvicorn

if __name__ == "__main__":
    print("🚀 Iniciando Las Torres FC Backend...")
    print("📡 Servidor en: http://localhost:3001")
    print("📚 API Docs:   http://localhost:3001/docs")

    uvicorn.run("app.main:app", host="0.0.0.0", port=3001, reload=False, workers=1)
