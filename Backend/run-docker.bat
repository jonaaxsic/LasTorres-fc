@echo off
REM ============================================
REM Las Torres FC - Run Docker Container
REM ============================================

echo.
echo ========================================
echo   Starting Las Torres FC Backend...
echo ========================================
echo.

docker run -p 3001:3001 ^
  --env SUPABASE_URL=https://paaekmkjtbdburaxpcsv.supabase.co ^
  --env SUPABASE_KEY=sb_publishable_RK71cifL35qfpln6D-DtLQ_fPg1_dDp ^
  --env JWT_SECRET=las-torres-fc-jwt-secret-2024 ^
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