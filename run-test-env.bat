@echo off
title ColoAI-Polyp TEST ENVIRONMENT - One-Click Launcher
echo =====================================================================
echo    COLOAI-POLYP DIAGNOSTIC PLATFORM - [TEST ENVIRONMENT]
echo    Database: MongoDB Atlas (coloai_test)
echo =====================================================================

echo Configuring TEST environment variables...
copy /Y .env.test .env > nul
copy /Y .env.test server\.env > nul

echo [1/3] Starting Python FastAPI AI Microservice on port 8000...
if exist "ai_service\.venv\Scripts\python.exe" (
    start "ColoAI AI Microservice [TEST] (Port 8000)" cmd /k "ai_service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else if exist "%APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe" (
    start "ColoAI AI Microservice [TEST] (Port 8000)" cmd /k "set PYTHONPATH=%CD%\ai_service\.venv\Lib\site-packages;%CD%\ai_service && %APPDATA%\uv\python\cpython-3.11-windows-x86_64-none\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
) else (
    start "ColoAI AI Microservice [TEST] (Port 8000)" cmd /k "python -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"
)

echo [2/3] Starting Express Backend on port 5000 (connected to coloai_test)...
start "ColoAI Express Backend [TEST] (Port 5000)" cmd /k "cd server && npm start"

echo [3/3] Starting React Vite Frontend on port 5173...
start "ColoAI React Frontend [TEST] (Port 5173)" cmd /k "cd client && npm run dev"

echo Waiting 5 seconds for test services to initialize...
ping 127.0.0.1 -n 6 > nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo =====================================================================
echo TEST ENVIRONMENT READY!
echo Database: coloai_test (Safe for team experimentation)
echo
echo Demo Credentials:
echo   - Admin: admin@coloaipoly.org (Password123!)
echo   - Researcher: researcher@coloaipoly.org (Password123!)
echo   - Clinician: clinician@coloaipoly.org (Password123!)
echo
echo After testing is complete, run: run-prod-env.bat or push to prod!
echo =====================================================================
pause
