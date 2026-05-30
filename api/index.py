"""
Punto de entrada para Vercel Serverless.
FastAPI ASGI con Mangum para Vercel.
"""
import sys
import os
import json
import traceback

backend_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'Backend'))
sys.path.insert(0, backend_path)

# Intentar importar la app FastAPI
try:
    from app.main import app as _fastapi_app
    from mangum import Mangum
    app = Mangum(_fastapi_app, lifespan="off")
    handler = app  # alias para compatibilidad
except Exception as e:
    error_data = {
        "error": str(e),
        "traceback": traceback.format_exc(),
        "backend_path": backend_path,
        "backend_exists": os.path.exists(backend_path),
        "files_in_backend": os.listdir(backend_path) if os.path.exists(backend_path) else "NOT_FOUND",
        "cwd": os.getcwd(),
    }
    print(f"APP_INIT_ERROR: {json.dumps(error_data, indent=2)}")

    async def app(scope, receive, send):
        """ASGI app que devuelve el error como JSON"""
        body = json.dumps(error_data).encode()
        await send({
            "type": "http.response.start",
            "status": 500,
            "headers": [(b"content-type", b"application/json")],
        })
        await send({"type": "http.response.body", "body": body})

    handler = app
