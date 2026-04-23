"""
Script simple para verificar usuarios en la base de datos.
Ejecutar: python debug_db.py
"""

from supabase import create_client

# Cargar config manualmente
import os

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://paaekmkjtbdburaxpcsv.supabase.co")
SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY", "sb_publishable_RK71cifL35qfpln6D-DtLQ_fPg1_dDp"
)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=== Verificando tabla 'usuarios' ===")
try:
    response = supabase.table("usuarios").select("id, email, nombre, rol").execute()
    print(f"Usuarios encontrados: {len(response.data)}")
    for u in response.data:
        print(
            f"  - ID: {u.get('id')}, Email: {u.get('email')}, Nombre: {u.get('nombre')}, Rol: {u.get('rol')}"
        )
except Exception as e:
    print(f"Error: {e}")

print("\n=== Verificando tablas disponibles ===")
# Intentar algunas tablas comunes
tables = ["usuarios", "noticias", "jugadores", "directiva", "eventos", "partidos"]
for table in tables:
    try:
        response = supabase.table(table).select("id").limit(1).execute()
        print(f"✓ {table} existe")
    except:
        print(f"✗ {table} NO existe")
