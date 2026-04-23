"""
Configuración de pytest para tests de integración.
"""

import pytest
import sys
import os

# Agregar el directorio raíz al path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


@pytest.fixture(scope="session")
def anyio_backend():
    """Backend para async tests."""
    return "asyncio"


def pytest_configure(config):
    """Configuración de pytest."""
    config.addinivalue_line("markers", "integration: marks tests as integration tests")
    config.addinivalue_line("markers", "unit: marks tests as unit tests")
