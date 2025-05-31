@echo off
echo 🚀 Building EVoltSoft for Production

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the frontend directory.
    exit /b 1
)

echo 📦 Installing dependencies...
npm ci --production
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to install dependencies
    exit /b 1
)

echo 🔨 Building application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error: Build failed
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Build output is in the 'dist' directory
echo 🌐 Ready for deployment to Vercel, Netlify, or any static hosting

REM Check if dist directory was created
if exist "dist" (
    echo 📊 Build completed
    dir dist
) else (
    echo ❌ Error: Build failed - dist directory not found
    exit /b 1
)

pause
