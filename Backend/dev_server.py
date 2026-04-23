#!/usr/bin/env python
"""Servidor de desarrollo con uvicorn configurado para Windows."""

import sys
import uvicorn

if __name__ == "__main__":
    # Configuración para evitar problemas en Windows
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=3001,
        reload=False,
        workers=1,
        loop="asyncio",
        http="h11",
        log_level="info",
    )
