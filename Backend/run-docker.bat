@echo off
REM ============================================
REM Las Torres FC - Run Docker Container
REM ============================================
REM 
REM IMPORTANTE: Antes de ejecutar, configura las variables de entorno:
REM   set SUPABASE_URL=https://tu-proyecto.supabase.co
REM   set SUPABASE_KEY=tu-api-key
REM   set JWT_SECRET=tu-secreto
REM
REM O mejor: usa un archivo .env y docker-compose

echo.
echo ========================================
echo   Starting Las Torres FC Backend...
echo ========================================
echo.

REM Verificar que las variables estén configuradas
if "%SUPABASE_URL%"=="" (
    echo ERROR: SUPABASE_URL no esta configurada
    echo Configure las variables de entorno antes de ejecutar:
    echo   set SUPABASE_URL=https://tu-proyecto.supabase.co
    echo   set SUPABASE_KEY=tu-api-key
    pause
    exit /b 1
)

docker run -p 3001:3001 ^
  --env SUPABASE_URL=%SUPABASE_URL% ^
  --env SUPABASE_KEY=%SUPABASE_KEY% ^
  --env JWT_SECRET=%JWT_SECRET% ^
  --restart unless-stopped ^
  lastorres-fc-backend:latest

echo.
echo ========================================
echo   Container started!
echo ========================================
echo.
echo API available at: http://localhost:3001
echo Docs: http://localhost:3001/docs
echo.
pause