# Environment Variables Configuration Guide

## Setup Instructions

### 1. Frontend (Vercel) Environment Variables
Configure these in your Vercel dashboard under Project Settings > Environment Variables:

```
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
VITE_APP_NAME=EVoltSoft Charging Station Manager
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_MAP_DEFAULT_LAT=28.6139
VITE_MAP_DEFAULT_LNG=77.2090
VITE_MAP_DEFAULT_ZOOM=10
VITE_DEBUG_MODE=false
VITE_ANALYTICS_ENABLED=true
```

### 2. Backend (Render) Environment Variables
Configure these in your Render dashboard under Service > Environment:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://anshulrastogi20:TUEwtr4LX4Itz3hU@cluster0.jcqy0da.mongodb.net/evoltsoft?retryWrites=true&w=majority
JWT_SECRET=evoltsoft_production_jwt_secret_key_minimum_32_characters_for_security
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=15
SESSION_SECRET=your_session_secret_key
LOG_LEVEL=info
```

### 3. MongoDB Atlas Setup
Your MongoDB Atlas is already configured with:
- **Cluster**: `cluster0.jcqy0da.mongodb.net`
- **Username**: `anshulrastogi20`
- **Password**: `TUEwtr4LX4Itz3hU`
- **Database**: `evoltsoft`

Make sure to:
1. Verify network access allows connections from `0.0.0.0/0` (all IPs) or specific Render IPs
2. Ensure the database user has read/write permissions
3. Test the connection string works correctly

### 4. Security Notes
- Use strong, unique secrets for JWT_SECRET and SESSION_SECRET
- Update CORS_ORIGIN with your actual Vercel app URL
- Consider using environment-specific rate limits
- Enable MongoDB Atlas security features (IP whitelisting, authentication)

### 5. Local Development Override
Create a `.env.local` file (already exists) for local development overrides.
This file is gitignored and won't be committed to the repository.
