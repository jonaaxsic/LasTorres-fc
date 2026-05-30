"""
Punto de entrada para Vercel Serverless.
Importa la app FastAPI desde el Backend existente.
Usa Mangum como adaptador ASGI para el runtime serverless de Vercel.
"""
import sys
import os
import json
import traceback

# Añadir el directorio Backend al path para que Python encuentre los módulos
backend_path = os.path.join(os.path.dirname(__file__), '..', 'Backend')
backend_path = os.path.normpath(backend_path)
sys.path.insert(0, backend_path)

try:
    from app.main import app
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except Exception as e:
    error_msg = {
        "error": str(e),
        "traceback": traceback.format_exc(),
        "backend_path": backend_path,
        "sys_path": sys.path,
        "cwd": os.getcwd(),
        "files_in_backend": os.listdir(backend_path) if os.path.exists(backend_path) else "BACKEND_PATH_NOT_FOUND",
        "files_in_api": os.listdir(os.path.dirname(__file__)),
    }

    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(error_msg, indent=2),
        }
