# ============================================
# Las Torres FC Backend - Dockerfile
# ============================================
FROM python:3.11-slim

WORKDIR /app

# Copiar solo lo necesario del backend
COPY Backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend/app ./app

# Variables de entorno
ENV PYTHONUNBUFFERED=1
ENV PORT=3001
ENV HOST=0.0.0.0
ENV PYTHONPATH=/app

EXPOSE 3001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001"]