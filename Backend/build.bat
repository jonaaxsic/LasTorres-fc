@echo off
REM ============================================
REM Las Torres FC - Build Docker Image
REM ============================================

echo.
echo ========================================
echo   Building Docker Image...
echo ========================================
echo.

docker build -t lastorres-fc-backend:latest .

echo.
echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo To run the container:
echo   docker run -p 3001:3001 lastorres-fc-backend:latest
echo.
echo Or use docker-compose:
echo   docker-compose up -d
echo.
pause