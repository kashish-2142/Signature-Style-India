# Deployment Guide for DenimStore

## Render Deployment Instructions

### Prerequisites
1. MongoDB Atlas account (for cloud database)
2. Render account
3. Git repository with your code

### Step 1: Set up MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for all IPs)

### Step 2: Deploy Backend to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the service:
   - **Name**: denim-store-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `NODE_ENV`: production
   - `PORT`: 10000 (Render's default)

### Step 3: Deploy Frontend to Render
1. Create a new Static Site service
2. Configure the service:
   - **Name**: denim-store-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

3. Add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., https://denim-store-backend.onrender.com)

### Step 4: Update CORS Configuration
The backend is already configured to handle production origins. Make sure to update the CORS origins in `backend/server.js` if you change your frontend domain.

## Common Build Issues and Solutions

### Issue 1: Environment Variables Not Set
**Error**: `MONGODB_URI environment variable is not set!`
**Solution**: Add the required environment variables in Render dashboard

### Issue 2: CORS Errors
**Error**: CORS policy blocking requests
**Solution**: The CORS configuration is already updated for production

### Issue 3: Port Issues
**Error**: Port already in use
**Solution**: Use Render's default port (10000) or let Render assign one

### Issue 4: Build Failures
**Error**: npm install fails
**Solution**: 
- Check package.json files for correct dependencies
- Ensure all required files are committed to Git
- Check for syntax errors in code

## Environment Variables Reference

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/denim-store
JWT_SECRET=your-super-secret-jwt-key
PORT=10000
NODE_ENV=production
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Testing Deployment

1. **Backend Health Check**: Visit `https://your-backend-url.onrender.com/`
2. **API Test**: Test login endpoint at `https://your-backend-url.onrender.com/api/auth/login`
3. **Frontend**: Visit your frontend URL and test the application

## Troubleshooting

### If Backend Won't Start
1. Check environment variables in Render dashboard
2. Verify MongoDB connection string
3. Check logs in Render dashboard

### If Frontend Won't Build
1. Check for syntax errors in React components
2. Verify all dependencies are in package.json
3. Check for missing imports

### If API Calls Fail
1. Verify REACT_APP_API_URL is set correctly
2. Check CORS configuration
3. Ensure backend is running and accessible

## Security Notes

1. **JWT_SECRET**: Use a strong, random string in production
2. **MongoDB**: Use MongoDB Atlas with proper authentication
3. **CORS**: Only allow necessary origins
4. **Environment Variables**: Never commit .env files to Git

## Performance Optimization

1. **Database**: Use MongoDB Atlas with proper indexing
2. **Frontend**: Build is optimized for production
3. **Caching**: Consider adding Redis for session storage
4. **CDN**: Use a CDN for static assets

## Monitoring

1. **Render Dashboard**: Monitor service health and logs
2. **MongoDB Atlas**: Monitor database performance
3. **Application Logs**: Check for errors and performance issues
