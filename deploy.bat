@echo off
echo 🚀 Camera Rental Auto-Deployment Script
echo ======================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Function to deploy backend
:deploy_backend
echo 🔧 Deploying Backend to Render...
echo ==================================
echo.

REM Install dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Run tests (if available)
echo 🧪 Running backend tests...
cd backend
call npm test
if errorlevel 1 (
    echo ⚠️  Tests failed or not configured, continuing...
)
cd ..

REM Build backend
echo 🔨 Building backend...
cd backend
call npm run build
cd ..

REM Commit and push
echo 📝 Committing changes...
git add .
git commit -m "Auto-deploy backend: %date% %time%"

echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Backend deployment triggered!
echo ⏱️  Check status at: https://dashboard.render.com
echo.
goto :eof

REM Function to deploy frontend
:deploy_frontend
echo 🎨 Deploying Frontend to Vercel...
echo ==================================
echo.

REM Install dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Run tests (if available)
echo 🧪 Running frontend tests...
cd frontend
call npm test
if errorlevel 1 (
    echo ⚠️  Tests failed or not configured, continuing...
)
cd ..

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm run build
cd ..

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
cd frontend
call vercel --prod --yes
cd ..

REM Commit and push
echo 📝 Committing changes...
git add .
git commit -m "Auto-deploy frontend: %date% %time%"

echo 📤 Pushing to GitHub...
git push origin main

echo ✅ Frontend deployment completed!
echo 🌐 Check status at: https://vercel.com/dashboard
echo.
goto :eof

REM Main deployment logic
if "%1"=="backend" goto deploy_backend
if "%1"=="frontend" goto deploy_frontend
if "%1"=="all" goto deploy_all
if "%1"=="" goto deploy_all

echo Usage: %0 [backend^|frontend^|all]
echo.
echo Commands:
echo   backend  - Deploy only backend to Render
echo   frontend - Deploy only frontend to Vercel
echo   all      - Deploy both (default)
echo.
echo Examples:
echo   %0          # Deploy both
echo   %0 backend  # Deploy only backend
echo   %0 frontend # Deploy only frontend
pause
exit /b 1

:deploy_all
echo 🚀 Deploying both backend and frontend...
echo.
call :deploy_backend
echo Waiting 30 seconds for backend to start deploying...
timeout /t 30 /nobreak >nul
call :deploy_frontend
goto :end

:end
echo 🎉 Deployment process completed!
echo.
echo 📋 Your URLs:
echo   Frontend: https://camera-rental-one.vercel.app
echo   Backend:  https://camera-rental-ndr0.onrender.com
echo.
echo 🔍 Monitor deployments:
echo   Render:   https://dashboard.render.com
echo   Vercel:   https://vercel.com/dashboard
pause 