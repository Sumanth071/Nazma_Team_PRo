@echo off
title ColoAI-Polyp PRODUCTION ENVIRONMENT - Public Live Tunnel Launcher
echo =====================================================================
echo    COLOAI-POLYP DIAGNOSTIC PLATFORM - [LIVE PRODUCTION ENVIRONMENT]
echo    Database: MongoDB Atlas (coloai_prod)
echo    Access: Worldwide Public Live HTTPS URL (Cloudflare Tunnel)
echo =====================================================================

echo Configuring PRODUCTION environment variables...
copy /Y .env.prod .env > nul
copy /Y .env.prod server\.env > nul

echo [1/4] Starting Python FastAPI AI Microservice on port 8000...
if exist "ai_service\.venv\Scripts\python.exe" (
    start "ColoAI AI Microservice [PROD] (Port 8000)" cmd /k "ai_service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else if exist "%APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe" (
    start "ColoAI AI Microservice [PROD] (Port 8000)" cmd /k "set PYTHONPATH=%CD%\ai_service\.venv\Lib\site-packages;%CD%\ai_service && %APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else (
    start "ColoAI AI Microservice [PROD] (Port 8000)" cmd /k "python -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
)

echo [2/4] Starting Express Backend on port 5000 (connected to coloai_prod)...
start "ColoAI Express Backend [PROD] (Port 5000)" cmd /k "cd server && npm start"

echo [3/4] Starting React Vite Frontend on port 5173...
start "ColoAI React Frontend [PROD] (Port 5173)" cmd /k "cd client && npm run dev"

echo Waiting 5 seconds for local services to boot...
ping 127.0.0.1 -n 6 > nul

echo [4/4] Starting Cloudflare Public Tunnel and generating live link...
if exist "ai_service\.venv\Scripts\python.exe" (
    start "ColoAI Cloudflare Live Tunnel" cmd /k "ai_service\.venv\Scripts\python.exe tunnel_launcher.py"
) else (
    start "ColoAI Cloudflare Live Tunnel" cmd /k "python tunnel_launcher.py"
)

echo =====================================================================
echo LIVE PRODUCTION ENVIRONMENT LAUNCHED!
echo.
echo The active Cloudflare HTTPS URL will:
echo   1. Print in the "ColoAI Cloudflare Live Tunnel" window
echo   2. Save automatically to LIVE_URL.txt
echo   3. Automatically copy to your clipboard
echo   4. Open in your default browser
echo.
echo Demo Credentials:
echo   - Admin: admin@coloaipoly.org (Password123!)
echo   - Researcher: researcher@coloaipoly.org (Password123!)
echo   - Clinician: clinician@coloaipoly.org (Password123!)
echo.
echo Keep all terminal windows open to keep your live link online.
echo =====================================================================
pause
