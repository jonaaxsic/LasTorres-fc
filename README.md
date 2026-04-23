<h1 align="center">Las Torres FC</h1>

<p align="center">
  <img src="assets/logo.png" alt="Logo Las Torres FC" width="150" />
</p>

<p align="center">
  Página web oficial del Club de Fútbol Las Torres FC.
</p>

## Tecnologías

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

### Backend
<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

## Estructura del Proyecto

```
LasTorres/
├── frontend/                 # Frontend Next.js
│   ├── app/                  # Páginas y rutas
│   │   ├── admin/            # Panel de administración
│   │   │   └── login/        # Login admin
│   │   ├── noticias/        # Sección noticias
│   │   ├── jugadores/       # Jugadores
│   │   ├── galeria/         # Galería
│   │   └── ...              # Otras páginas
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes Shadcn
│   │   └── admin/            # Componentes admin
│   └── styles/              # Estilos globales
│
└── Backend/                 # Backend Python
    ├── run.py               # Punto de entrada
    └── docker-compose.yml  # Configuración Docker
```

## Páginas Públicas

- `/` - Inicio
- `/noticias` - Noticias del club
- `/jugadores` - Plantilla de jugadores
- `/galeria` - Galería de imágenes
- `/club` - Información del club
- `/directiva` - Dirección del club
- `/escuelita` - Escola de fútbol
- `/contacto` - Contacto

## Getting Started

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

### Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

O usando Docker:

```bash
cd Backend
docker-compose up
```

## Licencia

MIT

## Redes Sociales

<p align="center">
  <a href="https://www.instagram.com/lastorres.f/">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="40" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://web.facebook.com/profile.php?id=61575806463393">
    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" width="40" />
  </a>
</p>