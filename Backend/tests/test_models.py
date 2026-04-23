"""
Tests unitarios para modelos Pydantic.
"""

import pytest
from pydantic import ValidationError
from app.models import (
    UserCreate,
    UserLogin,
    UserResponse,
    NoticiaCreate,
    NoticiaUpdate,
    JugadorCreate,
    JugadorUpdate,
    EscuelitaCreate,
    EscuelitaUpdate,
    DirectivaCreate,
    DirectivaUpdate,
    ClubUpdate,
    TokenResponse,
)


class TestUserModels:
    """Tests para modelos de usuario."""

    def test_user_create_valid(self):
        """Test crear usuario con datos válidos."""
        user = UserCreate(
            nombre="Juan Pérez", correo="juan@test.com", password="password123"
        )
        assert user.nombre == "Juan Pérez"
        assert user.correo == "juan@test.com"
        assert user.rol == "usuario"  # default

    def test_user_create_without_rol(self):
        """Test que rol por defecto es 'usuario'."""
        user = UserCreate(nombre="Test User", correo="test@test.com", password="123456")
        assert user.rol == "usuario"

    def test_user_create_invalid_email(self):
        """Test email inválido es rechazado."""
        with pytest.raises(ValidationError):
            UserCreate(nombre="Test", correo="no-es-email", password="123456")

    def test_user_create_short_password(self):
        """Test contraseña corta es rechazada."""
        with pytest.raises(ValidationError):
            UserCreate(
                nombre="Test",
                correo="test@test.com",
                password="123",  # menos de 6 caracteres
            )

    def test_user_login_valid(self):
        """Test login con datos válidos."""
        login = UserLogin(correo="juan@test.com", password="password123")
        assert login.correo == "juan@test.com"
        assert login.password == "password123"

    def test_user_response(self):
        """Test respuesta de usuario."""
        user = UserResponse(
            id=1, nombre="Test User", correo="test@test.com", rol="admin"
        )
        assert user.id == 1
        assert user.rol == "admin"


class TestNoticiaModels:
    """Tests para modelos de noticias."""

    def test_noticia_create_valid(self):
        """Test crear noticia válida."""
        noticia = NoticiaCreate(
            titulo="Nueva Temporada", contenido="El equipo inicia entrenamientos..."
        )
        assert noticia.titulo == "Nueva Temporada"
        assert noticia.contenido == "El equipo inicia entrenamientos..."

    def test_noticia_create_with_imagen(self):
        """Test noticia con imagen."""
        noticia = NoticiaCreate(
            titulo="Partido",
            contenido="Gran victoria",
            imagen_url="https://example.com/img.jpg",
            autor="Director",
        )
        assert noticia.imagen_url == "https://example.com/img.jpg"
        assert noticia.autor == "Director"

    def test_noticia_create_short_title(self):
        """Test título muy corto es rechazado."""
        with pytest.raises(ValidationError):
            NoticiaCreate(
                titulo="AB",  # menos de 3 caracteres
                contenido="Contenido",
            )

    def test_noticia_update_partial(self):
        """Test actualización parcial."""
        update = NoticiaUpdate(titulo="Nuevo Título")
        assert update.titulo == "Nuevo Título"
        assert update.contenido is None


class TestJugadorModels:
    """Tests para modelos de jugadores."""

    def test_jugador_create_valid(self):
        """Test crear jugador válido."""
        jugador = JugadorCreate(
            nombre="Pedro García",
            fecha_nacimiento="2015-03-15",
            categoria_id=1,
            posicion_id=2,
        )
        assert jugador.nombre == "Pedro García"
        assert jugador.categoria_id == 1

    def test_jugador_update_partial(self):
        """Test actualización parcial de jugador."""
        update = JugadorUpdate(nombre="Nuevo Nombre")
        assert update.nombre == "Nuevo Nombre"
        assert update.fecha_nacimiento is None


class TestEscuelitaModels:
    """Tests para modelos de escuelita."""

    def test_escuelita_create_valid(self):
        """Test crear categoría de escuelita."""
        escuelita = EscuelitaCreate(
            categoria="Preminima",
            horario="Lunes 16:00-17:30",
            entrada="16:00",
            descripcion="Categoría infantil",
        )
        assert escuelita.categoria == "Preminima"
        assert escuelita.horario == "Lunes 16:00-17:30"

    def test_escuelita_update_partial(self):
        """Test actualización parcial."""
        update = EscuelitaUpdate(horario="Martes 16:00")
        assert update.horario == "Martes 16:00"


class TestDirectivaModels:
    """Tests para modelos de directiva."""

    def test_directiva_create_valid(self):
        """Test crear directivo."""
        directiva = DirectivaCreate(
            nombre="Juan Pérez", cargo="Presidente", descripcion="Presidente del club"
        )
        assert directiva.cargo == "Presidente"

    def test_directiva_update_partial(self):
        """Test actualización parcial."""
        update = DirectivaUpdate(cargo="Vicepresidente")
        assert update.cargo == "Vicepresidente"


class TestClubModels:
    """Tests para modelos de club."""

    def test_club_update_valid(self):
        """Test actualizar información del club."""
        club = ClubUpdate(
            nombre="Las Torres FC", telefono="+1234567890", email="info@lastorres.com"
        )
        assert club.nombre == "Las Torres FC"
        assert club.telefono == "+1234567890"

    def test_club_update_partial(self):
        """Test actualización parcial."""
        club = ClubUpdate(telefono="+9876543210")
        assert club.telefono == "+9876543210"
        assert club.nombre is None
