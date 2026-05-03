# ============================================
# Las Torres FC Backend - Dockerfile
# ============================================
# Usar imagen oficial de Python
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PORT=3001
ENV HOST=0.0.0.0

# Copiar archivos de dependencias primero (para caché)
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY app/ ./app/
COPY .env.example .env

# Crear archivo .env con valores por defecto (NO credentials)
# Las credenciales se pasan en runtime via --env o docker-compose
RUN echo "SUPABASE_URL=" >> .env && \
    echo "SUPABASE_KEY=" >> .env && \
    echo "SUPABASE_SERVICE_KEY=" >> .env && \
    echo "JWT_SECRET=" >> .env && \
    echo "JWT_ALGORITHM=HS256" >> .env && \
    echo "ACCESS_TOKEN_EXPIRE_MINUTES=60" >> .env && \
    echo "HOST=0.0.0.0" >> .env && \
    echo "PORT=3001" >> .env && \
    echo "DEBUG=false" >> .env

# Exponer puerto
EXPOSE 3001

# Iniciar servidor
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001"]