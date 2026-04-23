"""
Tests unitarios para el módulo de autenticación.
"""

import pytest
from datetime import datetime, timedelta
from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_token,
)


class TestPasswordHashing:
    """Tests para hashing de contraseñas."""

    def test_hash_password(self):
        """Test que hash funciona."""
        password = "micontraseña123"
        hashed = get_password_hash(password)

        assert hashed != password
        assert len(hashed) > 0

    def test_verify_correct_password(self):
        """Test verificación de contraseña correcta."""
        password = "micontraseña123"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_wrong_password(self):
        """Test verificación de contraseña incorrecta."""
        password = "contraseña123"
        hashed = get_password_hash(password)

        assert verify_password("contraseñaincorrecta", hashed) is False

    def test_different_hashes_same_password(self):
        """Test que el mismo password genera diferentes hashes (sal única)."""
        password = "micontraseña"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)

        # Deben ser diferentes debido al salt
        assert hash1 != hash2
        # Pero ambos deben verificar correctamente
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True


class TestJWTTokens:
    """Tests para tokens JWT."""

    def test_create_access_token(self):
        """Test crear token de acceso."""
        token = create_access_token(data={"sub": "1"})

        assert token is not None
        assert len(token) > 0
        assert isinstance(token, str)

    def test_create_token_with_expiration(self):
        """Test crear token con expiración."""
        expires = timedelta(minutes=30)
        token = create_access_token(data={"sub": "1"}, expires_delta=expires)

        assert token is not None

    def test_decode_valid_token(self):
        """Test decodificar token válido."""
        token = create_access_token(data={"sub": "123"})
        payload = decode_token(token)

        assert payload is not None
        assert payload.get("sub") == "123"
        assert "exp" in payload

    def test_decode_invalid_token(self):
        """Test decodificar token inválido."""
        from fastapi import HTTPException

        with pytest.raises(HTTPException) as exc_info:
            decode_token("token.invalido")

        assert exc_info.value.status_code == 401

    def test_decode_expired_token(self):
        """Test decodificar token expirado."""
        from fastapi import HTTPException

        # Token ya expirado
        expires = timedelta(days=-1)
        token = create_access_token(data={"sub": "1"}, expires_delta=expires)

        with pytest.raises(HTTPException) as exc_info:
            decode_token(token)

        assert exc_info.value.status_code == 401


class TestAuthIntegration:
    """Tests de integración de autenticación."""

    def test_full_auth_flow(self):
        """Test flujo completo: hash -> token -> verificación."""
        # 1. Crear hash
        password = "password123"
        hashed = get_password_hash(password)

        # 2. Verificar
        assert verify_password(password, hashed) is True

        # 3. Crear token
        token = create_access_token(data={"sub": "1", "nombre": "Test"})

        # 4. Decodificar
        payload = decode_token(token)

        assert payload.get("sub") == "1"
        assert payload.get("nombre") == "Test"
