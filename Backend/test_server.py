#!/usr/bin/env python
"""Test login with detailed error output."""

import requests

url = "http://localhost:3001/api/auth/login"
data = {"correo": "admin@lastorresfc.cl", "password": "Admin456"}

print("Testing login...")
print(f"URL: {url}")
print(f"Data: {data}")
print()

try:
    response = requests.post(url, json=data, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Exception: {type(e).__name__}: {e}")
