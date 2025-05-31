# 📋 Production Deployment Checklist

## Before Deployment

### Code Preparation
- [ ] All environment variables are configured for production
- [ ] CORS origins updated with production URLs
- [ ] Database connection strings point to MongoDB Atlas
- [ ] JWT secrets are strong and unique
- [ ] All console.log statements reviewed (keep important ones)
- [ ] Error handling is comprehensive
- [ ] Rate limiting is appropriately configured
- [ ] Build scripts are tested locally

### Security Review
- [ ] No hardcoded secrets or passwords in code
- [ ] Environment variables are properly secured
- [ ] HTTPS is enforced everywhere
- [ ] CORS is restrictive (not using wildcards)
- [ ] Rate limiting is enabled
- [ ] Input validation is comprehensive
- [ ] Database user has minimal required permissions

## MongoDB Atlas Setup ✅ (Already Configured)
- [x] Cluster created and configured (`cluster0.jcqy0da.mongodb.net`)
- [x] Database user created (`anshulrastogi20`)
- [ ] Network access configured (verify 0.0.0.0/0 for cloud deployments)
- [x] Connection string obtained and configured
- [x] Database name is set correctly (`evoltsoft`)

## Backend Deployment (Render)
- [ ] Repository connected to Render
- [ ] Build and start commands configured
- [ ] All environment variables set
- [ ] Health check endpoint working
- [ ] Service deployed successfully
- [ ] Logs show no errors
- [ ] Database seeding completed (`npm run seed:prod`)
- [ ] API endpoints responding correctly

## Frontend Deployment (Vercel)
- [ ] Repository connected to Vercel
- [ ] Build configuration is correct
- [ ] Environment variables set in Vercel
- [ ] Build completes successfully
- [ ] No build warnings or errors
- [ ] Static assets are loading correctly

## Post-Deployment Testing
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Protected routes require authentication
- [ ] CRUD operations work for charging stations
- [ ] Map functionality works
- [ ] Profile management works
- [ ] API responses are properly formatted
- [ ] Error handling works as expected

## Performance & Monitoring
- [ ] Page load times are acceptable
- [ ] API response times are reasonable
- [ ] Database queries are optimized
- [ ] Static assets are compressed
- [ ] Monitoring is set up in Render/Vercel
- [ ] Log retention configured

## Final Steps
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates are working
- [ ] CORS updated with final domain names
- [ ] DNS records configured correctly
- [ ] Backup strategy implemented
- [ ] Team access configured
- [ ] Documentation updated with production URLs

## Production URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: `MongoDB Atlas Cluster`

## Emergency Contacts
- **MongoDB Atlas Support**: https://support.mongodb.com
- **Render Support**: https://render.com/support
- **Vercel Support**: https://vercel.com/support

## Rollback Plan
1. Revert to previous Vercel deployment
2. Revert to previous Render deployment
3. Restore database from backup (if needed)
4. Update DNS if custom domain is used

## Notes
- Remember to update environment variables when domains change
- Monitor logs for the first 24 hours after deployment
- Test all functionality thoroughly before announcing launch
- Keep local development environment in sync with production
