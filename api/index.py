"""
Punto de entrada para Vercel Serverless.
"""
import sys
import os
import json

# Añadir el directorio Backend al path
backend_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'Backend'))
sys.path.insert(0, backend_path)


def handler(event, context):
    """Handler directo SIN Mangum para probar si Python funciona en Vercel."""
    try:
        from app.main import app
        from mangum import Mangum
        m = Mangum(app, lifespan="off")
        return m(event, context)
    except Exception as e:
        import traceback
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": str(e),
                "traceback": traceback.format_exc(),
                "backend_path": backend_path,
                "backend_exists": os.path.exists(backend_path),
                "files_in_backend": os.listdir(backend_path) if os.path.exists(backend_path) else "NOT_FOUND",
                "cwd": os.getcwd(),
            }, indent=2),
        }
