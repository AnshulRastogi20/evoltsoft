#!/bin/bash

echo "🚀 Building EVoltSoft for Production"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci --production

echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output is in the 'dist' directory"
echo "🌐 Ready for deployment to Vercel, Netlify, or any static hosting"

# Check if dist directory was created
if [ -d "dist" ]; then
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi
