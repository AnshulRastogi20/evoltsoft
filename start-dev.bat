@echo off
echo 🚀 Starting EVoltSoft Development Environment

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm and try again.
    pause
    exit /b 1
)

echo ✅ Prerequisites check complete

:: Install dependencies if needed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

:: Create .env files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend .env file...
    (
        echo NODE_ENV=development
        echo PORT=3000
        echo MONGODB_URI=mongodb://localhost:27017/charging-station-management
        echo JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
        echo JWT_EXPIRES_IN=24h
    ) > backend\.env
)

if not exist "frontend\.env" (
    echo 📝 Creating frontend .env file...
    (
        echo VITE_API_BASE_URL=http://localhost:3000/api
        echo VITE_APP_NAME=EVoltSoft Charging Station Manager
        echo VITE_APP_VERSION=1.0.0
    ) > frontend\.env
)

:: Seed database
echo 🌱 Seeding database...
cd backend && npm run seed && cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 🚀 Starting development servers...
echo    Backend:  http://localhost:3000
echo    Frontend: http://localhost:5173
echo.
echo 💡 Test accounts:
echo    Admin: admin@evoltsoft.com / admin123
echo    User:  user@evoltsoft.com / user123
echo.

:: Start backend server
echo Starting backend server...
start "EVoltSoft Backend" cmd /k "cd backend && npm start"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend server
echo Starting frontend server...
start "EVoltSoft Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting in separate windows...
echo 📱 Open http://localhost:5173 in your browser
echo.
echo 🛑 To stop servers, close the command windows or run: stop-dev.bat

pause
