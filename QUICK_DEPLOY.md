# 🚀 Production Deployment Quick Start Guide

## Prerequisites
- [x] Node.js 18+ installed
- [x] npm 8+ installed
- [x] Git repository setup
- [ ] MongoDB Atlas account
- [ ] Render account
- [ ] Vercel account

## 1. Run Deployment Script

### Windows:
```bash
./deploy-prod.bat
```

### Linux/macOS:
```bash
chmod +x deploy-prod.sh
./deploy-prod.sh
```

## 2. MongoDB Atlas Setup (Already Done! ✅)

Your MongoDB Atlas is already configured:
- **Connection String**: `mongodb+srv://cluster0.jcqy0da.mongodb.net/`
- **Username**: `anshulrastogi20`
- **Password**: `TUEwtr4LX4Itz3hU`
- **Database**: `evoltsoft`

Complete connection string for deployment:
```
mongodb+srv://anshulrastogi20:TUEwtr4LX4Itz3hU@cluster0.jcqy0da.mongodb.net/evoltsoft?retryWrites=true&w=majority
```

**Note**: Make sure your MongoDB Atlas cluster allows connections from `0.0.0.0/0` (all IPs) or add Render's IP addresses to the whitelist.

## 3. Backend Deployment (Render) - 3 minutes

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Repository: Your GitHub repo
5. Root Directory: `backend`
6. Environment: `Node`
7. Build Command: `npm install --production`
8. Start Command: `npm start`
9. Set Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://anshulrastogi20:TUEwtr4LX4Itz3hU@cluster0.jcqy0da.mongodb.net/evoltsoft?retryWrites=true&w=majority
   JWT_SECRET=evoltsoft_production_jwt_secret_key_minimum_32_characters_for_security
   CORS_ORIGIN=https://your-app.vercel.app
   FRONTEND_URL=https://your-app.vercel.app
   ```
10. Deploy!

## 4. Frontend Deployment (Vercel) - 2 minutes

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import GitHub repository
3. Framework Preset: `Vite`
4. Root Directory: `frontend`
5. Set Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-render-app.onrender.com/api
   VITE_APP_NAME=EVoltSoft Charging Station Manager
   VITE_APP_ENV=production
   VITE_MAP_DEFAULT_LAT=28.6139
   VITE_MAP_DEFAULT_LNG=77.2090
   VITE_MAP_DEFAULT_ZOOM=10
   ```
6. Deploy!

## 5. Final Configuration (2 minutes)

1. Update Render environment variables:
   - `CORS_ORIGIN`: Your actual Vercel URL
   - `FRONTEND_URL`: Your actual Vercel URL

2. Test the deployment:
   - Visit your Vercel URL
   - Register a new account
   - Login and test functionality

## 🎉 Your app is now live!

### URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-render-app.onrender.com`
- **Health Check**: `https://your-render-app.onrender.com/api/health`

### Next Steps:
1. Set up custom domain (optional)
2. Configure monitoring and analytics
3. Set up CI/CD pipeline
4. Add SSL certificates (automatic with Vercel/Render)

## 🔧 Troubleshooting

### Common Issues:
1. **CORS errors**: Check CORS_ORIGIN in Render matches Vercel URL
2. **Database connection**: Verify MongoDB URI and network access
3. **Build failures**: Check Node.js version compatibility
4. **Environment variables**: Ensure all required variables are set

### Health Checks:
- Backend: `GET /api/health`
- Frontend: Check browser console for errors
- Database: MongoDB Atlas monitoring dashboard

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions or `DEPLOYMENT_CHECKLIST.md` for verification steps.
