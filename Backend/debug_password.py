"""
Script simple para verificar usuarios y contraseñas.
"""

from supabase import create_client
import bcrypt

SUPABASE_URL = "https://paaekmkjtbdburaxpcsv.supabase.co"
SUPABASE_KEY = "sb_publishable_RK71cifL35qfpln6D-DtLQ_fPg1_dDp"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=== Usuario admin ===")
response = (
    supabase.table("usuarios").select("id, email, nombre, password, rol").execute()
)
for u in response.data:
    print(f"Email: {u.get('email')}")
    print(f"Nombre: {u.get('nombre')}")
    print(f"Hash: {u.get('password')[:50]}...")  # primeros 50 chars
    print(f"Rol: {u.get('rol')}")

    # Verificar contraseña
    hash_stored = u.get("password", "")
    test_pass = "admin123"
    try:
        result = bcrypt.checkpw(test_pass.encode("utf-8"), hash_stored.encode("utf-8"))
        print(f"verify bcrypt: {result}")
    except:
        print(f"Error bcrypt - verificando texto plano: {hash_stored == test_pass}")
