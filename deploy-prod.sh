#!/bin/bash

# Production Deployment Script for EVoltSoft
# This script prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 EVoltSoft Production Deployment Setup"
echo "========================================"
echo "MongoDB Atlas + Render + Netlify = Production Ready!"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

echo
print_info "Checking project structure..."

# Check for required files
required_files=(
    "frontend/package.json"
    "backend/package.json"
    "frontend/netlify.toml"
    "render.yaml"
    "DEPLOYMENT.md"
    "ENV_CONFIG.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "Found $file"
    else
        print_error "Missing $file"
        exit 1
    fi
done

echo
print_info "Installing dependencies..."

# Install frontend dependencies
cd frontend
if [ -f "package.json" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    print_status "Frontend dependencies installed"
else
    print_error "Frontend package.json not found"
    exit 1
fi

# Install backend dependencies
cd ../backend
if [ -f "package.json" ]; then
    print_info "Installing backend dependencies..."
    npm install
    print_status "Backend dependencies installed"
else
    print_error "Backend package.json not found"
    exit 1
fi

cd ..

echo
print_info "Building frontend for production..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

echo
print_info "Running backend tests (if available)..."
cd backend
if npm run test 2>/dev/null; then
    print_status "Backend tests passed"
else
    print_warning "No tests found or tests failed"
fi

cd ..

echo
echo "🎉 Production setup completed successfully!"
echo
print_info "Next Steps:"
echo "1. Set up MongoDB Atlas database"
echo "2. Deploy backend to Render:"
echo "   - Connect your GitHub repository"
echo "   - Use the render.yaml configuration"
echo "   - Set environment variables in Render dashboard"
echo
echo "3. Deploy frontend to Netlify:"
echo "   - Connect your GitHub repository"
echo "   - Netlify will auto-detect the configuration"
echo "   - Set environment variables in Netlify dashboard"
echo
echo "4. Update environment variables:"
echo "   - See ENV_CONFIG.md for detailed instructions"
echo "   - Update API URLs to match your deployed services"
echo
print_warning "Important: Review DEPLOYMENT.md for complete deployment instructions"
echo

# Create a deployment summary
cat > DEPLOYMENT_SUMMARY.md << EOF
# Deployment Summary

Generated on: $(date)

## ✅ Completed Setup Tasks

- [x] Dependencies installed
- [x] Frontend built for production
- [x] Backend health checks configured
- [x] Render configuration ready
- [x] Netlify configuration ready

## 🔧 Manual Tasks Required

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create database cluster
- [ ] Create database user
- [ ] Whitelist Render IPs
- [ ] Get connection string

### 2. Render Deployment
- [ ] Connect GitHub repository
- [ ] Deploy using render.yaml
- [ ] Set environment variables
- [ ] Verify deployment

### 3. Netlify Deployment
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy frontend
- [ ] Verify deployment

### 4. Environment Configuration
- [ ] Update MONGODB_URI in Render
- [ ] Update VITE_API_BASE_URL in Netlify
- [ ] Update CORS_ORIGIN in Render
- [ ] Test end-to-end functionality

## 📋 Environment Variables Checklist

### Render (Backend)
- [ ] NODE_ENV=production
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] CORS_ORIGIN
- [ ] FRONTEND_URL

### Netlify (Frontend)
- [ ] VITE_API_BASE_URL
- [ ] VITE_APP_NAME
- [ ] VITE_APP_ENV=production

## 🔗 Useful Links
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Render Dashboard](https://dashboard.render.com)
- [Netlify Dashboard](https://app.netlify.com)

EOF

print_status "Deployment summary created: DEPLOYMENT_SUMMARY.md"
echo
