# SSL/TLS Error Fix Guide

## Error: `TLSV1_ALERT_INTERNAL_ERROR`

This SSL error typically occurs due to:
1. **Node.js version compatibility issues**
2. **SSL certificate validation problems**
3. **Network/proxy issues**
4. **Incorrect HTTPS requests**

## Quick Fixes

### 1. Update Node.js Version
```bash
# Check your Node.js version
node --version

# Update to latest LTS version (recommended: 18.x or 20.x)
# Download from: https://nodejs.org/
```

### 2. Fix Axios SSL Configuration

Update your API service to handle SSL issues:

```javascript
// In frontend/src/services/api.js
import axios from "axios";

// Base URL for all API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with SSL configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Add SSL configuration for development
  httpsAgent: process.env.NODE_ENV === 'development' ? 
    new (require('https').Agent)({
      rejectUnauthorized: false
    }) : undefined
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling for SSL issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNRESET' || error.message.includes('SSL')) {
      console.error('SSL/TLS Error:', error.message);
      // Retry with different SSL configuration
      return api.request({
        ...error.config,
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      });
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Environment Variables for SSL

Add these to your `.env` files:

#### Backend (.env)
```env
# SSL Configuration
NODE_TLS_REJECT_UNAUTHORIZED=0
```

#### Frontend (.env)
```env
# Disable SSL verification for development
GENERATE_SOURCEMAP=false
```

### 4. Package.json Scripts Update

Update your package.json to handle SSL issues:

```json
{
  "scripts": {
    "dev": "NODE_TLS_REJECT_UNAUTHORIZED=0 concurrently \"npm run server\" \"npm run client\"",
    "server": "NODE_TLS_REJECT_UNAUTHORIZED=0 cd backend && npm run dev",
    "client": "cd frontend && npm start",
    "start": "NODE_TLS_REJECT_UNAUTHORIZED=0 cd backend && npm start"
  }
}
```

### 5. Windows-Specific Fixes

For Windows users, add these environment variables:

```cmd
# In Command Prompt or PowerShell
set NODE_TLS_REJECT_UNAUTHORIZED=0
set NODE_OPTIONS=--openssl-legacy-provider
```

### 6. Clear npm Cache

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment Fixes

### For Render Deployment

Add these environment variables in Render dashboard:

```env
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_OPTIONS=--openssl-legacy-provider
```

### For Local Development

Create a `.env.local` file in your project root:

```env
# SSL Configuration
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_OPTIONS=--openssl-legacy-provider

# Development settings
GENERATE_SOURCEMAP=false
```

## Test the Fix

1. **Stop all running servers**
2. **Clear cache and reinstall dependencies**
3. **Start the application with SSL fixes**

```bash
# Stop all processes
# Clear cache
npm cache clean --force

# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install

# Start with SSL fixes
npm run dev
```

## Alternative Solutions

### 1. Use HTTP instead of HTTPS for local development
Make sure all local development URLs use `http://` not `https://`

### 2. Update axios to latest version
```bash
npm install axios@latest
```

### 3. Use a different HTTP client
Consider using `fetch` instead of axios for simple requests:

```javascript
// Alternative to axios
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@demo.com',
    password: 'password123'
  })
});
```

## Common Causes and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `TLSV1_ALERT_INTERNAL_ERROR` | Node.js version | Update to LTS version |
| `ECONNRESET` | Network issues | Check firewall/proxy |
| `CERTIFICATE_VERIFY_FAILED` | SSL cert issues | Set `NODE_TLS_REJECT_UNAUTHORIZED=0` |
| `UNABLE_TO_VERIFY_LEAF_SIGNATURE` | Certificate chain | Update Node.js or disable verification |

## Verification

After applying fixes, test your application:

```bash
# Test backend
curl http://localhost:5000/

# Test frontend
curl http://localhost:3000/

# Test API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"password123"}'
```

## Security Note

⚠️ **Important**: The `NODE_TLS_REJECT_UNAUTHORIZED=0` setting disables SSL certificate verification. Only use this for development. In production, ensure proper SSL certificates are configured.
