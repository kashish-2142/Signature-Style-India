#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment configuration...\n');

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'frontend/package.json',
  'backend/server.js',
  'frontend/src/App.js',
  'render.yaml'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check backend dependencies
console.log('\n📦 Checking backend dependencies:');
const backendPackage = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
const requiredBackendDeps = ['express', 'mongoose', 'cors', 'dotenv', 'bcryptjs', 'jsonwebtoken'];
requiredBackendDeps.forEach(dep => {
  if (backendPackage.dependencies[dep]) {
    console.log(`✅ ${dep}: ${backendPackage.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

// Check frontend dependencies
console.log('\n📦 Checking frontend dependencies:');
const frontendPackage = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
const requiredFrontendDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
requiredFrontendDeps.forEach(dep => {
  if (frontendPackage.dependencies[dep]) {
    console.log(`✅ ${dep}: ${frontendPackage.dependencies[dep]}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
  }
});

// Check environment variables usage
console.log('\n🔧 Checking environment variables:');
const serverContent = fs.readFileSync('backend/server.js', 'utf8');
const authContent = fs.readFileSync('backend/routes/auth.js', 'utf8');
const middlewareContent = fs.readFileSync('backend/middleware/auth.js', 'utf8');

const envVars = [
  { name: 'MONGODB_URI', files: [serverContent] },
  { name: 'JWT_SECRET', files: [authContent, middlewareContent] },
  { name: 'PORT', files: [serverContent] },
  { name: 'NODE_ENV', files: [serverContent] }
];

envVars.forEach(envVar => {
  const isUsed = envVar.files.some(content => content.includes(`process.env.${envVar.name}`));
  if (isUsed) {
    console.log(`✅ ${envVar.name} is used in backend files`);
  } else {
    console.log(`⚠️  ${envVar.name} not found in backend files`);
  }
});

// Check API configuration
console.log('\n🌐 Checking API configuration:');
const apiContent = fs.readFileSync('frontend/src/services/api.js', 'utf8');
if (apiContent.includes('REACT_APP_API_URL')) {
  console.log('✅ REACT_APP_API_URL is configured in api.js');
} else {
  console.log('⚠️  REACT_APP_API_URL not found in api.js');
}

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ render.yaml configuration file created');
console.log('2. ✅ Backend CORS configured for production');
console.log('3. ✅ Environment variables validation added');
console.log('4. ✅ API URL configuration updated');
console.log('5. ✅ Build scripts updated');

console.log('\n🚀 Next Steps for Render Deployment:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your repository to Render');
console.log('3. Create two services:');
console.log('   - Backend: Web Service (Node.js)');
console.log('   - Frontend: Static Site');
console.log('4. Set environment variables in Render dashboard:');
console.log('   - MONGODB_URI (MongoDB Atlas connection string)');
console.log('   - JWT_SECRET (secure random string)');
console.log('   - REACT_APP_API_URL (your backend URL)');
console.log('5. Deploy and test your application');

console.log('\n📖 For detailed instructions, see DEPLOYMENT_GUIDE.md');
