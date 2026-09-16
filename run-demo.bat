@echo off
title ColoAI-Polyp Diagnostic Platform - One-Click Launcher
echo =====================================================================
echo    COLOAI-POLYP DIAGNOSTIC PLATFORM (MERN + Deep Learning + SHAP)
echo =====================================================================

if not exist server\.env (
    echo Setting up test environment configuration...
    copy /Y .env.test .env > nul
    copy /Y .env.test server\.env > nul
)

echo [1/3] Starting Python FastAPI AI Microservice on port 8000...
if exist "ai_service\.venv\Scripts\python.exe" (
    start "ColoAI AI Microservice (Port 8000)" cmd /k "ai_service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else if exist "%APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe" (
    start "ColoAI AI Microservice (Port 8000)" cmd /k "set PYTHONPATH=%CD%\ai_service\.venv\Lib\site-packages;%CD%\ai_service && %APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else (
    start "ColoAI AI Microservice (Port 8000)" cmd /k "python -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
)

echo [2/3] Starting Express Backend on port 5000...
start "ColoAI Express Backend (Port 5000)" cmd /k "cd server && npm start"

echo [3/3] Starting React Vite Frontend on port 5173...
start "ColoAI React Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo Waiting 5 seconds for services to initialize...
ping 127.0.0.1 -n 6 > nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo =====================================================================
echo SYSTEM READY FOR PRESENTATION & DEMONSTRATION!
echo Login credentials:
echo   - Admin: admin@coloaipoly.org (Password123!)
echo   - Researcher: researcher@coloaipoly.org (Password123!)
echo   - Clinician: clinician@coloaipoly.org (Password123!)
echo Or click any of the 3 1-Click Demo Login buttons on the web screen!
echo =====================================================================
pause
