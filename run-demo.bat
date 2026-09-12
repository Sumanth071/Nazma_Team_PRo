@echo off
title ColoAI-Polyp Diagnostic Platform - One-Click Launcher
echo =====================================================================
echo    COLOAI-POLYP DIAGNOSTIC PLATFORM (MERN + ConvNeXt V2 + SHAP)
echo =====================================================================
echo [1/3] Starting Python FastAPI AI Microservice on port 8000...
start "ColoAI AI Microservice (Port 8000)" cmd /k "ai_service\.venv\Scripts\python.exe -m uvicorn app.main:app --app-dir ai_service --host 0.0.0.0 --port 8000"

echo [2/3] Starting Express Backend on port 5000...
start "ColoAI Express Backend (Port 5000)" cmd /k "cd server && npm start"

echo [3/3] Starting React Vite Frontend on port 5173...
start "ColoAI React Frontend (Port 5173)" cmd /k "cd client && npm run dev"

echo Waiting 5 seconds for services to initialize...
timeout /t 5 /nobreak > nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo =====================================================================
echo SYSTEM READY FOR CLIENT DEMONSTRATION!
echo Login credentials:
echo   - Admin: admin@coloaipoly.org (Password123!)
echo   - Researcher: researcher@coloaipoly.org (Password123!)
echo   - Clinician: clinician@coloaipoly.org (Password123!)
echo Or click any of the 3 1-Click Demo Login buttons on the web screen!
echo =====================================================================
pause
