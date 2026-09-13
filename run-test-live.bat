@echo off
title ColoAI-Polyp TEST ENVIRONMENT - Public Live Tunnel Launcher
echo =====================================================================
echo    COLOAI-POLYP DIAGNOSTIC PLATFORM - [LIVE TEST ENVIRONMENT]
echo    Database: MongoDB Atlas (coloai_test)
echo    Access: Worldwide Public Live HTTPS URL (Cloudflare Tunnel)
echo =====================================================================

echo Configuring TEST environment variables...
copy /Y .env.test .env > nul
copy /Y .env.test server\.env > nul

echo [1/4] Starting Python FastAPI AI Microservice on port 8000...
start "ColoAI AI Microservice [TEST] (Port 8000)" cmd /k "ai_service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"

echo [2/4] Starting Express Backend on port 5000 (connected to coloai_test)...
start "ColoAI Express Backend [TEST] (Port 5000)" cmd /k "cd server && npm start"

echo [3/4] Starting React Vite Frontend on port 5173...
start "ColoAI React Frontend [TEST] (Port 5173)" cmd /k "cd client && npm run dev"

echo Waiting 5 seconds for local services to boot...
timeout /t 5 /nobreak > nul

echo [4/4] Starting Cloudflare Public Tunnel...
start "ColoAI Cloudflare Live Tunnel" cmd /k "cloudflared.exe tunnel --url http://localhost:5173"

echo =====================================================================
echo LIVE TEST ENVIRONMENT LAUNCHED!
echo.
echo Check the "ColoAI Cloudflare Live Tunnel" window for your active
echo public https://*.trycloudflare.com URL.
echo.
echo Demo Credentials:
echo   - Admin: admin@coloaipoly.org (Password123!)
echo   - Researcher: researcher@coloaipoly.org (Password123!)
echo   - Clinician: clinician@coloaipoly.org (Password123!)
echo.
echo Keep the terminal windows open to keep your live link online.
echo =====================================================================
pause
