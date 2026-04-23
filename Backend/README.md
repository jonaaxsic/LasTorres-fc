# Las Torres FC Backend

Backend API construido con **FastAPI** y **Supabase** para el equipo de fútbol Las Torres FC.

## Requisitos

- Python 3.10+
- Supabase (base de datos existente)

## Instalación

1. **Crear entorno virtual:**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
```

2. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

3. **Configurar variables de entorno:**

Copia `.env.example` a `.env` y completa los valores:

```bash
cp .env.example .env
```

4. **Obtener las credenciales de Supabase:**

Desde el archivo de contraseñas, completa:
- `SUPABASE_URL`: `https://paaekmkjtbdburaxpcsv.supabase.co`
- `SUPABASE_KEY`: La key pública de Supabase
- `SUPABASE_SERVICE_KEY`: La service role key (del dashboard de Supabase)

## Ejecutar el servidor

```bash
# Desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 3001

# O simplemente
python -m app.main
```

El servidor estará disponible en: `http://localhost:3001`

## Documentación API

- Swagger UI: `http://localhost:3001/docs`
- ReDoc: `http://localhost:3001/redoc`

## Endpoints Disponibles

| Módulo | Endpoints |
|--------|----------|
| **Auth** | POST /api/auth/login, GET /api/auth/profile |
| **Noticias** | GET, POST, PATCH, DELETE /api/noticias |
| **Jugadores** | GET, POST, PATCH, DELETE /api/jugadores |
| **Galería** | GET /api/galeria, POST /api/galeria/upload |
| **Escuelita** | GET, POST, PATCH, DELETE /api/escuelita |
| **Directiva** | GET, POST, PATCH, DELETE /api/directiva |
| **Club** | GET, PATCH /api/club |

## Estructura del Proyecto

```
backendPython/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuración
│   ├── db.py            # Cliente Supabase
│   ├── models.py        # Modelos Pydantic
│   ├── auth.py         # Autenticación JWT
│   ├── constants.py    # Constantes deBD
│   ├── main.py        # Aplicación principal
│   └── routers/
│       ├── __init__.py
│       ├── auth.py
│       ├── noticias.py
│       ├── jugadores.py
│       ├── galeria.py
│       ├── escuelita.py
│       ├── directiva.py
│       └── club.py
├── .env
├── .env.example
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Principios Aplicados

- **S** (Single Responsibility): Cada router maneja un dominio específico
- **D** (Dependency Inversion): Dependencias inyectadas, no hardcoded
- **O** (Open/Closed): Fácil de extender sin modificar existente

## Actualizar Frontend

Después de migrar el backend, actualiza la URL en los servicios del frontend:

```typescript
// En Frontend/src/app/services/*.ts
private readonly apiUrl = 'http://localhost:3001/api';
```

## Notas de Seguridad

- ⚠️ NUNCA expongas el archivo `.env` en git
- ℹ️ Las credenciales de Supabase están en el archivo de contraseñas
- ✅ El JWT secret debe ser único y seguro