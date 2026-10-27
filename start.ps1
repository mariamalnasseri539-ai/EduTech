Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " Starting Personalized Adaptive Learning Platform " -ForegroundColor Yellow
Write-Host " Zero-Content Cloud Architecture " -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan

# Ensure PHP is on PATH for current session
$phpDir = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe"
if (Test-Path $phpDir) {
    $env:Path = "$phpDir;" + $env:Path
}

# 1. Start Laravel Backend Server
Write-Host "[1/2] Launching Laravel Backend (Port 8000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; php artisan serve --port=8000"

# 2. Start Frontend Dev Server
Write-Host "[2/2] Launching React Vite Dev Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nAll services active!" -ForegroundColor Green
Write-Host "Web Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API:     http://localhost:8000" -ForegroundColor Cyan
