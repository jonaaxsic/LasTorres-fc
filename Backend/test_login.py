#!/usr/bin/env python
"""Script para iniciar el servidor de forma estable."""

import subprocess
import sys
import time
import requests


def test_login():
    """Probar login directamente."""
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    print("Probando login...")

    response = client.post(
        "/api/auth/login",
        json={"correo": "admin@lastorresfc.cl", "password": "Admin456"},
    )

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ LOGIN EXITOSO!")
        print(f"   Usuario: {data['usuario']['nombre']}")
        print(f"   Rol: {data['usuario']['rol']}")
        print(f"   Token: {data['accessToken'][:30]}...")
    else:
        print(f"Error: {response.text}")


if __name__ == "__main__":
    test_login()
