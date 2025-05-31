# 🚀 Production Deployment Guide

This guide walks you through deploying EVoltSoft to production using:
- **MongoDB Atlas** (Database)
- **Render** (Backend API)
- **Vercel** (Frontend)

## 📋 Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **MongoDB Atlas Account** - [Create free account](https://www.mongodb.com/cloud/atlas)
3. **Render Account** - [Create free account](https://render.com)
4. **Vercel Account** - [Create free account](https://vercel.com)

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create Database Cluster
1. Log into MongoDB Atlas
2. Click "Build a Database"
3. Choose "M0 FREE" cluster
4. Select a region close to your users
5. Name your cluster (e.g., `evoltsoft-cluster`)

### 1.2 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `evoltsoft-admin`
5. Generate a secure password and save it
6. Give "Read and write to any database" privileges

### 1.3 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Confirm the change

### 1.4 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" driver
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `evoltsoft`

Example: `mongodb+srv://evoltsoft-admin:YOUR_PASSWORD@evoltsoft-cluster.abc123.mongodb.net/evoltsoft?retryWrites=true&w=majority`

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Create Web Service
1. Log into Render
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `your-username/evoltsoft`
5. Configure the service:
   - **Name**: `evoltsoft-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Configure Environment Variables
In Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a secure 32+ character string |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://your-app-name.vercel.app` (update later) |
| `CORS_ORIGIN` | `https://your-app-name.vercel.app` (update later) |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | `5` |
| `BCRYPT_ROUNDS` | `12` |

### 2.3 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Note your backend URL: `https://evoltsoft-backend.onrender.com`

### 2.4 Seed the Database
1. Go to Render dashboard → your service
2. Click "Shell" tab
3. Run: `npm run seed:prod`
4. Verify data was created

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Update `backend/server.js` CORS origins with your Vercel URL
2. Push changes to GitHub

### 3.2 Deploy to Vercel
1. Log into Vercel
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Configure Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://evoltsoft-backend.onrender.com/api` |
| `VITE_APP_NAME` | `EVoltSoft Charging Station Manager` |
| `VITE_APP_VERSION` | `1.0.0` |
| `VITE_APP_ENV` | `production` |

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment (3-5 minutes)
3. Note your frontend URL: `https://your-app-name.vercel.app`

## 🔄 Step 4: Update CORS Configuration

### 4.1 Update Backend Environment Variables
1. Go to Render dashboard → your backend service
2. Update these environment variables:
   - `FRONTEND_URL`: Your actual Vercel URL
   - `CORS_ORIGIN`: Your actual Vercel URL

### 4.2 Update Code (if needed)
1. In `backend/server.js`, update the CORS allowedOrigins array:
```javascript
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  'https://your-actual-vercel-url.vercel.app',
  // ... keep localhost for development
];
```
2. Push changes to trigger redeployment

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Frontend
1. Visit your Vercel URL
2. Verify the app loads correctly
3. Check browser console for errors

### 5.2 Test Authentication
1. Register a new account
2. Login with test accounts:
   - Admin: `admin@evoltsoft.com` / `admin123`
   - User: `user@evoltsoft.com` / `user123`

### 5.3 Test API Features
1. View charging stations on Dashboard
2. Add a new charging station
3. View stations on Map
4. Update your profile

## 🔧 Step 6: Configure Custom Domain (Optional)

### 6.1 For Vercel (Frontend)
1. Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS with your domain provider

### 6.2 For Render (Backend)
1. Render Dashboard → Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update environment variables with new URLs

## 📊 Step 7: Monitor Your Application

### 7.1 Render Monitoring
- Check logs: Render Dashboard → Logs
- Monitor performance: Render Dashboard → Metrics

### 7.2 Vercel Monitoring
- Check deployments: Vercel Dashboard → Deployments
- Monitor performance: Vercel Dashboard → Analytics

### 7.3 MongoDB Atlas Monitoring
- Monitor database: Atlas Dashboard → Metrics
- Check connections: Atlas Dashboard → Real-time Performance Panel

## 🔒 Step 8: Security Checklist

- ✅ Strong JWT secret (32+ characters)
- ✅ Database user with minimal privileges
- ✅ CORS configured for your domain only
- ✅ Rate limiting enabled
- ✅ HTTPS enforced (automatic with Vercel/Render)
- ✅ Environment variables secured
- ✅ No sensitive data in code

## 🚨 Troubleshooting

### Common Issues:

**1. CORS Errors**
- Verify `FRONTEND_URL` and `CORS_ORIGIN` in Render
- Check backend logs for CORS messages

**2. Database Connection Failed**
- Verify MongoDB Atlas connection string
- Check network access settings (allow 0.0.0.0/0)
- Verify database user credentials

**3. API Requests Failing**
- Check `VITE_API_BASE_URL` in Vercel
- Verify backend service is running in Render
- Check backend logs for errors

**4. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

## 📞 Support

If you encounter issues:
1. Check application logs in respective platforms
2. Verify all environment variables are set correctly
3. Test API endpoints directly using tools like Postman
4. Check network connectivity between services

## 🎉 Congratulations!

Your EVoltSoft application is now live in production! 

- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://evoltsoft-backend.onrender.com
- **Database**: MongoDB Atlas Cluster

Remember to:
- Monitor application performance
- Keep dependencies updated
- Regular database backups
- Scale resources as usage grows
