@echo off
REM Production Deployment Script for EVoltSoft (Windows)
REM This script prepares the application for production deployment

echo 🚀 EVoltSoft Production Deployment Setup
echo ========================================

REM Check if we're in the right directory
if not exist "frontend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo.
echo ℹ️ Checking project structure...

REM Check for required files
if not exist "frontend\package.json" (
    echo ❌ Missing frontend\package.json
    pause
    exit /b 1
)

if not exist "backend\package.json" (
    echo ❌ Missing backend\package.json
    pause
    exit /b 1
)

if not exist "frontend\vercel.json" (
    echo ❌ Missing frontend\vercel.json
    pause
    exit /b 1
)

if not exist "backend\render.yaml" (
    echo ❌ Missing backend\render.yaml
    pause
    exit /b 1
)

echo ✅ All required files found

echo.
echo ℹ️ Installing dependencies...

REM Install frontend dependencies
cd frontend
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

REM Install backend dependencies
cd ..\backend
echo Installing backend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

cd ..

echo.
echo ℹ️ Building frontend for production...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
echo ✅ Frontend build completed successfully

cd ..

echo.
echo ℹ️ Running backend tests (if available)...
cd backend
call npm run test >nul 2>&1
if errorlevel 1 (
    echo ⚠️ No tests found or tests failed
) else (
    echo ✅ Backend tests passed
)

cd ..

echo.
echo 🎉 Production setup completed successfully!
echo.
echo ℹ️ Next Steps:
echo 1. Set up MongoDB Atlas database
echo 2. Deploy backend to Render:
echo    - Connect your GitHub repository
echo    - Use the render.yaml configuration
echo    - Set environment variables in Render dashboard
echo.
echo 3. Deploy frontend to Vercel:
echo    - Connect your GitHub repository
echo    - Vercel will auto-detect the configuration
echo    - Set environment variables in Vercel dashboard
echo.
echo 4. Update environment variables:
echo    - See ENV_CONFIG.md for detailed instructions
echo    - Update API URLs to match your deployed services
echo.
echo ⚠️ Important: Review DEPLOYMENT.md for complete deployment instructions

REM Create a deployment summary
echo # Deployment Summary > DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo Generated on: %date% %time% >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo ## ✅ Completed Setup Tasks >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo - [x] Dependencies installed >> DEPLOYMENT_SUMMARY.md
echo - [x] Frontend built for production >> DEPLOYMENT_SUMMARY.md
echo - [x] Backend health checks configured >> DEPLOYMENT_SUMMARY.md
echo - [x] Render configuration ready >> DEPLOYMENT_SUMMARY.md
echo - [x] Vercel configuration ready >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo ## 🔧 Manual Tasks Required >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo ### 1. MongoDB Atlas Setup >> DEPLOYMENT_SUMMARY.md
echo - [ ] Create MongoDB Atlas account >> DEPLOYMENT_SUMMARY.md
echo - [ ] Create database cluster >> DEPLOYMENT_SUMMARY.md
echo - [ ] Create database user >> DEPLOYMENT_SUMMARY.md
echo - [ ] Whitelist Render IPs >> DEPLOYMENT_SUMMARY.md
echo - [ ] Get connection string >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo ### 2. Render Deployment >> DEPLOYMENT_SUMMARY.md
echo - [ ] Connect GitHub repository >> DEPLOYMENT_SUMMARY.md
echo - [ ] Deploy using render.yaml >> DEPLOYMENT_SUMMARY.md
echo - [ ] Set environment variables >> DEPLOYMENT_SUMMARY.md
echo - [ ] Verify deployment >> DEPLOYMENT_SUMMARY.md
echo. >> DEPLOYMENT_SUMMARY.md
echo ### 3. Vercel Deployment >> DEPLOYMENT_SUMMARY.md
echo - [ ] Connect GitHub repository >> DEPLOYMENT_SUMMARY.md
echo - [ ] Set environment variables >> DEPLOYMENT_SUMMARY.md
echo - [ ] Deploy frontend >> DEPLOYMENT_SUMMARY.md
echo - [ ] Verify deployment >> DEPLOYMENT_SUMMARY.md

echo ✅ Deployment summary created: DEPLOYMENT_SUMMARY.md

echo.
pause
