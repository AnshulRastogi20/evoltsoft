#!/bin/bash

# Development Start Script for EVoltSoft
echo "🚀 Starting EVoltSoft Development Environment"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Windows: Start MongoDB service"
    echo "   On macOS: brew services start mongodb/brew/mongodb-community"
    echo "   On Linux: sudo systemctl start mongod"
fi

echo "✅ Prerequisites check complete"

# Install dependencies if node_modules doesn't exist
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env 2>/dev/null || cat > backend/.env << EOF
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/charging-station-management
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=24h
EOF
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cat > frontend/.env << EOF
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=EVoltSoft Charging Station Manager
VITE_APP_VERSION=1.0.0
EOF
fi

# Seed database
echo "🌱 Seeding database..."
cd backend && npm run seed && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Starting development servers..."
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "💡 Test accounts:"
echo "   Admin: admin@evoltsoft.com / admin123"
echo "   User:  user@evoltsoft.com / user123"
echo ""

# Start servers in background
echo "Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

echo "Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ Both servers are starting..."
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "📱 Open http://localhost:5173 in your browser"
echo ""
echo "🛑 To stop servers, press Ctrl+C or run: ./stop-dev.sh"

# Create stop script
cat > stop-dev.sh << 'EOF'
#!/bin/bash
echo "🛑 Stopping development servers..."
pkill -f "npm start"
pkill -f "npm run dev"
pkill -f "vite"
pkill -f "node server.js"
echo "✅ Servers stopped"
EOF

chmod +x stop-dev.sh

# Wait for user to stop
wait
