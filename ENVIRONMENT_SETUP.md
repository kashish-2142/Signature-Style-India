# Environment Setup for MongoDB Atlas Migration

## Updated Environment Variables

### Backend Environment File (backend/.env)

Create this file in the `backend/` directory:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://kashishsrajawat_db_user:w7WqfrxofdXGTApc@denim-clothing.tyvkkhh.mongodb.net/denim-clothing

# JWT Secret for token signing (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# SSL Configuration (for development)
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_OPTIONS=--openssl-legacy-provider
```

### Frontend Environment File (frontend/.env)

Create this file in the `frontend/` directory:

```env
# API Base URL for development
REACT_APP_API_URL=http://localhost:5000/api

# Disable SSL verification for development
GENERATE_SOURCEMAP=false
```

## Migration Steps

### 1. Run the Migration Script

```bash
# Make sure you have local MongoDB running with data
node migrate-to-atlas.js
```

### 2. Update Environment Files

Create the `.env` files as shown above.

### 3. Test the Connection

```bash
# Test backend with new database
npm run server

# Test API endpoints
curl http://localhost:5000/
curl http://localhost:5000/api/test/users
```

### 4. Update Render Deployment

For production deployment on Render, set these environment variables:

#### Backend Service:
```env
MONGODB_URI=mongodb+srv://kashishsrajawat_db_user:w7WqfrxofdXGTApc@denim-clothing.tyvkkhh.mongodb.net/denim-clothing
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=10000
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_OPTIONS=--openssl-legacy-provider
```

#### Frontend Service:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Database Connection Details

- **Cluster**: denim-clothing.tyvkkhh.mongodb.net
- **Username**: kashishsrajawat_db_user
- **Database**: (will be created automatically)
- **Connection Type**: MongoDB Atlas (cloud)

## Security Notes

⚠️ **Important Security Reminders:**

1. **Never commit `.env` files to Git**
2. **Use different JWT_SECRET values for development and production**
3. **Keep your MongoDB Atlas credentials secure**
4. **Consider using environment-specific connection strings**

## Verification Commands

After migration, verify the data:

```bash
# Check if backend connects to Atlas
npm run server

# Test API endpoints
curl http://localhost:5000/api/test/users
curl http://localhost:5000/api/products

# Check database connection in logs
# Should see: "Connected to MongoDB"
```

## Troubleshooting

### If Migration Fails:

1. **Check local MongoDB is running:**
   ```bash
   # Start MongoDB locally if needed
   mongod
   ```

2. **Verify Atlas connection:**
   ```bash
       # Test Atlas connection
    node -e "
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://kashishsrajawat_db_user:w7WqfrxofdXGTApc@denim-clothing.tyvkkhh.mongodb.net/denim-clothing')
      .then(() => console.log('Atlas connection successful'))
      .catch(err => console.error('Atlas connection failed:', err.message));
    "
   ```

3. **Check network connectivity:**
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check firewall settings

### If Application Won't Start:

1. **Verify environment variables are set correctly**
2. **Check MongoDB Atlas cluster status**
3. **Ensure all dependencies are installed**
4. **Check SSL configuration**

## Next Steps After Migration

1. ✅ **Run migration script**
2. ✅ **Update environment files**
3. ✅ **Test local application**
4. ✅ **Update Render deployment settings**
5. ✅ **Test production deployment**
6. ✅ **Monitor application logs**

## Database Backup

Before switching to Atlas, consider backing up your local data:

```bash
# Export local database
mongodump --db denim-store --out ./backup

# Import to Atlas (if needed)
mongorestore --uri="mongodb+srv://kashishsrajawat_db_user:w7WqfrxofdXGTApc@denim-clothing.tyvkkhh.mongodb.net/" ./backup/denim-store
```
