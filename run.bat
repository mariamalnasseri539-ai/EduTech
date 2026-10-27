@echo off
title Adaptive Learning Platform Launcher
echo ====================================================
echo Starting Personalized Adaptive Learning Platform
echo Zero-Content Cloud Architecture
echo ====================================================

:: Refresh PATH so newly installed PHP & Composer are recognized
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe;%PATH%"

echo [1/2] Starting Laravel Backend on port 8000...
start "Backend API Server" cmd /k "cd backend && php artisan serve --port=8000"

echo [2/2] Starting Frontend Vite Server on port 3000...
start "Frontend UI Server" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================================
echo All services launched!
echo Web Application: http://localhost:3000
echo Laravel API:     http://localhost:8000
echo ====================================================
pause
